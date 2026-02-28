import express from 'express';

import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import { connectDB } from './lib/db.js';
import {ENV} from "./lib/env.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import {app, server}from "./lib/socket.js";

const __dirname =path.resolve();

const PORT = ENV.PORT;

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const allowedOrigins = [
    ENV.CLIENT_URL?.trim(),
    "https://rukus-chitchat.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
].filter(Boolean);

app.use(cors({
    origin : function (origin, callback) {
        // allow non-browser requests (e.g. Postman, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials : true,
}));

// Handle preflight OPTIONS for all routes
app.options("*", cors());

app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users", userRoutes);

if(process.env.NODE_ENV == "production"){
    app.use(express.static(path.join(__dirname ,"../frontend/dist")));

    app.get(/.*/,(req,res)=>{
        res.sendFile(path.join(__dirname ,"../frontend","dist","index.html"));
    });
}


server.listen(PORT,() => {
    console.log("Server is running http://localhost:" +PORT)
    connectDB();
});