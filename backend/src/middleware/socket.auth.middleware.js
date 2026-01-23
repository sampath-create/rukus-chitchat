import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import { ENV } from "../lib/env.js";

const getCookieValue = (cookieHeader, name) => {
  if (!cookieHeader) return undefined;

  const parts = String(cookieHeader)
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean);

  for (const part of parts) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx);
    if (key !== name) continue;
    return part.slice(idx + 1);
  }

  return undefined;
};

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // Extract token from http-only cookies (primary) or handshake auth (fallback)
    const cookieHeader = socket.handshake?.headers?.cookie;
    const token =
      getCookieValue(cookieHeader, "jwt") ||
      socket.handshake?.auth?.token ||
      socket.handshake?.auth?.jwt;

    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }

    // verify the token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }

    // find the user from db
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    // attach user info to socket
    socket.user = user;
    socket.userId = user._id.toString();

    console.log(`Socket authenticated for user: ${user.fullname} (${user._id})`);

    next();
  } catch (error) {
    console.log("Error in socket authentication:", error?.message || error);
    next(new Error("Unauthorized - Authentication failed"));
  }
};