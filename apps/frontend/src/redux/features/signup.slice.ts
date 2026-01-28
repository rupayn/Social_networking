import { createSlice } from "@reduxjs/toolkit";

export const signupSlice = createSlice({
  name: "signup Slice",
  initialState: {
    value: {
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
    },
  },
  reducers: {
    setSignUpValues: (state, action) => {
      state.value = {
        ...state.value,
        ...action.payload,
      };
    },
  },
});

export const { setSignUpValues } = signupSlice.actions;
export default signupSlice.reducer;
