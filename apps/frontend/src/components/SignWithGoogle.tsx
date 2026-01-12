// import React from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL;
function SignWithGoogle() {
  const handelLogin = () => {
    window.location.href = `${API_BASE}/auth/sign/google`;
  };
  return <div onClick={handelLogin}>SignWithGoogle</div>;
}

export default SignWithGoogle;
