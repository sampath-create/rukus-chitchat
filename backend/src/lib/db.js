import mongoose from "mongoose"
import {ENV} from "./env.js"
export const connectDB =async () =>{
    try {
        const conn = await mongoose.connect(ENV.MONGO_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error){
        console.error("Error connection to MongoDB:",error);
        process.exit(1);
    }
};