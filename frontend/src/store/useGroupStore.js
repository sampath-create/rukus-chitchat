import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useGroupStore = create((set, get) => ({
    groups: [],
    selectedGroup: null,
    groupMessages: [],
    isGroupsLoading: false,
    isGroupMessagesLoading: false,
    isCreatingGroup: false,

    setSelectedGroup: (group) => set({ selectedGroup: group }),

    // ─── Fetch all groups the user belongs to ───
    getMyGroups: async () => {
        set({ isGroupsLoading: true });
        try {
            const res = await axiosInstance.get("/groups");
            set({ groups: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load groups");
        } finally {
            set({ isGroupsLoading: false });
        }
    },

    // ─── Create a new group ───
    createGroup: async ({ name, memberIds }) => {
        set({ isCreatingGroup: true });
        try {
            const res = await axiosInstance.post("/groups", { name, memberIds });
            set((state) => ({ groups: [res.data, ...state.groups] }));
            toast.success("Group created!");
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create group");
            return null;
        } finally {
            set({ isCreatingGroup: false });
        }
    },

    // ─── Update group (name / pic) ───
    updateGroup: async (groupId, data) => {
        try {
            const res = await axiosInstance.patch(`/groups/${groupId}`, data);
            set((state) => ({
                groups: state.groups.map((g) =>
                    g._id === groupId ? res.data : g
                ),
                selectedGroup:
                    state.selectedGroup?._id === groupId ? res.data : state.selectedGroup,
            }));
            toast.success("Group updated");
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update group");
            return null;
        }
    },

    // ─── Add members (admin only) ───
    addMembers: async (groupId, memberIds) => {
        try {
            const res = await axiosInstance.post(`/groups/${groupId}/members`, { memberIds });
            set((state) => ({
                groups: state.groups.map((g) =>
                    g._id === groupId ? res.data : g
                ),
                selectedGroup:
                    state.selectedGroup?._id === groupId ? res.data : state.selectedGroup,
            }));
            toast.success("Members added");
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add members");
            return null;
        }
    },

    // ─── Leave group ───
    leaveGroup: async (groupId) => {
        try {
            await axiosInstance.post(`/groups/${groupId}/leave`);
            set((state) => ({
                groups: state.groups.filter((g) => g._id !== groupId),
                selectedGroup:
                    state.selectedGroup?._id === groupId ? null : state.selectedGroup,
                groupMessages:
                    state.selectedGroup?._id === groupId ? [] : state.groupMessages,
            }));
            toast.success("You left the group");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to leave group");
        }
    },

    // ─── Delete group (admin only) ───
    deleteGroup: async (groupId) => {
        try {
            await axiosInstance.delete(`/groups/${groupId}`);
            set((state) => ({
                groups: state.groups.filter((g) => g._id !== groupId),
                selectedGroup:
                    state.selectedGroup?._id === groupId ? null : state.selectedGroup,
                groupMessages:
                    state.selectedGroup?._id === groupId ? [] : state.groupMessages,
            }));
            toast.success("Group deleted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete group");
        }
    },

    // ─── Get group messages ───
    getGroupMessages: async (groupId) => {
        set({ isGroupMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/groups/${groupId}/messages`);
            set({ groupMessages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load messages");
        } finally {
            set({ isGroupMessagesLoading: false });
        }
    },

    // ─── Send group message ───
    sendGroupMessage: async (groupId, messageData) => {
        const { authUser } = useAuthStore.getState();
        const tempId = `temp-${Date.now()}`;

        const optimistic = {
            _id: tempId,
            groupId,
            senderId: { _id: authUser._id, fullname: authUser.fullname, profilepic: authUser.profilepic },
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        };

        set((state) => ({ groupMessages: [...state.groupMessages, optimistic] }));

        try {
            const res = await axiosInstance.post(`/groups/${groupId}/messages`, messageData);
            set((state) => ({
                groupMessages: state.groupMessages.map((m) =>
                    m._id === tempId ? res.data : m
                ),
            }));
        } catch (error) {
            set((state) => ({
                groupMessages: state.groupMessages.filter((m) => m._id !== tempId),
            }));
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    },

    // ─── Socket subscriptions ───
    subscribeToGroupEvents: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("groupCreated", (group) => {
            set((state) => {
                if (state.groups.some((g) => g._id === group._id)) return {};
                return { groups: [group, ...state.groups] };
            });
        });

        socket.on("addedToGroup", (group) => {
            set((state) => {
                if (state.groups.some((g) => g._id === group._id)) return {};
                return { groups: [group, ...state.groups] };
            });
        });

        socket.on("groupUpdated", (group) => {
            set((state) => ({
                groups: state.groups.map((g) => (g._id === group._id ? group : g)),
                selectedGroup:
                    state.selectedGroup?._id === group._id ? group : state.selectedGroup,
            }));
        });

        socket.on("groupDeleted", ({ groupId }) => {
            set((state) => ({
                groups: state.groups.filter((g) => g._id !== groupId),
                selectedGroup:
                    state.selectedGroup?._id === groupId ? null : state.selectedGroup,
                groupMessages:
                    state.selectedGroup?._id === groupId ? [] : state.groupMessages,
            }));
        });

        socket.on("newGroupMessage", ({ groupId, message }) => {
            const { selectedGroup } = get();
            if (selectedGroup?._id === groupId) {
                set((state) => ({
                    groupMessages: [...state.groupMessages, message],
                }));
            }
        });
    },

    unsubscribeFromGroupEvents: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("groupCreated");
        socket.off("addedToGroup");
        socket.off("groupUpdated");
        socket.off("groupDeleted");
        socket.off("newGroupMessage");
    },
}));
