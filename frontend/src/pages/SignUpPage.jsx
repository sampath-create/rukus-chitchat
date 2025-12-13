import React from 'react'

function SignUpPage() {
  const {authUser,isLoding,login}=useAuthStore();

  return  <h1 className="text-4xl font-bold">Sign Up Page</h1>;
}
export default SignUpPage;
