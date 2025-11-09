import express from "express";
import { get } from "mongoose";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllContacts,getMessagesByUserId ,sendMessage ,getChatPartners } from "../controllers/message.controller.js";
import arcjet from "@arcjet/node";    
import { arcjetProtection } from "../middleware/arcjet.middleware.js";  

const router = express.Router();
router.use(arcjetProtection,protectRoute)

router.get("/contacts",getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id",getMessagesByUserId);
router.get("/send/:id",sendMessage);


export default router;