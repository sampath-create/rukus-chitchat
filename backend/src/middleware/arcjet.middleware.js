import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req,res,next) =>{
    try{
        const decision = await aj.protect(req);
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({message : "Too many requests "});
            }
        }
        else if(decision.reason.isBot()){
            return res.status(403).json({message : "Access denied - bot detected"});
        }
        else {
            return res.status(403).json({message : "Access denied by security policy"});
        }

        if(decision.reason.some(isSpoofedBot)){
            return res.status(403).json(
                {error : "spoofed bot detected"},
                {message : "Access denied - spoofed bot detected"}
            );
        }
        next();
    }
    catch(error){
        console.log("Error in Arcjet protection ",error);
        next();
    }
}
export default arcjetProtection;