// Redux Toolkit slice for managing authentication and user profile state(it is for storing user information across the application and updating it when needed)
// This slice handles storing and updating user information across the application

import { createSlice } from "@reduxjs/toolkit";

/**
 * Initial state for the auth slice
 * Contains an empty user profile object with all necessary user fields
 * initialized to empty strings
 */

export interface AuthStateInterFace {
  value: {
    id: string;
    email: string;
    username: string;
    name: string;
    emailVerified: boolean;
    phone: string;
    bio: string;
    role: "RECRUITER" | "CANDIDATE" | "";
    profileStatus: "active" | "suspended" | "deactivated" | "";
    linkedin: string;
    github: string;
    website: string;
    twitter?: string;
    avatar: string;
    avatar_id: string;
    resume: string;
    resume_id: string;
    pinCode: string;
    city: string;
    state: string;
    country: string;
  };
}

type Provider = "GOOGLE" | "MANUAL";
type Role = "RECRUITER" | "CANDIDATE";
type ProfileStatus = "active" | "suspended" | "deactivated";

interface PermanentAddress {
  id: string;
  permanentUserId: string;
  currentProfileId: string | null;
  city: string;
  district: string | null;
  state: string;
  country: string;
  pinCode: string;
}

interface Profile {
  id: string;
  userId: string;
  resume: string | null;
  resume_id: string | null;
  designation: string;
  headline: string;
  bio: string;
  mode: "light" | "dark";
  layout: "default" | string;

  linkedin: string;
  github: string;
  twitter: string;
  website: string;

  createdAt: string;
  updatedAt: string;
}



interface user {
  id: string;
  email: string;
  username: string;
  name: string | null;

  avatar: string | null;
  avatar_id: string | null;

  emailVerified: boolean;
  emailVerifiedAt: string | null;

  createdAt: string;
  updatedAt: string;

  phone: string | null;

  provider: Provider;
  role: Role;
  profileStatus: ProfileStatus;

  permanentAddress: PermanentAddress;
  profile: Profile;
}

const initialState: AuthStateInterFace = {
  value: {
    id:"",
    email: "",
    username: "",
    name: "",
    emailVerified: false,
    phone: "",
    bio: "",
    role: "",
    profileStatus: "",
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
};

/**
 * Auth slice - manages authentication and user profile state
 * Provides actions to update and reset user information
 */
export const authSlice = createSlice({
  name: "Auth_Slice",
  initialState,
  reducers: {
    /**
     * setAuthValues action - updates user profile fields
     * Merges provided payload with existing state, allowing partial updates
     * @param state - Current state
     * @param action - Contains payload with user fields to update
     */
    setAuthValues: (state, action) => {
      state.value = {
        ...state.value,
        ...action.payload,
      };
    },

    /**
     * setLogout action - clears all user data
     * Resets user profile to initial empty state when user logs out
     * @param state - Current state
     */
    setLogout: (state) => {
      state.value = {
        ...initialState.value,
      };
    },
  },
});

// Export action creators
export const { setAuthValues,setLogout } = authSlice.actions;

// Export reducer as default - used to configure the Redux store
export default authSlice.reducer;
