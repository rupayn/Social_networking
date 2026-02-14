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
  avatar: File|null;
  twitter: string;
  resume: File|null;
  pinCode: string;
  dist:string;
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
    twitter: "",
    website: "",
    avatar:  null,
    resume:null,
    pinCode: "",
    city: "",
    state: "",
    country: "",
    dist:"",
  });
  const updateDataFields = (data: Partial<SignupDataFields>) => {
    setDataFields((prev) => ({
      ...prev,
      ...data,
    }));
  };
  const backToFirst=()=>setStep(0);
  return {
    step,
    nextStep: () => setStep((prev) => prev + 1),
    prevStep: () => setStep((prev) => prev - 1),
    dataFields,
    updateDataFields,
    backToFirst
  };
}

export default useSignupForm;
