import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req,res,next) =>{
    // Skip arcjet for preflight OPTIONS requests (CORS)
    if (req.method === "OPTIONS") return next();
    try{
        const decision = await aj.protect(req);
        if (decision.isDenied()) {
            if (decision.reason?.isRateLimit?.()) {
                return res.status(429).json({ message: "Too many requests" });
            }

            if (decision.reason?.some?.(isSpoofedBot)) {
                return res.status(403).json({ message: "Access denied - spoofed bot detected" });
            }

            if (decision.reason?.isBot?.()) {
                return res.status(403).json({ message: "Access denied - bot detected" });
            }

            return res.status(403).json({ message: "Access denied by security policy" });
        }

        return next();
    }
    catch(error){
        console.log("Error in Arcjet protection ",error);
        next();
    }
}
export default arcjetProtection;