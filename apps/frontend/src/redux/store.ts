import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./features/theme.slice";
import signupReducer from "./features/signup.slice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    signup: signupReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
