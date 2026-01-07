import {create} from "zustand";
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set, get)=>( 
    {
    allContacts:[],
    chats:[],
    messages:[],
    activeTab:"chats",
    selectedUser:null,
    isUserLoading:false,
    isMessageLoading:false,
    isSoundEnabled:JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
    toggleSound:()=>{
        const newValue = !get().isSoundEnabled;
        localStorage.setItem("isSoundEnabled", newValue.toString());
        set({isSoundEnabled: newValue});
                    },
    setActiveTab:(tab)=>set({activeTab:tab}),
    setSelectedUser:(selectedUser)=>set({selectedUser}),

    getAllContacts:async()=>{
        set({isUserLoading:true});
        try{
            const res=await axiosInstance.get("/messages/contacts");
            set({allContacts:res.data});
        }
        catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isUserLoading:false});
        }
    },
    
    getMyChatPartners:async()=>{
        set({isUserLoading:true});
        try{
            const res=await axiosInstance.get("/messages/chats");
            set({chats:res.data});
        }
        catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isUserLoading:false});
        }
    },

    getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
    }
)
);