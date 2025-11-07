import jwt from "jsonwebtoken";

export const generateToken = (userId,res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn : "6d",
    });
     res.cookie("jwt",token ,{
        maxAge : 6*24*60*60*1000, // in milliseconds
        httpOnly:true, // prevent XSS attack : cross -site scripting
        sameSite:true, // prevents CSRF attacks
        secure : process.env.NODE_ENV === "Development" ? false : true,
     });

     return token;
};