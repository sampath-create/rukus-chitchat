import User from "../Models/User.js"
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/utils.js"
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
