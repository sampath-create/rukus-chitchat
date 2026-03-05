import { useEffect, useState } from "react";
import { Trash2Icon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser, deleteChatWithUser } = useChatStore();
  const { setSelectedGroup } = useGroupStore();
  const { onlineUsers } = useAuthStore();

  const [chatToDelete, setChatToDelete] = useState(null);

  const handleDeleteChat = (e, chat) => {
    e.stopPropagation();
    setChatToDelete(chat);
  };

  const confirmDelete = () => {
    if (chatToDelete) {
      deleteChatWithUser(chatToDelete._id);
      setChatToDelete(null);
    }
  };

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
          className="group bg-[#8b7355]/25 p-4 rounded-lg cursor-pointer hover:bg-[#8b7355]/35 transition-colors"
          onClick={() => { setSelectedGroup(null); setSelectedUser(chat); }}
        >
          <div className="flex items-center gap-3 w-full">
            <div className={`avatar ${onlineUsers?.includes?.(chat._id) ? "online" : "offline"}`}>
              <div className="size-12 rounded-full">
                <img
                  src={chat.profilepic || chat.profilePic || "/avathar.png"}
                  alt={chat.fullname || chat.fullName || "User"}
                />
              </div>
            </div>
            <h4 className="text-[#4a2c1c] font-medium truncate flex-1">{chat.fullname || chat.fullName}</h4>
            <button
              type="button"
              onClick={(e) => handleDeleteChat(e, chat)}
              className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all"
              title="Delete chat"
            >
              <Trash2Icon className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      ))}

      {/* DaisyUI Delete Confirmation Modal */}
      <dialog className={`modal ${chatToDelete ? "modal-open" : ""}`}>
        <div className="modal-box bg-[#f5e6d3] border border-[#d4a574]/40">
          <h3 className="font-bold text-lg text-[#4a2c1c]">Delete Chat</h3>
          <p className="py-4 text-[#4a2c1c]/80">
            Delete entire chat with <span className="font-semibold text-[#4a2c1c]">{chatToDelete?.fullname || chatToDelete?.fullName}</span>? This cannot be undone.
          </p>
          <div className="modal-action">
            <button
              className="btn btn-ghost text-[#4a2c1c] hover:bg-[#8b7355]/20"
              onClick={() => setChatToDelete(null)}
            >
              Cancel
            </button>
            <button
              className="btn bg-red-500 hover:bg-red-600 text-white border-none"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setChatToDelete(null)}>close</button>
        </form>
      </dialog>
    </>
  );
}
export default ChatsList;