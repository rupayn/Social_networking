import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./features/theme.slice";
import authReducer from "./features/auth.slice";
import { postOfficeApi } from "./features/api/postOfficeApi.sclice";
import  {authApi} from "./features/api/authApi.sclice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
     auth: authReducer,
    [postOfficeApi.reducerPath]: postOfficeApi.reducer,
    [authApi.reducerPath]: authApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(
      postOfficeApi.middleware,
      authApi.middleware
    ),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
