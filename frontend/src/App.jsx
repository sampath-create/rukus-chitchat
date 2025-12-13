import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import ChatPage from './pages/ChatPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import { useAuthStore } from './store/useAuthStore.js'
function App() {
  const {authUser,isLoding,login}=useAuthStore();
  
  const [myName,setMyName] = useState("rukus")
  return (
 <div className="min-h-screen bg-[#fffaf0] text-[#4a2c1c] relative flex items-center justify-center p-4 overflow-hidden">
      
      <div className="absolute top-0 -left-4 size-96 bg-[#a0826d] opacity-25 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-[#8b7355] opacity-25 blur-[100px]" />      
      
      <Routes>  
        <Route path="/" element={<ChatPage myName = {myName}/>}/>
        <Route path="/login" element={<LoginPage myName={myName}  />}/>
        <Route path="/signup" element={<SignUpPage myName = {myName}/>}/>
      </Routes>
    </div>
  );
}
export default App;
