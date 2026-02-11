import { createSlice } from "@reduxjs/toolkit";
const initialState= {
    value: {
      email: "",
      name: "",
      phone: "",
      bio: "",
      role:"",
      profileStatus:"",
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
  }
export const authSlice = createSlice({
  name: "Auth Slice",
  initialState,
  reducers: {
    setAuthValues: (state, action) => {
      state.value = {
        ...state.value,
        ...action.payload,
      };
    },
    setLogout:(state)=>{
      state.value={
        ...initialState.value
      }
    }
  },
});

export const { setAuthValues } = authSlice.actions;
export default authSlice.reducer;
