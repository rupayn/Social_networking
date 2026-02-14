// Redux Toolkit slice for managing authentication and user profile state(it is for storing user information across the application and updating it when needed)
// This slice handles storing and updating user information across the application

import { createSlice } from "@reduxjs/toolkit";

/**
 * Initial state for the auth slice
 * Contains an empty user profile object with all necessary user fields
 * initialized to empty strings
 */
const initialState = {
  value: {
    email: "",           // User's email address
    username: "",        // User's username
    name: "",            // User's full name
    emailIsVerified: false, // Flag indicating if user's email is verified
    phone: "",           // User's phone number
    bio: "",             // User's biography/about section
    role: "",            // User's role (e.g., admin, user)
    profileStatus: "",   // Status of user's profile (e.g., active, inactive)
    linkedin: "",        // LinkedIn profile URL or username
    github: "",          // GitHub profile URL or username
    website: "",         // User's personal website URL
    avatar: "",          // Avatar image URL
    avatar_id: "",       // ID reference for the avatar image
    resume: "",          // Resume file URL
    resume_id: "",       // ID reference for the resume file
    pinCode: "",         // Postal/PIN code for user's address
    city: "",            // City of user's residence
    state: "",           // State/Province of user's residence
    country: "",         // Country of user's residence
  },
};

/**
 * Auth slice - manages authentication and user profile state
 * Provides actions to update and reset user information
 */
export const authSlice = createSlice({
  name: "Auth Slice",
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
      console.log(state.value);
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
