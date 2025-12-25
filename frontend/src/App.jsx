import React, { useState } from 'react'
import {Navigate, Routes, Route } from 'react-router-dom'
import ChatPage from './pages/ChatPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import {useEffect} from "react";
import {Toaster} from "react-hot-toast";
import PageLoader from './components/pageloader.jsx';

function App() {
const   {checkAuth,isCheckingAuth,authUser}=useAuthStore();
useEffect(() =>{
  checkAuth();
},[checkAuth]);

if(isCheckingAuth) return <PageLoader />
return (
 <div className="min-h-screen bg-[#fffaf0] text-[#4a2c1c] relative flex items-center justify-center p-4 overflow-hidden">
      
      <div className="absolute top-0 -left-4 size-96 bg-[#a0826d] opacity-25 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-[#8b7355] opacity-25 blur-[100px]" />      
      
      <Routes>  
        <Route path="/" element={authUser ? <ChatPage />: <Navigate to={"/login"} /> }/>
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} /> }/>
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to = {"/"} />}/>
      </Routes>
      <Toaster/>
    </div>
  );
}
export default App;
