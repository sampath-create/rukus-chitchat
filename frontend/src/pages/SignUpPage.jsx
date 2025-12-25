import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import PageLoader from '../components/pageloader.jsx';
function SignUpPage() {
  
const [formData,setFormData]=useState({fullName:"",email:"",password:""});
const {signUp,isSigingnUp}=useAuthStore();
const handleSubmit=(e)=>{
  e.preventDefault(); 
  signUp(formData);
};

  return  <div className="w-full flex items-center justify-center p-4 bg-[#fffaf0]">
    <div className="relative w-full max-w-md bg-[#f5e6d3] rounded-lg p-6 shadow-md">
      <h1 className="text-4xl text-center font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input 
          type="text"
          value={formData.fullName}
          onChange={(e)=>setFormData({...formData,fullName:e.target.value})}
          className="input bg-white"
          placeholder="మీ నామధేయం "></input>
        </div>
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
        <button type="submit" className="w-full bg-[#8b7355] text-[#f5e6d3] py-2 px-4 rounded-lg border-2 border-[#8b7355] text-center font-semibold hover:bg-[#a0826d] transition-colors" disabled={isSigingnUp}>
          {isSigingnUp ? (<LoaderIcon className="w-full h-5 animate-spin text-center"/>) : ("Create Account")}
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link to="login" className="auth-link">
        Already have an account? Log in
        </Link>

      </div>
    </div>
  </div>
}
export default SignUpPage;
