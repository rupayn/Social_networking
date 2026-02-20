import { useState } from "react";
import type { SignupDataFields } from "../../../hooks/useSignupForm";
import { signUpZodSchema } from "@repo/zod-schemas/config";
import { toast, Zoom } from "react-toastify";
import type { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useSignUpMutation } from "../../../redux/features/api/authApi.sclice";
import { setAuthValues } from "../../../redux/features/auth.slice";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../common/loading";

type Props = {
  dataFields: SignupDataFields;
  prevStep: () => void;

  updateDataFields: (element: Partial<SignupDataFields>) => void;
};

const removeEmptyValues = <T extends Record<string, unknown>>(obj: T) => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined
    )
  );
};

function SignupFifthComp({ dataFields, prevStep, updateDataFields }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [github, setGithub] = useState(dataFields.github || "");
  const [linkedin, setLinkedin] = useState(dataFields.linkedin || "");
  const [twitter, setTwitter] = useState(dataFields.twitter || "");
  const [website, setWebsite] = useState(dataFields.website || "");

  const theme = useSelector((state: RootState) => state.theme.value);
  const [signup, { isLoading, isError }] = useSignUpMutation();

  const handelSignUp = async function () {
    updateDataFields({ github, linkedin, twitter, website });
    // Final validation before submission
    const {
      avatar,
      resume,
      successPin: _successPin,
      enterManually: _enterManually,
      ...restFields
    } = dataFields;
    const cleanedData = removeEmptyValues(restFields);
    const res = signUpZodSchema.safeParse({
      ...cleanedData,
    });
    if (!res.success) {
      toast.error(`${JSON.parse(res.error.message)[0].message}`, {
        theme: theme === "dark" ? "light" : "dark",
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        transition: Zoom,
      });
      return;
    }
    console.log(cleanedData);
    const formData = new FormData();
    for (const key in cleanedData) {
      const value = cleanedData[key];

      if (value !== null && value !== undefined) {
        if (key === "email") continue;
        formData.append(key, String(value));
      }
    }

    if (avatar) {
      formData.append("avatar", avatar);
    }

    if (resume) {
      formData.append("resume", resume);
    }

    try {
      const res = await signup(formData).unwrap();
      if (res?.success) {
        if (!isError) {
          toast.success(res?.message, {
            theme: theme === "dark" ? "light" : "dark",
            position: "top-center",
            closeOnClick: true,
            draggable: true,
            transition: Zoom,
          });

          dispatch(setAuthValues(res.user));
          navigate("/");
        }
      }
      if (!res.success) {
        toast.error("Please check inputs or try again", {
          theme: theme === "dark" ? "light" : "dark",
          position: "top-center",
          closeOnClick: true,
          draggable: true,
          transition: Zoom,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          theme: theme === "dark" ? "light" : "dark",
          position: "top-center",
          closeOnClick: true,
          draggable: true,
          transition: Zoom,
        });
      } else {
        toast.error("Something went wrong", {
          theme: theme === "dark" ? "light" : "dark",
          position: "top-center",
          closeOnClick: true,
          draggable: true,
          transition: Zoom,
        });
      }
    }
  };
  return (
    <div
      className="relative w-full max-w-md mx-auto px-6 py-8 flex flex-col gap-5
                 "
    >
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-black dark:text-gray-300">
              Enter your GitHub url
            </label>
            <input
              type="text"
              onChange={(e) => setGithub(e.target.value)}
              value={github}
              placeholder="e.g. github.com/username"
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-black dark:text-gray-300">
              Enter your LinkedIn url
            </label>
            <input
              type="text"
              onChange={(e) => setLinkedin(e.target.value)}
              value={linkedin}
              placeholder="e.g. www.linkedin.com/in/username"
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-black dark:text-gray-300">
              Enter your Twitter/X url
            </label>
            <input
              type="text"
              onChange={(e) => setTwitter(e.target.value)}
              value={twitter}
              placeholder="e.g. x.com/username"
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-black dark:text-gray-300">
              Enter your website url
            </label>
            <input
              type="text"
              onChange={(e) => setWebsite(e.target.value)}
              value={website}
              placeholder="e.g. yourwebsite.com"
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          {/* NAVIGATION */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={prevStep}
              className="w-full bg-emerald-600 dark:bg-transparent rounded-full border  dark:border-white py-2 cursor-pointer dark:hover:bg-white/10 hover:bg-emerald-800 hover:font-bold "
            >
              ← Prev
            </button>

            <button
              onClick={handelSignUp}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600
                     text-white py-2 rounded-xl hover:from-blue-700
                     hover:to-indigo-700 transition font-semibold shadow"
            >
              sign up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignupFifthComp;
