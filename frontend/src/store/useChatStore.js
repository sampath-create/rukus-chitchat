import {create} from "zustand";
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set, get)=>( 
    {
    allContacts:[],
    chats:[],
    messages:[],
    searchResults:[],
    searchQuery:"",
    searchRequestId: 0,
    activeTab:"chats",
    selectedUser:null,
    // Keep both names to match components that use either one
    isUserLoading:false,
    isUsersLoading:false,
    isMessageLoading:false,
    isMessagesLoading:false,
    isSearchingUsers:false,
    isSoundEnabled:JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
    toggleSound:()=>{
        const newValue = !get().isSoundEnabled;
        localStorage.setItem("isSoundEnabled", newValue.toString());
        set({isSoundEnabled: newValue});
                    },
    setActiveTab:(tab)=>set({activeTab:tab}),
    setSelectedUser:(selectedUser)=>set({selectedUser}),
    setSearchQuery:(searchQuery)=>set({searchQuery}),
    clearSearch:()=>set({searchQuery:"", searchResults:[]}),

    getAllContacts:async()=>{
        set({isUserLoading:true,isUsersLoading:true});
        try{
            const res=await axiosInstance.get("/messages/contacts");
            set({allContacts:res.data});
        }
        catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isUserLoading:false,isUsersLoading:false});
        }
    },
    
    getMyChatPartners:async()=>{
        set({isUserLoading:true,isUsersLoading:true});
        try{
            const res=await axiosInstance.get("/messages/chats");
            set({chats:res.data});
        }
        catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isUserLoading:false,isUsersLoading:false});
        }
    },

    searchUsers: async (query) => {
        const q = String(query ?? get().searchQuery ?? "").trim();

        // bump request id so older in-flight requests can be ignored
        const requestId = get().searchRequestId + 1;
        set({ searchRequestId: requestId });

        if (!q) {
            set({ searchResults: [], isSearchingUsers: false });
            return;
        }

        set({ isSearchingUsers: true });
        try {
            const res = await axiosInstance.get(`/users/search?q=${encodeURIComponent(q)}`);

            // Ignore if a newer search started while this was in flight
            if (get().searchRequestId !== requestId) return;

            set({ searchResults: res.data });
        } catch (error) {
            // Ignore failures for outdated searches or when user cleared the input
            if (get().searchRequestId !== requestId) return;
            if (!String(get().searchQuery || "").trim()) return;

            const status = error?.response?.status;
            if (status === 401 || status === 403) return;

            toast.error(error.response?.data?.message || "Search failed", { id: "user-search-failed" });
        } finally {
            if (get().searchRequestId === requestId) {
                set({ isSearchingUsers: false });
            }
        }
    },

    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true, isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
            set({ isMessagesLoading: false, isMessageLoading: false });
    }
  },
    sendMessage : async (messageData)=>{
        const {selectedUser,messages}=get();
        const { authUser } = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
        _id: tempId,
        senderId: authUser._id,
        receiverId: selectedUser._id,
        text: messageData.text,
        image: messageData.image,
        createdAt: new Date().toISOString(),
        isOptimistic: true, // flag to identify optimistic messages (optional)
        };
    // immidetaly update the ui by adding the message
    set({ messages: [...messages, optimisticMessage] });
        try{
            const res= await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages:messages.concat(res.data)});
            getMessagesByUserId (selectedUser._id);
        }
        catch(error){
        set({ messages: messages });
        toast.error(error.response?.data?.message || "Something went wrong");        }
    },

}
)
);