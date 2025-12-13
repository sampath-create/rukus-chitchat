import React from 'react'

function LoginPage({myName}) {
  const {authUser,isLoding,login}=useAuthStore();

  return  <h1 className="text-4xl font-bold">Login Page</h1>
}

export default LoginPage;
