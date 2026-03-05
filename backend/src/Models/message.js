import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId:{
            type :mongoose.Schema.Types.ObjectId,
            ref : "User",
            required:true
        },
        receiverId:{
            type :mongoose.Schema.Types.ObjectId,
            ref : "User",
            required :true,
        },
        text :{
            type:String,
            trim : true,
            maxlength:2222,
        },
        image:{
            type:String,
        },
        seen: {
            type: Boolean,
            default: false,
        },
        seenAt: {
            type: Date,
            default: null,
        },
        // MongoDB TTL index will auto-delete the document when this date is reached.
        // - Unseen messages: expiresAt = createdAt + 24 hours
        // - Seen messages:   expiresAt = seenAt + 1 minute
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {timestamps : true}
);

// TTL index — MongoDB checks every ~60 seconds and removes expired docs
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Message= mongoose.model("Message",messageSchema);
export default Message;