import React from 'react'
import {useChatStore} from "../store/useChatStore";
import ProfileHeader from '../components/ProfileHeader';
import ChatList from '../components/ChatList';
import ContactList from '../components/ContactList';
import ChatContainer from '../components/ChatContainer';
import NoConversationPlaceHolder from '../components/NoConversationPlaceHolder';
import ActiveTabSwitch from '../components/ActiveTabSwitch';
function ChatPage() {
    
const {activeTab,selectedUser} = useChatStore();
  return (
    <div className="relative w-full max-w-6xl h-[800px] flex rounded-2xl overflow-hidden shadow-2xl border border-[#d4a574]/30">
      {/* Left Side*/ }
      <div className ="w-80 bg-[#8b7355]/40 backdrop-blur-sm flex flex-col border-r border-[#d4a574]/30">
      <ProfileHeader />
      <ActiveTabSwitch/>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {activeTab === "chats" ? <ChatList/> : <ContactList/> }

      </div>
      </div>

      {/*Right Side*/ }
      <div className = " flex-1 flex flex-col  bg-[#a0826d]/30 backdrop-blur-sm">
      {selectedUser ? <ChatContainer/>: <NoConversationPlaceHolder/>}
      </div>
    </div>
  );
}

export default ChatPage;
