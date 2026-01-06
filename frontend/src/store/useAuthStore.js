import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from 'react-hot-toast';
export const useAuthStore = create((set)=>({
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
}));
