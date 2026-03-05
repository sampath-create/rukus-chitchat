import Group from "../Models/Group.js";
import GroupMessage from "../Models/GroupMessage.js";
import User from "../Models/User.js";
import { cloudinary } from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

// Create a new group — creator becomes admin and first member
export const createGroup = async (req, res) => {
    try {
        const adminId = req.user._id;
        const { name, memberIds } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Group name is required" });
        }

        // memberIds is optional at creation time; admin is always a member
        const uniqueMembers = [
            ...new Set([adminId.toString(), ...(memberIds || [])]),
        ];

        const group = new Group({
            name: name.trim(),
            admin: adminId,
            members: uniqueMembers,
        });
        await group.save();

        // Populate member info for the response
        const populated = await Group.findById(group._id)
            .populate("admin", "-password")
            .populate("members", "-password");

        // Notify all members via socket that they've been added to a group
        uniqueMembers.forEach((memberId) => {
            const socketId = getReceiverSocketId(memberId.toString());
            if (socketId) {
                io.to(socketId).emit("groupCreated", populated);
            }
        });

        return res.status(201).json(populated);
    } catch (error) {
        console.error("Error in createGroup controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all groups the user is a member of
export const getMyGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        const groups = await Group.find({ members: userId })
            .populate("admin", "-password")
            .populate("members", "-password")
            .sort({ updatedAt: -1 });

        return res.status(200).json(groups);
    } catch (error) {
        console.error("Error in getMyGroups controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get a single group by ID
export const getGroupById = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId)
            .populate("admin", "-password")
            .populate("members", "-password");

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Only members can view the group
        if (!group.members.some((m) => m._id.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: "You are not a member of this group" });
        }

        return res.status(200).json(group);
    } catch (error) {
        console.error("Error in getGroupById controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Admin-only: add members to the group
export const addMembers = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { memberIds } = req.body;
        const userId = req.user._id;

        if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
            return res.status(400).json({ message: "Provide at least one member to add" });
        }

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (group.admin.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only the group admin can add members" });
        }

        // Validate that all users exist
        const existingUsers = await User.find({ _id: { $in: memberIds } }).select("_id");
        const validIds = existingUsers.map((u) => u._id.toString());

        const currentMembers = new Set(group.members.map((m) => m.toString()));
        const newMembers = validIds.filter((id) => !currentMembers.has(id));

        if (newMembers.length === 0) {
            return res.status(400).json({ message: "All users are already members" });
        }

        group.members.push(...newMembers);
        await group.save();

        const populated = await Group.findById(groupId)
            .populate("admin", "-password")
            .populate("members", "-password");

        // Notify new members
        newMembers.forEach((memberId) => {
            const socketId = getReceiverSocketId(memberId);
            if (socketId) {
                io.to(socketId).emit("addedToGroup", populated);
            }
        });

        // Notify existing members about new additions
        group.members.forEach((memberId) => {
            const socketId = getReceiverSocketId(memberId.toString());
            if (socketId) {
                io.to(socketId).emit("groupUpdated", populated);
            }
        });

        return res.status(200).json(populated);
    } catch (error) {
        console.error("Error in addMembers controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Any member can leave the group (except admin — admin must delete the group)
export const leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (group.admin.toString() === userId.toString()) {
            return res.status(400).json({ message: "Admin cannot leave. Delete the group or transfer admin first." });
        }

        if (!group.members.some((m) => m.toString() === userId.toString())) {
            return res.status(400).json({ message: "You are not a member of this group" });
        }

        group.members = group.members.filter((m) => m.toString() !== userId.toString());
        await group.save();

        const populated = await Group.findById(groupId)
            .populate("admin", "-password")
            .populate("members", "-password");

        // Notify remaining members
        group.members.forEach((memberId) => {
            const socketId = getReceiverSocketId(memberId.toString());
            if (socketId) {
                io.to(socketId).emit("groupUpdated", populated);
            }
        });

        return res.status(200).json({ message: "You left the group", groupId });
    } catch (error) {
        console.error("Error in leaveGroup controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Admin-only: update group name / pic
export const updateGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name, groupPic } = req.body;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (group.admin.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only the group admin can update the group" });
        }

        if (name) group.name = name.trim();

        if (groupPic) {
            const uploadRes = await cloudinary.uploader.upload(groupPic);
            group.groupPic = uploadRes.secure_url;
        }

        await group.save();

        const populated = await Group.findById(groupId)
            .populate("admin", "-password")
            .populate("members", "-password");

        // Notify all members
        group.members.forEach((memberId) => {
            const socketId = getReceiverSocketId(memberId.toString());
            if (socketId) {
                io.to(socketId).emit("groupUpdated", populated);
            }
        });

        return res.status(200).json(populated);
    } catch (error) {
        console.error("Error in updateGroup controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Admin-only: delete the group entirely
export const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (group.admin.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only the group admin can delete the group" });
        }

        const memberIds = group.members.map((m) => m.toString());

        // Delete all group messages and the group itself
        await GroupMessage.deleteMany({ groupId });
        await Group.findByIdAndDelete(groupId);

        // Notify all members
        memberIds.forEach((memberId) => {
            const socketId = getReceiverSocketId(memberId);
            if (socketId) {
                io.to(socketId).emit("groupDeleted", { groupId });
            }
        });

        return res.status(200).json({ message: "Group deleted", groupId });
    } catch (error) {
        console.error("Error in deleteGroup controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get messages for a group
export const getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (!group.members.some((m) => m.toString() === userId.toString())) {
            return res.status(403).json({ message: "You are not a member of this group" });
        }

        const messages = await GroupMessage.find({ groupId })
            .populate("senderId", "fullname profilepic")
            .sort({ createdAt: 1 });

        return res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getGroupMessages controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Send a message in a group
export const sendGroupMessage = async (req, res) => {
    try {
        const { groupId } = req.params;
        const senderId = req.user._id;
        const { text, image } = req.body;

        if (!text && !image) {
            return res.status(400).json({ message: "Message content is empty" });
        }

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (!group.members.some((m) => m.toString() === senderId.toString())) {
            return res.status(403).json({ message: "You are not a member of this group" });
        }

        let imageUrl;
        if (image) {
            const uploadRes = await cloudinary.uploader.upload(image);
            imageUrl = uploadRes.secure_url;
        }

        const newMessage = new GroupMessage({
            groupId,
            senderId,
            text,
            image: imageUrl,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        await newMessage.save();

        // Populate sender info for the response
        const populated = await GroupMessage.findById(newMessage._id).populate(
            "senderId",
            "fullname profilepic"
        );

        // Emit to all group members except the sender
        group.members.forEach((memberId) => {
            if (memberId.toString() === senderId.toString()) return;
            const socketId = getReceiverSocketId(memberId.toString());
            if (socketId) {
                io.to(socketId).emit("newGroupMessage", {
                    groupId: groupId.toString(),
                    message: populated,
                });
            }
        });

        return res.status(201).json(populated);
    } catch (error) {
        console.error("Error in sendGroupMessage controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
