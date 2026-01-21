import Message from "../Models/message.js";
import User from "../Models/User.js";
import {cloudinary} from "../lib/cloudinary.js";

export const getAllContacts = async (req ,res) => {
    try{
        const loggedInuserId = req.user._id
        const fillteredusers = await User.find({ _id: { $ne: loggedInuserId } }).select("-password");
        res.status(200).json(fillteredusers);
    }
    catch(error){
        console.error("Error in getAllContacts controller:",error);
        res.status(500).json({message : "Internal Server Error"})
    }
};
export const getMessagesByUserId=async (req,res)=>{
    try{
        const myId = req.user._id;
        const {id:usertochat}=req.params;
        const messages= await Message.find({
            $or : [
                {senderId :myId , receiverId : usertochat},
                {senderId :usertochat , receiverId : myId}
            ]
        })
        res.status(200).json(messages);
    }
    catch(error){
        res.status(500).json({message : "Internal Server Error"});
        console.log(error);
    }

}
export const sendMessage=async (req,res)=>{
    try{
        const {text , image} = req.body;
        const {id:receiverId}=req.params;
        const senderId = req.user._id;
        if (!text && !image){
            return res.status(400).json({message : "Message content is empty"});
        } 
        const receiverExists = await User.findById(receiverId);
        if (!receiverExists){
            return res.status(404).json({message : "Receiver not found"});
        }
        let imageUrl;
        if (image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl= uploadResponse.secure_url;
         }

         const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image : imageUrl
         });
         await newMessage.save();
         //todo : send real time data through socket.io
         res.status(201).json(newMessage);
    }
    catch(error){
        console.error("Error in sendMessage controller:",error);
        res.status(500).json({message : "Internal Server Error"})
    }
}
export const getChatPartners = async (req,res) =>{
    try{
        const loggedInuserId = req.user._id;
        const messages = await Message.find({
            $or :[
                {senderId : loggedInuserId},
                {receiverId : loggedInuserId}   
            ]
        })
        const ChatPartnerIds =[...new Set(messages.map((med) =>{
            return med.senderId.toString() === loggedInuserId.toString() ? med.receiverId.toString() : med.senderId.toString();
        }

        ))];

        const chatPartners =await User.find({_id : {$in : ChatPartnerIds}}).select("-password");
        res.status(200).json(chatPartners);
    }
    catch(error){
        console.error("Error in getChatPartners controller:",error);
        res.status(500).json({message : "Internal Server Error"})
    }

}