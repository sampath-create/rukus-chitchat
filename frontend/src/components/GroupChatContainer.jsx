import { useEffect, useRef } from "react";
import { useGroupStore } from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";
import GroupChatHeader from "./GroupChatHeader";
import GroupMessageInput from "./GroupMessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { UsersIcon } from "lucide-react";

function GroupChatContainer() {
    const {
        selectedGroup,
        groupMessages,
        isGroupMessagesLoading,
        getGroupMessages,
        subscribeToGroupEvents,
        unsubscribeFromGroupEvents,
    } = useGroupStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (!selectedGroup?._id) return;
        getGroupMessages(selectedGroup._id);
        subscribeToGroupEvents();
        return () => unsubscribeFromGroupEvents();
    }, [selectedGroup?._id, getGroupMessages, subscribeToGroupEvents, unsubscribeFromGroupEvents]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [groupMessages]);

    return (
        <>
            <GroupChatHeader />
            <div className="flex-1 px-6 overflow-y-auto py-8">
                {groupMessages.length > 0 && !isGroupMessagesLoading ? (
                    <div className="max-w-3xl mx-auto space-y-6">
                        {groupMessages.map((msg) => {
                            const sender = msg.senderId;
                            const isMine = (sender?._id || sender) === authUser._id;
                            return (
                                <div
                                    key={msg._id}
                                    className={`chat ${isMine ? "chat-end" : "chat-start"}`}
                                >
                                    {/* Avatar for other users */}
                                    {!isMine && (
                                        <div className="chat-image avatar">
                                            <div className="size-8 rounded-full">
                                                <img
                                                    src={sender?.profilepic || sender?.profilePic || "/avathar.png"}
                                                    alt={sender?.fullname || "User"}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="chat-header text-xs text-[#4a2c1c]/60 mb-1">
                                        {!isMine && (sender?.fullname || sender?.fullName || "Unknown")}
                                    </div>
                                    <div
                                        className={`chat-bubble ${
                                            isMine
                                                ? "bg-[#d4a574] text-[#4a2c1c]"
                                                : "bg-[#8b7355]/25 text-[#4a2c1c]"
                                        }`}
                                    >
                                        {msg.image && (
                                            <img
                                                src={msg.image}
                                                alt="Shared"
                                                className="rounded-lg h-48 object-cover"
                                            />
                                        )}
                                        {msg.text && <p className="mt-1">{msg.text}</p>}
                                        <p className="text-xs mt-1 text-[#4a2c1c]/70">
                                            {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messageEndRef} />
                    </div>
                ) : isGroupMessagesLoading ? (
                    <MessagesLoadingSkeleton />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <div className="size-20 bg-[#8b7355]/15 rounded-full flex items-center justify-center mb-6">
                            <UsersIcon className="size-10 text-[#8b7355]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#4a2c1c] mb-2">No messages yet</h3>
                        <p className="text-[#4a2c1c]/70 max-w-md">
                            Be the first to say something in <span className="font-semibold">{selectedGroup?.name}</span>!
                        </p>
                    </div>
                )}
            </div>
            <GroupMessageInput />
        </>
    );
}

export default GroupChatContainer;
