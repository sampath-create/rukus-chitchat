import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema(
    {
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            trim: true,
            maxlength: 2222,
        },
        image: {
            type: String,
        },
        // TTL: auto-delete after 24h (same storage-saving strategy as DMs)
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

groupMessageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
groupMessageSchema.index({ groupId: 1, createdAt: 1 });

const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);
export default GroupMessage;
