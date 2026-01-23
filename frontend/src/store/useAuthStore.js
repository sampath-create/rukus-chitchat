import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8081" : "/";
export const useAuthStore = create((set,get)=>({
        authUser: null,
        isCheckingAuth: true,
        isSigningUp: false,
        isLoggingIn: false,
        isLoggingOut: false,
        socket: null,
        onlineUsers: [],


    checkAuth: async () =>{
        try{
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data && res.data._id ? res.data : null });
            get().connectSocket();
        }
        catch(error){
            console.log("Error in authCheck:",error);
            set({authUser:null});
        }
        finally{
            set({isCheckingAuth:false});
        }

    },

    signup:async(data)=>{
        set({isSigningUp:true});
        try{
            const res = await axiosInstance.post('/auth/signup',data);
            set({authUser:res.data});
            toast.success("Account created , password marchipoke ");
            get().connectSocket();
        }
        catch(error){
            toast.error(error?.response?.data?.message || error?.message || "Signup failed");
        }
        finally{
            set({isSigningUp:false});
        }
    },

    login:async(data)=>{
        set({isLoggingIn:true});
        try{
            const res = await axiosInstance.post('/auth/login',data);
            set({authUser:res.data});
            toast.success("loged in successfully , password gurtundhe ");
            get().connectSocket();
        }
        catch(error){
            toast.error(error?.response?.data?.message || error?.message || "Login failed");
        }
        finally{
            set({isLoggingIn:false});
        }
    },

    logout:async()=>{
        set({ isLoggingOut: true });
        try{
            await axiosInstance.post('/auth/logout');
            toast.success("Logged out successfully");
            set({authUser:null});
            get().disconnectSocket();
        }
        catch(error){
            // Even if the request fails (network / middleware), clear local auth state.
            set({ authUser: null });
            toast.error(error?.response?.data?.message || "Error logging out. Please try again.");
        }
        finally{
            set({ isLoggingOut: false });
        }
    },

    updateProfile:async(data)=>{
        try{
            const res = await axiosInstance.put('/auth/update-profile',data);
            set({authUser:res.data});
            toast.success("Atagallu DP marcharuroy");
        }
        catch(error){
            console.log("Error in update profile:", error);
            toast.error(error?.response?.data?.message || error?.message || "Failed to update profile");
        }

},
    connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true, // this ensures cookies are sent with the connection
    });

    set({ socket });

    // listen for online users event
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

    disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
