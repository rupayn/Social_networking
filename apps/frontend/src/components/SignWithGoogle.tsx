// import React from 'react'
import React from "react";
import { FcGoogle } from "react-icons/fc";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
function SignWithGoogle({ className }: { className?: string }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const handelLogin = () => {
    window.location.href = `${API_BASE}/auth/sign/google`;
    
  };
  return (
    <div
      onClick={handelLogin}
      className={` flex text-2xl md:text-xl bg-blue-100 font-bold ${isHovered ? "border border-inherit " : ""} cursor-pointer  justify-center border border-b-amber-950  ${className || ""}`}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FcGoogle className="text-4xl md:text-2xl shadow-2xl" />{" "}
      <p className="ml-5">SignWithGoogle</p>
    </div>
  );
}

export default SignWithGoogle;
