import { useState } from "react";
import type { SignupDataFields } from "../../../hooks/useSignupForm";
import { signUpZodSchema } from "@repo/zod-schemas/config";
import { toast, Zoom } from "react-toastify";
import type { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

type Props = {
  dataFields: SignupDataFields;
  prevStep: () => void;

  updateDataFields: (element: Partial<SignupDataFields>) => void;
};

function SignupFifthComp({ dataFields, prevStep, updateDataFields }: Props) {
  
  const [github,setGithub]=useState(dataFields.github || "");
  const [linkedin,setLinkedin]=useState(dataFields.linkedin || "");
  const [twitter,setTwitter]=useState(dataFields.twitter || "");
  const [website,setWebsite]=useState(dataFields.website || "");

  const theme = useSelector((state: RootState) => state.theme.value);

  const handelSignUp = async function () {
    updateDataFields({ github, linkedin, twitter, website });
    // Final validation before submission
    const {avatar,resume,...restFields}=dataFields;
    const res = signUpZodSchema.safeParse({
      ...restFields
    })
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
    const formData = new FormData();
    Object.keys(dataFields).forEach((key,value) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    if (avatar) {
      formData.append("avatar", avatar);
    }

    if (resume) {
      formData.append("resume", resume);
    }

  };
  return (
    <div
      className="relative w-full max-w-md mx-auto px-6 py-8 flex flex-col gap-5
                 "
    >
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-black dark:text-gray-300">Enter your GitHub url</label>
        <input
          type="text"
            onChange={(e) => setGithub(e.target.value)}
            value={github}
          placeholder="e.g. github.com/username"
          className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-black dark:text-gray-300">Enter your LinkedIn url</label>
        <input
          type="text"
            onChange={(e) => setLinkedin(e.target.value)}
            value={linkedin}
          placeholder="e.g. www.linkedin.com/in/username"
          className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-black dark:text-gray-300">Enter your Twitter/X url</label>
        <input
          type="text"
            onChange={(e) => setTwitter(e.target.value)}
            value={twitter}
          placeholder="e.g. x.com/username"
          className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-black dark:text-gray-300">Enter your website url</label>
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
  );
}

export default SignupFifthComp;
