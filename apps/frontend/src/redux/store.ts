import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./features/theme.slice";
import signupReducer from "./features/signup.slice";
import { postOfficeApi } from "./features/api/postOfficeApi.sclice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    signup: signupReducer,
    [postOfficeApi.reducerPath]: postOfficeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(postOfficeApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
