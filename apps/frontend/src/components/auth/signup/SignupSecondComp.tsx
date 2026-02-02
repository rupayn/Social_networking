import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { setTheme } from "../../../redux/features/theme.slice";
import { FaLightbulb, FaMoon } from "react-icons/fa6";
import { useState } from "react";
import { PiEyeClosedFill, PiEyeFill } from "react-icons/pi";
import type { SignupDataFields } from "../../../hooks/useSignupForm";

import { signUpZodSchema } from "@repo/zod-schemas/config";
import { toast, Zoom } from "react-toastify";

type Props = {
  dataFields: SignupDataFields;
  nextStep: () => void;
  prevStep: () => void;
  updateDataFields: (element: Partial<SignupDataFields>) => void;
};


function SignupSecondComp({  dataFields, nextStep, prevStep, updateDataFields }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [nameData, setNameData] = useState<string>(dataFields.name);
  const [bioData, setBioData] = useState<string>(dataFields.bio);
  const [passwordData, setPasswordData] = useState<string>(dataFields.password);
  const [reEnterPasswordData, setReEnterPasswordData] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useSelector((state: RootState) => state?.theme.value);
  const [visible,setVisible]=useState(true);
  setTimeout(()=>{setVisible(false)},5000);
  const nextHandler=function(){
    if (passwordData !== reEnterPasswordData) {
      toast.error(`Password not matched`, {
        theme: theme === "dark" ? "light" : "dark",
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        transition: Zoom,
      });
      return;
    }
    const result = signUpZodSchema.pick({ name: true, password: true, bio: true }).safeParse({ name: nameData, password: passwordData, bio: bioData });
    if(!result.success){
      toast.error(`${JSON.parse(result.error.message)[0].message}`, {
        theme: theme === "dark" ? "light" : "dark",
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        transition: Zoom,
      });
      return;
    }
    updateDataFields({ name: nameData, password: passwordData, bio: bioData });
    nextStep();
    
  }
  
 
  
  return (
    <div className="relative w-full max-w-md mx-auto px-6 py-8 flex flex-col gap-5">
      {/* Theme toggle */}
      <button
        onClick={() => dispatch(setTheme())}
        className="sm:hidden absolute top-4 right-4 p-2 rounded-full bg-gray-700 dark:bg-gray-200 text-white dark:text-black hover:scale-105 transition"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <FaMoon /> : <FaLightbulb />}
      </button>

      <h2
        className={`text-center ${visible ? "" : "hidden"} text-black dark:text-gray-100 font-sans `}
      >
        <span className="text-xl  font-extrabold font-serif underline">NOTE:</span> Please provide
        all required details to complete the sign-up process.
      </h2>

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-black dark:text-gray-300">
          Full Name <span className="text-red-500 font-extrabold">*</span>
        </label>
        <input
          type="text"
          onChange={(e) => setNameData(e.target.value)}
          value={nameData}
          placeholder="e.g. John Doe"
          className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
      </div>
      {/* Password */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-black dark:text-gray-300">
          Password <span className="text-red-500 font-extrabold">*</span>
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={passwordData}
            onChange={(e) => setPasswordData(e.target.value)}
            className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-full px-5 py-2.5 pr-dataFields.name12 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-4 flex items-center text-xl text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <PiEyeFill /> : <PiEyeClosedFill />}
          </button>
        </div>
      </div>

      {/* Re-enter Password */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-black dark:text-gray-300">
          Re-enter Password <span className="text-red-500 font-extrabold">*</span>
        </label>

        <div className="relative">
          <input
            type={"text"}
            placeholder="Re-Enter password"
            value={reEnterPasswordData}
            onChange={(e) => setReEnterPasswordData(e.target.value)}
            className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-full px-5 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
        </div>
      </div>
      {/* Bio */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-black dark:text-gray-300">
          About Yourself <span className="text-red-500 font-extrabold">*</span>
        </label>
        <textarea
          rows={3}
          value={bioData}
          onChange={(e) => {
            setBioData(e.target.value);
          }}
          placeholder="Tell us a little about yourself"
          className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none"
        />
      </div>
      {/* Navigation buttons */}
      <div className="flex justify-between gap-4 pt-4">
        <button
          onClick={prevStep}
          className="w-full bg-emerald-600 dark:bg-transparent rounded-full border  dark:border-white py-2 cursor-pointer dark:hover:bg-white/10 hover:bg-emerald-800 hover:font-bold"
        >
          {"<- "} Prev
        </button>
        <button
          onClick={nextHandler}
          className="w-full rounded-full bg-blue-600 py-2 text-white hover:bg-blue-800 transition cursor-pointer hover:font-bold "
        >
          Next {" ->"}
        </button>
      </div>
    </div>
  );
}

export default SignupSecondComp;
