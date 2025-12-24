import React from 'react'
import { useAuthStore } from '../store/useAuthStore'

function LoginPage() {
  const {authUser,isLoading,login}=useAuthStore();

  return  <h1 className="text-4xl font-bold">Login Page</h1>
}

export default LoginPage;
