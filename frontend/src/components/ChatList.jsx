import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-[#8b7355]/25 p-4 rounded-lg cursor-pointer hover:bg-[#8b7355]/35 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers?.includes?.(chat._id) ? "online" : "offline"}`}>
              <div className="size-12 rounded-full">
                <img
                  src={chat.profilepic || chat.profilePic || "/avathar.png"}
                  alt={chat.fullname || chat.fullName || "User"}
                />
              </div>
            </div>
            <h4 className="text-[#4a2c1c] font-medium truncate">{chat.fullname || chat.fullName}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;