import { signInZodSchema } from "@repo/zod-schemas/config";
import React from "react";
import { toast, Zoom } from "react-toastify";
import type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useForgotPasswordMutation } from "../../redux/features/api/authApi.sclice";

function ForgetPasswordComponent() {
  const [email, setEmail] = React.useState<string>("");
  const theme = useSelector((state: RootState) => state?.theme.value);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const COOL_DOWN_TIME = 120; // 2 minutes in seconds
  const [coolDown, setCoolDown] = React.useState<number>(0);

  React.useEffect(() => {
    const storedTime = localStorage.getItem("forgot_password_timer");

    if (storedTime) {
      const remaining = Math.floor((Number(storedTime) - Date.now()) / 1000);

      if (remaining > 0) {
        setCoolDown(remaining);
      } else {
        localStorage.removeItem("forgot_password_timer");
      }
    }
  }, []);

  React.useEffect(() => {
    if (coolDown <= 0) return;

    const timer = setInterval(() => {
      setCoolDown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [coolDown]);

  const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const zodResult = signInZodSchema.pick({ email: true }).safeParse({ email });
    if (!zodResult.success) {
      toast.error(`${JSON.parse(zodResult.error.message)[0].message}`, {
        theme: theme === "dark" ? "light" : "dark",
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        transition: Zoom,
      });
      return;
    }

    try {
      const response = await forgotPassword({ email }).unwrap();

      if (response?.success) {
        toast.success(response?.message, {
          theme: theme === "dark" ? "light" : "dark",
          position: "top-center",
          closeOnClick: true,
          draggable: true,
          transition: Zoom,
        });
        if (response?.success) {
          const expiry = Date.now() + COOL_DOWN_TIME * 1000;

          localStorage.setItem("forgot_password_timer", expiry.toString());

          setCoolDown(COOL_DOWN_TIME);
        }
      } else if (!response?.success) {
        toast.error(response?.message, {
          theme: theme === "dark" ? "light" : "dark",
          position: "top-center",
          closeOnClick: true,
          draggable: true,
          transition: Zoom,
        });
      }
    } catch (error: unknown) {
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
    <div className="w-full px-6 py-8">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
        Reset Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="text-sm font-medium mb-20 text-gray-900 dark:text-gray-300">
          Enter your registered email <span className="text-red-500 font-extrabold">*</span>
        </label>
        <div className="relative mt-2">
          <input
            type="text"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        </div>
        {coolDown > 0 && (
          <p className="text-sm text-red-500 font-semibold mt-2">
            Please wait {coolDown} seconds before trying again.
          </p>
        )}
        <button
          type="submit"
          disabled={isLoading || coolDown > 0}
          className="
            w-full py-2 rounded-md
            bg-blue-600 text-white font-semibold
            hover:bg-blue-700
            dark:bg-blue-500 dark:hover:bg-blue-600
            disabled:opacity-50
            transition
          "
        >
          {isLoading ? "Wait data is Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}

export default ForgetPasswordComponent;
