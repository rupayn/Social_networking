import { signUpZodSchema } from "@repo/zod-schemas/config";
import React, { useEffect, useState } from "react";
import { PiEyeFill, PiEyeClosedFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { toast, Zoom } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/features/api/authApi.sclice";

function ResetPasswordComponent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notMatched, setNotMatched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const theme = useSelector((state: RootState) => state?.theme.value);
  const [searchParams] = useSearchParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = searchParams.get("token");
    if (!token) {
      alert("Invalid token");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const result = signUpZodSchema.pick({ password: true }).safeParse({ password });
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
      console.log(token);
      const response = await resetPassword({ password, token }).unwrap();
      if (response?.success) {
        toast.success(response?.message, {
          theme: theme === "dark" ? "light" : "dark",
          position: "top-center",
          closeOnClick: true,
          draggable: true,
          transition: Zoom,
        });
      }
      if (!response?.success)
        toast.error(response?.message, {
          theme: theme === "dark" ? "light" : "dark",
          position: "top-center",
          closeOnClick: true,
          draggable: true,
          transition: Zoom,
        });
      if (response?.success) navigate("/signin");
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
  useEffect(() => {
    if (password !== confirmPassword) {
      setNotMatched(true);
    }
    if (password === confirmPassword) {
      setNotMatched(false);
    }
  }, [confirmPassword]);
  return (
    <div className="w-full px-6 py-8">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
        Reset Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-300">
            New Password <span className="text-red-500 font-extrabold">*</span>
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full
                bg-gray-100 dark:bg-gray-700
                text-gray-900 dark:text-gray-100
                border border-gray-300 dark:border-gray-600
                rounded-full
                px-5 py-2.5 pr-12
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
                placeholder-gray-400 dark:placeholder-gray-500
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="
                absolute inset-y-0 right-4
                flex items-center text-xl
                text-gray-500 dark:text-gray-400
                hover:text-gray-700 dark:hover:text-gray-200
              "
            >
              {showPassword ? <PiEyeFill /> : <PiEyeClosedFill />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-300">
            Re-enter Password <span className="text-red-500 font-extrabold">*</span>
          </label>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`
                w-full
                
                text-gray-900 dark:text-gray-100
                border border-gray-300 dark:border-gray-600
                rounded-full
              ${notMatched ? "bg-red-400 dark:bg-red-600" : "bg-gray-100 dark:bg-gray-700"} 
                px-5 py-2.5 pr-12
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
                placeholder-gray-400 dark:placeholder-gray-500
              `}
            />

            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="
                absolute inset-y-0 right-4
                flex items-center text-xl
                text-gray-500 dark:text-gray-400
                hover:text-gray-700 dark:hover:text-gray-200
              "
            >
              {showConfirm ? <PiEyeFill /> : <PiEyeClosedFill />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={notMatched || isLoading}
          className="
            w-full py-2 rounded-md
            bg-blue-600 text-white font-semibold
            hover:bg-blue-700
            dark:bg-blue-500 dark:hover:bg-blue-600
            disabled:bg-blue-900
            disabled::hover:bg-blue-900
            disabled:cursor-not-allowed
            transition
          "
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordComponent;
