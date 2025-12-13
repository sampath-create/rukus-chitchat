import {create} from 'zustand';
export const useAuthStore = create((set)=>({
    authUser : {name :"ruku",_id:143,age :25},
    isLoggedIn :false,
    isLoading :false,
    login:()=>{
        console.log("You just logged in");
        set({isLoggedIn:true , isLoading:true});
    }

}));
