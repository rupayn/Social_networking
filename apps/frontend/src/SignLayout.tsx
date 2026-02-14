// import { Outlet } from "react-router-dom";
import { Link, NavLink, Outlet } from "react-router";
import pattern from "./assets/pattern.svg";
import { FaLightbulb, FaMoon } from "react-icons/fa6";
import WaveSection from "./components/Wave";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./redux/store";
import { setByValue, setTheme } from "./redux/features/theme.slice";
import { toast, ToastContainer } from "react-toastify";
import useNetworkStatus from "./hooks/useNetworkStatus";
import { useEffect, useRef } from "react";

function SigninLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state?.theme.value);
  const isOnline=useNetworkStatus();
  const hasBeenOffline = useRef(false);

  useEffect(()=>{
    const lightModeMediaQuery= window.matchMedia("(prefers-color-scheme: light)")
    const darkModeMediaQuery= window.matchMedia("(prefers-color-scheme: dark)")
    if(lightModeMediaQuery.matches){
      dispatch(setByValue("light"))
    }else if(darkModeMediaQuery.matches){
      dispatch(setByValue("dark"))
    };
  },[])

  useEffect(()=>{
    
    if (!isOnline) {
    hasBeenOffline.current = true;

    toast.info("No network connection", {
      theme: theme === "dark" ? "light" : "dark",
      position: "top-center",
      closeOnClick: true,
      draggable: true,
      autoClose: false,
    });

    return;
  }
  
  // If online AND user was offline before → show online toast
  if (isOnline && hasBeenOffline.current) {

    toast.info("Back Online", {
      theme: theme === "dark" ? "light" : "dark",
      position: "top-center",
      closeOnClick: true,
      draggable: true,
      autoClose: 3000,
    });
  }
  },[isOnline])
  return (
    <div
      data-theme={theme}
      className="bg-white dark:bg-gray-950 text-white w-screen h-screen flex flex-col items-center justify-center"
      style={{
        // 2. Make sure you use the 'pattern' variable here, and add quotes inside the url()
        backgroundImage: `url("${pattern}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "180px 180px",
      }}
    >
      
      <div className=" px-16 hidden sm:flex dark:bg-white/10 bg-black/60 backdrop-blur-sm w-full h-20 items-center justify-between  ">
        <div>
          <Link
            to="/"
            className="absolute font-bold top-5 left-6 text-white hover:text-gray-300 dark:text-gray-300 dark:hover:text-white transition underline-offset-4 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
        <div className="flex justify-between items-center h-full gap-6">
          <div className="">
            <button
              className="w-12 text-3xl flex justify-center items-center bg-black text-white h-10 rounded-full dark:bg-yellow-100 dark:text-yellow-900"
              onClick={() => {
                dispatch(setTheme());
              }}
            >
              {theme === "light" ? <FaMoon className="" /> : <FaLightbulb />}
            </button>
          </div>
          <div className="bg-stone-800 font-bold rounded-full h-4/6 w-52 flex items-center justify-between transition-normal">
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                `w-1/2 cursor-pointer h-full  flex justify-center items-center rounded-full ${isActive ? "bg-blue-800" : ""}`
              }
            >
              <button className="">Sign In</button>
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                `w-1/2 cursor-pointer h-full  flex justify-center items-center rounded-full ${isActive ? "bg-blue-800" : ""}`
              }
            >
              <button className="">Sign up</button>
            </NavLink>
          </div>
        </div>
      </div>

      <div className=" relative z-10 w-full  max-w-md min-h-72 bg-rose-200 dark:bg-slate-900 rounded-2xl mt-16 sm:mt-10 shadow-xl flex  items-center justify-center">
        <ToastContainer />
        {/* <Outlet /> */}
        <Outlet></Outlet>
      </div>

      <div className="hidden md:block  flex-1 w-full relative">
        <WaveSection />
      </div>
    </div>
  );
}

export default SigninLayout;
