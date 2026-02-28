import jwt from "jsonwebtoken";
import {ENV} from "./env.js"

const isProduction = ENV.NODE_ENV !== "development";

export const generateToken = (userId,res)=>{
    const token = jwt.sign({userId},ENV.JWT_SECRET,{
        expiresIn : "6d",
    });
     res.cookie("jwt",token ,{
        maxAge : 6*24*60*60*1000, // in milliseconds
        httpOnly:true, // prevent XSS attack : cross -site scripting
        sameSite: isProduction ? "none" : "strict", // "none" required for cross-origin cookies
        secure : isProduction, // must be true when sameSite is "none"
     });
     return token;
};