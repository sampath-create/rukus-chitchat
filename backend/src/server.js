import express from 'express';

import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import { connectDB } from './lib/db.js';
import {ENV} from "./lib/env.js"
import cookieParser from "cookie-parser";
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

// Manual CORS — runs first, guarantees headers on every response including preflight
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

    // Respond to preflight immediately
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users", userRoutes);

if(process.env.NODE_ENV == "production"){
    app.use(express.static(path.join(__dirname ,"../frontend/dist")));

    app.get("{*path}",(req,res)=>{
        res.sendFile(path.join(__dirname ,"../frontend","dist","index.html"));
    });
}


server.listen(PORT,() => {
    console.log("Server is running http://localhost:" +PORT)
    connectDB();
});