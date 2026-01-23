import React, { useEffect, useRef, useState } from 'react'
import { CheckIcon, PencilIcon, Trash2Icon, XIcon } from "lucide-react";
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder';
import { useChatStore } from '../store/useChatStore';
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';
function ChatContainer() {
  const {selectedUser,getMessagesByUserId,messages,isMessagesLoading,subscribeToMessages,unsubscribeFromMessages,deleteMessage,editMessage} = useChatStore();
  const {authUser} = useAuthStore();
  const messageEndRef = useRef(null);

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const handleDeleteMessage = async (msg) => {
    if (!msg?._id) return;
    if (msg?.senderId !== authUser?._id) return;
    if (msg?.isOptimistic) return;

    await deleteMessage(msg._id);
  };

  const startEditing = (msg) => {
    if (!msg?._id) return;
    if (msg?.senderId !== authUser?._id) return;
    if (msg?.isOptimistic) return;

    setEditingMessageId(msg._id);
    setEditingText(msg?.text || "");
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const saveEditing = async (msg) => {
    if (!msg?._id) return;
    await editMessage(msg._id, editingText);
    setEditingMessageId(null);
    setEditingText("");
  };
  
   useEffect(() => {
    if (!selectedUser?._id) return;
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

   return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative group ${
                    msg.senderId === authUser._id
                      ? "bg-[#d4a574] text-[#4a2c1c]"
                      : "bg-[#8b7355]/25 text-[#4a2c1c]"
                  }`}
                >
                  {msg.senderId === authUser._id && !msg.isOptimistic && (
                    <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingMessageId === msg._id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => saveEditing(msg)}
                            className="p-1 rounded-md bg-black/10 hover:bg-black/20"
                            title="Save"
                          >
                            <CheckIcon className="w-4 h-4 text-[#4a2c1c]/80" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="p-1 rounded-md bg-black/10 hover:bg-black/20"
                            title="Cancel"
                          >
                            <XIcon className="w-4 h-4 text-[#4a2c1c]/80" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEditing(msg)}
                            className="p-1 rounded-md bg-black/10 hover:bg-black/20"
                            title="Edit message"
                          >
                            <PencilIcon className="w-4 h-4 text-[#4a2c1c]/80" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg)}
                            className="p-1 rounded-md bg-black/10 hover:bg-black/20"
                            title="Delete message"
                          >
                            <Trash2Icon className="w-4 h-4 text-[#4a2c1c]/80" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {msg.image && (
                    <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
                  )}
                  {editingMessageId === msg._id ? (
                    <textarea
                      className="mt-2 w-full textarea textarea-bordered bg-white/30 text-[#4a2c1c] border-[#4a2c1c]/20 focus:outline-none"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      rows={2}
                      maxLength={2222}
                      autoFocus
                    />
                  ) : (
                    msg.text && <p className="mt-2">{msg.text}</p>
                  )}
                  <p className="text-xs mt-1 text-[#4a2c1c]/70 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>

        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser?.fullname || selectedUser?.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
}
export default ChatContainer;