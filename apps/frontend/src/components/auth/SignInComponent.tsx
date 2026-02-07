import SignWithGoogle from "../SignWithGoogle";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { setTheme } from "../../redux/features/theme.slice";
import { FaLightbulb, FaMoon } from "react-icons/fa6";
import { PiEyeClosedFill, PiEyeFill } from "react-icons/pi";
import { useState } from "react";
import { toast, Zoom } from "react-toastify";
import { signInZodSchema } from "@repo/zod-schemas/config";
import { useSignInMutation } from "../../redux/features/api/authApi.sclice";

function SignInComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useSelector((state: RootState) => state?.theme.value);
  const [emailData, setEmailData] = useState<string>("");
  const [passwordData, setPasswordData] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [signin, { isLoading }]=useSignInMutation();
  const handelSubmit = async function () {
    const result = signInZodSchema
      .pick({ email: true, password: true })
      .safeParse({ email: emailData, password: passwordData });

    if (!result.success) {
      toast.error(`${JSON.parse(result.error.message)[0].message}`, {
        theme: theme === "dark" ? "light" : "dark",
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        transition: Zoom,
      });
      return;
    }

    try {
      const response = await  signin({ email: emailData, password: passwordData }).unwrap();
      if (response?.success) {
        toast.success(response?.message, {
          theme: theme === "dark" ? "light" : "dark",
          position: "top-center",
          closeOnClick: true,
          draggable: true,
          transition: Zoom,
        });
        navigate("/");
      }
    } catch (error) {
      let errorMessage = "Something went wrong";
      
            if (typeof error === "object" && error !== null && "data" in error) {
              const err = error as {
                data?: { message?: string };
              };
      
              errorMessage = err.data?.message || errorMessage;
            }
            
            toast.error(`${errorMessage}`, {
              theme: theme === "dark" ? "light" : "dark",
              position: "top-center",
              closeOnClick: true,
              draggable: true,
              transition: Zoom,
            });
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto px-6 py-8 flex flex-col items-center gap-3">

      <button
        onClick={() => {
          dispatch(setTheme());
        }}
        className="sm:hidden absolute top-4 right-4 p-2 rounded-full bg-gray-700 dark:bg-gray-200 text-white dark:text-black hover:scale-105 transition"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <FaMoon className="" /> : <FaLightbulb />}
      </button>

      <img
        src={logo}
        alt="logo Img"
        className="rounded-full h-20 w-20 border border-gray-600 shadow"
      />

      <h2 className="text-lg font-semibold text-black dark:text-gray-100 -mt-2">
        Sign In
      </h2>

      <div className="w-full flex flex-col gap-4">

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-sm font-medium text-black dark:text-gray-300"
          >
            Email
          </label>

          <input
            type="text"
            name="email"
            id="email"
            onChange={(e) => {
              setEmailData(e.target.value);
            }}
            placeholder="you@example.com"
            className="
              w-full
              bg-gray-700 dark:bg-gray-800
              text-gray-100
              border border-gray-600
              rounded-full
              px-5 py-2.5
              focus:outline-none
              focus:ring-2 focus:ring-blue-500
              placeholder-gray-400
            "
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-black dark:text-gray-300"
          >
            Password
          </label>

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="••••••••"
              onChange={(e) => {
                setPasswordData(e.target.value);
              }}
              className="
                w-full
                bg-gray-700 dark:bg-gray-800
                text-gray-100
                border border-gray-600
                rounded-full
                px-5 py-2.5
                pr-12
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
                placeholder-gray-400
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="
                absolute
                inset-y-0
                right-4
                flex
                items-center
                text-2xl
                text-gray-400
                hover:text-gray-200
                focus:outline-none
                transition
              "
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <PiEyeFill /> : <PiEyeClosedFill />}
            </button>

          </div>
        </div>

        {/* Forgot Password */}
            <p className="text-right text-sm text-blue-950 font-bold dark:text-blue-500 hover:underline cursor-pointer">
        <Link to="/forgot-password">
          Forgot Password ??
        </Link>
        </p>

        <button
          onClick={handelSubmit}
          disabled={isLoading}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 transition text-white rounded-full py-2.5 font-medium shadow disabled:cursor-not-allowed disabled:bg-blue-900"
        >
          {isLoading ? "Loading..." : "Sign In"}
        </button>

      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 text-black dark:text-gray-400 text-sm w-full">
        <span className="h-px w-full bg-gray-600"></span>
        OR
        <span className="h-px w-full bg-gray-600"></span>
      </div>

      <SignWithGoogle className="w-full bg-sky-300 dark:bg-gray-200 shadow-2xl text-black rounded-full border-gray-300 hover:bg-emerald-400 hover:dark:bg-gray-100 transition py-2.5" />

      {/* Sign Up */}
      <p className="text-sm text-black dark:text-gray-300 mt-2">
        Are you a new user?{" "}
        <Link
          to="/signup"
          className="font-semibold underline hover:text-neutral-500"
        >
          Sign Up
        </Link>
      </p>

    </div>
  );
}

export default SignInComponent;

