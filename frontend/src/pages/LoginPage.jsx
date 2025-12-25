import React from 'react'
import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import PageLoader from '../components/pageloader.jsx';
function LoginPage() {
  const [formData,setFormData]=useState({email:"",password:""});
  const {login,isLoggingIn}=useAuthStore();
  const handleSubmit=(e)=>{
    e.preventDefault(); 
    login(formData);
  };

  return  <div className="w-full flex items-center justify-center p-4 bg-[#fffaf0]">
    <div className="relative w-full max-w-md bg-[#f5e6d3] rounded-lg p-6 shadow-md">
      <h1 className="text-4xl text-center font-bold mb-4">Login</h1>
      <p className="text-1xl text-center font-bold mb-4">Logging in to access your account</p>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block mb-1 font-medium">Email</label> 
          <input 
          type="email"
          value={formData.email}
          onChange={(e)=>setFormData({...formData,email:e.target.value})}
          className="input bg-white"
          placeholder="Your Email" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input 
          type="password"
          value={formData.password}
          onChange={(e)=>setFormData({...formData,password:e.target.value})}
          className="input bg-white"
          placeholder="మీ తాళం" />
        </div>
        <button type="submit" className="w-full bg-[#8b7355] text-[#f5e6d3] py-2 px-4 rounded-lg border-2 border-[#8b7355] text-center font-semibold hover:bg-[#a0826d] transition-colors" disabled={isLoggingIn}>
          {isLoggingIn ? (<LoaderIcon className="w-full h-5 animate-spin text-center"/>) : ("Sign In")}
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link to="/signup" className="auth-link">
        Don't have an account? Sign up
        </Link>

      </div>
    </div>
  </div>
}

export default LoginPage;
