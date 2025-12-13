import React from 'react'

function ChatPage() {
    const {authUser,isLoding,login}=useAuthStore();

  return (
    <div className="relative z-10">
      <h1 className="text-4xl font-bold">Chat Page</h1>
    </div>
  );
}

export default ChatPage;
