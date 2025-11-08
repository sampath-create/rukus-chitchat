import jwt from "jsonwebtoken";
import {ENV} from "../lib/env.js";
import User from "../Models/User.js";

export const protectRoute = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message : "Not authorized - no token provided"});
        }
        const decoded=jwt.verify(token,ENV.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message : "Not authorized - invalid token"});
        }
        const user= await User.findById(decoded.userId).select("-password");
        if (!user){
            return res.status(401).json({message : "User not found"});
        }
        //by this we can write req.user in any controller to get the user details
        req.user = user;
        next();
    }
    catch(error){
        console.error("Error in protectRoute middleware:",error);
        return res.status(500).json({message : "Internal server error"});
    }
}