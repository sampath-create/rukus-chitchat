import User from "../Models/User.js"
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/utils.js"
import {sendWelcomeEmail} from "../Email/emailHandlers.js"
import {ENV} from "../lib/env.js"
import {cloudinary} from "../lib/cloudinary.js"
export const signup = async (req,res) => {
    const {fullname,email,password} = req.body;
    try {
        if (!fullname || !email || !password) {
            return res.status(400).json({message :"All fields are required"})
        }
        if (password.length <8){
            return res.status(400).json({message : "password must be atlesst 8 characters"})
        }
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            return res.status(400).json({message :"Invalid email format"})
        }

        const user= await User.findOne({email});
        if (user){
            return res.status(400).json({message : "Email already exist's"});
        }

        //hashing the password
        const salt= await bcrypt.genSalt(15);
        const hashedPassword= await bcrypt.hash(password,salt);

        const newUser = new User({
            fullname,
            email,
            password :hashedPassword,
        });
        

        if (newUser){
            generateToken(newUser._id,res);
            await newUser.save();
            
            // Send welcome email
            try{
                await sendWelcomeEmail(newUser.email, newUser.fullname, ENV.CLIENT_URL);
            }
            catch(error){
                console.error("Failed to send Welcome Email :",error);
            }
            
            res.status(201).json({
                _id : newUser._id,
                fullname : newUser.fullname,
                email : newUser.email,
                profilepic : newUser.profilepic,
            });
        }

       
        else {
            res.status(400).json({message :"Invalid user data"});
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({message :"Internal server error"})
    }
}
export const login =async (req,res) =>{

    const {email,password} = req.body;

    try{
        if(!email || !password){
            return res.status(400).json ({message : "All fields are required"});
        }
        const user=await User.findOne({email});
        if (!user){
            return res.status(400).json ({message : "Invalid credintials"});
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if (!passwordMatch){
            return res.status(400).json ({message : "Invalid credintials"});
        }
        generateToken(user._id,res);
        res.status(200).json({
            _id : user._id,
            fullname : user.fullname,
            email : user.email,
            profilepic : user.profilepic,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : "Internal server error"});
    }
}
export const logout =async (_,res) =>{
    res.cookie("jwt", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict",
        secure: ENV.NODE_ENV === "development" ? false : true,
        path: "/",
    });
    res.status(200).json({message: "Logged Out successfully"});
}
export const updateProfile = async (req,res) =>{
    
    try{
        const {profilepic}= req.body;
        if(!profilepic){
            return res.status(400).json({message : "Profile picture is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilepic);
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {profilepic: uploadResponse.secure_url},
            {new: true}
        );
        res.status(200).json(updatedUser);
    }catch(error){
        console.log("Error in updateProfile:", error);
        res.status(500).json({message: "Internal server error"});
    }

};
