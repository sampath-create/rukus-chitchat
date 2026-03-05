import Message from "../Models/message.js";
import User from "../Models/User.js";
import {cloudinary} from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async (req ,res) => {
    try{
        const loggedInuserId = req.user._id
        const fillteredusers = await User.find({ _id: { $ne: loggedInuserId } }).select("-password");
        res.status(200).json(fillteredusers);
    }
    catch(error){
        console.error("Error in getAllContacts controller:",error);
        res.status(500).json({message : "Internal Server Error"})
    }
};
export const getMessagesByUserId=async (req,res)=>{
    try{
        const myId = req.user._id;
        const {id:usertochat}=req.params;
        const messages= await Message.find({
            $or : [
                {senderId :myId , receiverId : usertochat},
                {senderId :usertochat , receiverId : myId}
            ]
        })

        // Auto-mark all unseen messages FROM the other user as "seen"
        const unseenIds = messages
            .filter(m => m.receiverId.toString() === myId.toString() && !m.seen)
            .map(m => m._id);

        if (unseenIds.length > 0) {
            const now = new Date();
            await Message.updateMany(
                { _id: { $in: unseenIds } },
                { $set: { seen: true, seenAt: now, expiresAt: new Date(now.getTime() + 60 * 1000) } }
            );
            // Update the in-memory messages before sending response
            messages.forEach(m => {
                if (unseenIds.some(id => id.toString() === m._id.toString())) {
                    m.seen = true;
                    m.seenAt = now;
                    m.expiresAt = new Date(now.getTime() + 60 * 1000);
                }
            });
            // Notify the sender in real-time that their messages have been seen
            const senderSocketId = getReceiverSocketId(usertochat.toString());
            if (senderSocketId) {
                io.to(senderSocketId).emit("messagesSeen", {
                    by: myId.toString(),
                    messageIds: unseenIds.map(id => id.toString()),
                });
            }
        }

        res.status(200).json(messages);
    }
    catch(error){
        res.status(500).json({message : "Internal Server Error"});
        console.log(error);
    }

}
export const sendMessage=async (req,res)=>{
    try{
        const {text , image} = req.body;
        const {id:receiverId}=req.params;
        const senderId = req.user._id;
        if (!text && !image){
            return res.status(400).json({message : "Message content is empty"});
        } 
        const receiverExists = await User.findById(receiverId);
        if (!receiverExists){
            return res.status(404).json({message : "Receiver not found"});
        }
        let imageUrl;
        if (image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl= uploadResponse.secure_url;
         }

         const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image : imageUrl,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // auto-delete after 24h if unseen
         });
         await newMessage.save();
         //todo : send real time data through socket.io
            const receiverSocketId = getReceiverSocketId(receiverId.toString());
            if (receiverSocketId){
                io.to(receiverSocketId).emit("newMessage", newMessage);
         }
         res.status(201).json(newMessage);
    }
    catch(error){
        console.error("Error in sendMessage controller:",error);
        res.status(500).json({message : "Internal Server Error"})
    }
}
export const getChatPartners = async (req,res) =>{
    try{
        const loggedInuserId = req.user._id;
        const messages = await Message.find({
            $or :[
                {senderId : loggedInuserId},
                {receiverId : loggedInuserId}   
            ]
        })
        const ChatPartnerIds =[...new Set(messages.map((med) =>{
            return med.senderId.toString() === loggedInuserId.toString() ? med.receiverId.toString() : med.senderId.toString();
        }

        ))];

        const chatPartners =await User.find({_id : {$in : ChatPartnerIds}}).select("-password");
        res.status(200).json(chatPartners);
    }
    catch(error){
        console.error("Error in getChatPartners controller:",error);
        res.status(500).json({message : "Internal Server Error"})
    }

}

export const deleteMessage = async (req, res) => {
    try {
        const myId = req.user._id;
        const { messageId } = req.params;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (message.senderId.toString() !== myId.toString()) {
            return res.status(403).json({ message: "You can only delete your own messages" });
        }

        await Message.findByIdAndDelete(messageId);

        return res.status(200).json({ message: "Message deleted", messageId: message._id });
    } catch (error) {
        console.error("Error in deleteMessage controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const editMessage = async (req, res) => {
    try {
        const myId = req.user._id;
        const { messageId } = req.params;
        const { text } = req.body;

        const nextText = String(text ?? "").trim();
        if (!nextText) {
            return res.status(400).json({ message: "Message text is required" });
        }

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (message.senderId.toString() !== myId.toString()) {
            return res.status(403).json({ message: "You can only edit your own messages" });
        }

        message.text = nextText;
        await message.save();

        return res.status(200).json(message);
    } catch (error) {
        console.error("Error in editMessage controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete the entire chat (all messages) between the logged-in user and another user
export const deleteChatWithUser = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: partnerId } = req.params;

        const result = await Message.deleteMany({
            $or: [
                { senderId: myId, receiverId: partnerId },
                { senderId: partnerId, receiverId: myId },
            ],
        });

        return res.status(200).json({
            message: "Chat deleted",
            deletedCount: result.deletedCount,
            partnerId,
        });
    } catch (error) {
        console.error("Error in deleteChatWithUser controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Mark all unseen messages from a specific sender as seen
// This is also called via socket, but having an HTTP endpoint is useful as a fallback
export const markMessagesSeen = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: senderId } = req.params;

        const now = new Date();
        const result = await Message.updateMany(
            { senderId, receiverId: myId, seen: false },
            { $set: { seen: true, seenAt: now, expiresAt: new Date(now.getTime() + 60 * 1000) } }
        );

        // Notify the sender in real-time
        if (result.modifiedCount > 0) {
            const senderSocketId = getReceiverSocketId(senderId.toString());
            if (senderSocketId) {
                // Fetch the ids of the updated messages to send to the sender
                const seenMessages = await Message.find(
                    { senderId, receiverId: myId, seen: true, seenAt: now },
                    { _id: 1 }
                );
                io.to(senderSocketId).emit("messagesSeen", {
                    by: myId.toString(),
                    messageIds: seenMessages.map(m => m._id.toString()),
                });
            }
        }

        return res.status(200).json({ modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error("Error in markMessagesSeen controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};