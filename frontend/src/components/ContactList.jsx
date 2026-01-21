import { useEffect, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import UserSearch from "./UserSearch";
import NoChatsFound from "./NoChatsFound";

function ContactList() {
  const {
    getMyChatPartners,
    chats,
    setSelectedUser,
    isUsersLoading,
    searchUsers,
    searchResults,
    searchQuery,
    setSearchQuery,
    isSearchingUsers,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    // Default view: only show people you've chatted with
    getMyChatPartners();
  }, [getMyChatPartners]);

  useEffect(() => {
    const q = String(searchQuery || "");
    const t = setTimeout(() => {
      searchUsers(q);
    }, 350);

    return () => clearTimeout(t);
  }, [searchQuery, searchUsers]);

  const listToRender = useMemo(() => {
    const q = String(searchQuery || "").trim();
    if (q.length > 0) return searchResults;
    return chats;
  }, [searchQuery, searchResults, chats]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      <UserSearch
        value={searchQuery}
        onChange={(v) => setSearchQuery(v)}
      />

      {listToRender.length === 0 ? (
        <NoChatsFound />
      ) : (
        listToRender.map((contact) => (
          <div
            key={contact._id}
            className="bg-[#8b7355]/25 p-4 rounded-lg cursor-pointer hover:bg-[#8b7355]/35 transition-colors"
            onClick={() => setSelectedUser(contact)}
          >
            <div className="flex items-center gap-3">
              <div className={`avatar ${onlineUsers?.includes(contact._id) ? "online" : "offline"}`}>
                <div className="size-12 rounded-full">
                  <img src={contact.profilepic || contact.profilePic || "/avathar.png"} />
                </div>
              </div>
              <h4 className="text-[#4a2c1c] font-medium truncate">{contact.fullname || contact.fullName}</h4>
            </div>
          </div>
        ))
      )}
    </>
  );
}
export default ContactList;