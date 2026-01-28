import SignWithGoogle from "../../SignWithGoogle";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { setTheme } from "../../../redux/features/theme.slice";
import { FaLightbulb, FaMoon } from "react-icons/fa6";
import { Zoom, toast } from "react-toastify";
import type { SignupDataFields } from "../../../hooks/useSignupForm";
import { useState } from "react";
import { signUpZodSchema } from "@repo/zod-schemas/config";

type Props = {
  dataFields: SignupDataFields;
  nextStep: () => void;

  updateDataFields: (key: keyof SignupDataFields, values: string) => void;
};

function SignupFirstComp({
  dataFields,
  nextStep: _nextStep,
  updateDataFields: _updateDataFields,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state?.theme.value);
  const [emailData, setEmailData] = useState<string>(dataFields.email);
  const [phoneData, setPhoneData] = useState<string>(dataFields.phone);

  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailData(e.target.value);
  };

  const phoneHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneData(e.target.value);
  };

  const handelNext = function () {
    const result = signUpZodSchema
      .pick({ email: true, phone: true })
      .safeParse({ email: emailData, phone: phoneData });
    if (!result.success) {
      toast.error(`${JSON.parse(result.error.message)[0].message}`, {
        theme: theme === "dark" ? "light" : "dark",
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        transition: Zoom,
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-8 flex flex-col items-center gap-5">
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

      <h2 className="text-lg font-semibold text-black dark:text-gray-100 -mt-2">Sign Up</h2>

      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-black dark:text-gray-300">
            Enter Email <span className="text-red-500 font-extrabold">*</span>
          </label>
          <input
            type="text"
            name="email"
            id="email"
            onChange={(e) => {
              emailHandler(e);
            }}
            placeholder="you@example.com"
            className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-sm font-medium text-black dark:text-gray-300">
            Enter Phone Number <span className="text-red-500 font-extrabold">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            placeholder="1234567890"
            className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            onChange={phoneHandler}
          />
        </div>

        <button
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 transition text-white rounded-full py-2.5 font-medium"
          onClick={handelNext}
        >
          Next {"->"}
        </button>
      </div>

      <div className="flex items-center gap-4 text-black dark:text-gray-400 text-sm">
        <span className="h-px w-16 bg-gray-600"></span>
        OR
        <span className="h-px w-16 bg-gray-600"></span>
      </div>

      <SignWithGoogle className="w-full bg-sky-300 dark:bg-gray-200 shadow-2xl text-black rounded-full border-gray-300 hover:bg-emerald-400 hover:dark:bg-gray-100 transition py-2.5" />

      {/* New Sign Up link */}
      <p className="text-sm text-black dark:text-gray-300 mt-2">
        You already have an account{" "}
        <Link to="/signin" className="font-semibold underline hover:text-neutral-500">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default SignupFirstComp;

/**
 * toast.warn(`${e.target.value}`, {
theme: theme === "dark" ? "light" : "dark",
position: "top-center",
closeOnClick: true,
draggable: true,
transition: Zoom,
});
 */
