import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from 'react-hot-toast';
export const useAuthStore = create((set)=>({
    authUser:null,
    isCheckingAuth:true,
    isSigningnUp:false,
    isLoggingIn:false,

    checkAuth: async () =>{
        try{
            const res = await axiosInstance.get('/auth/check');
            set({authUser:res.data});
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
        set({isSigningnUp:true});
        try{
            const res = await axiosInstance.post('/auth/signup',data);
            set({authUser:res.data});
            toast.success("Account created , password marchipoke ");
        }
        catch(error){
            toast.error(error.response.data.message );
        }
        finally{
            set({isSigningnUp:false});
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
            toast.error(error.response.data.message );
        }
        finally{
            set({isLoggingIn:false});
        }
    },

    logout:async()=>{
        try{
            await axiosInstance.post('/auth/logout');
            toast.success("Logged out successfully");
            set({authUser:null});
        }
        catch(error){
            toast.error("Error logging out. Please try again.");
        }
        finally{
            set({isLoggingIn:false});
        }
    },


}));
