import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
import Message from "../Models/message.js";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  ENV.CLIENT_URL?.trim(),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow same-origin or non-browser clients
      if (!origin) return callback(null, true);
      return callback(null, allowedOrigins.includes(origin));
    },
    credentials: true,
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// this is for storig online users
const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.user?.fullname);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle "markSeen" — receiver tells us they've seen messages from a sender
  socket.on("markSeen", async ({ senderId }) => {
    try {
      if (!senderId) return;
      const receiverId = userId; // the socket owner is the receiver
      const now = new Date();

      const result = await Message.updateMany(
        { senderId, receiverId, seen: false },
        { $set: { seen: true, seenAt: now, expiresAt: new Date(now.getTime() + 60 * 1000) } }
      );

      if (result.modifiedCount > 0) {
        // Fetch updated message IDs
        const seenMessages = await Message.find(
          { senderId, receiverId, seen: true, seenAt: now },
          { _id: 1 }
        );
        const messageIds = seenMessages.map(m => m._id.toString());

        // Notify the sender that their messages have been seen
        const senderSocketId = userSocketMap[senderId];
        if (senderSocketId) {
          io.to(senderSocketId).emit("messagesSeen", {
            by: receiverId,
            messageIds,
          });
        }

        // Also notify the receiver so their UI updates the seen status
        socket.emit("messagesSeen", {
          by: receiverId,
          messageIds,
        });
      }
    } catch (error) {
      console.error("Error in markSeen socket handler:", error);
    }
  });

  // with socket.on we listen for events from clients
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user?.fullname);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };