import React from "react";

export type SignupDataFields = {
  email: string;
  name: string;
  password: string;
  phone: string;
  bio: string;
  linkedin: string;
  github: string;
  website: string;
  avatar: string;
  avatar_id: string;
  resume: string;
  resume_id: string;
  pinCode: string;
  city: string;
  state: string;
  country: string;
};

function useSignupForm() {
  const [step, setStep] = React.useState<number>(0);
  const [dataFields, setDataFields] = React.useState<SignupDataFields>({
    email: "",
    name: "",
    password: "",
    phone: "",
    bio: "",
    linkedin: "",
    github: "",
    website: "",
    avatar: "",
    avatar_id: "",
    resume: "",
    resume_id: "",
    pinCode: "",
    city: "",
    state: "",
    country: "",
  });
  const updateDataFields = (key: keyof SignupDataFields, values: string) => {
    setDataFields((prev) => ({
      ...prev,
      [key]: values,
    }));
  };
  return {
    step,
    nextStep: () => setStep((prev) => prev + 1),
    prevStep: () => setStep((prev) => prev - 1),
    dataFields,
    updateDataFields,
  };
}

export default useSignupForm;
