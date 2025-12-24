import React from 'react'
import { useAuthStore } from '../store/useAuthStore'

function ChatPage() {
    const {authUser,isLoading,login}=useAuthStore();

  return (
    <div className="relative z-10">
      <h1 className="text-4xl font-bold">Chat Page</h1>
    </div>
  );
}

export default ChatPage;
