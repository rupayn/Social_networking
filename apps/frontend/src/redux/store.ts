/**
 * Redux store configuration for the application.
 * 
 * Combines multiple reducers including theme, authentication, and RTK Query APIs.
 * Configures middleware to include default middleware and API middlewares for
 * PostOfficeApi and AuthApi.
 * 
 * @constant
 * @type {EnhancedStore}
 * @description
 * Configures the Redux store with:
 * - Theme reducer for managing UI theme state
 * - Auth reducer for managing authentication state
 * - PostOffice API RTK Query slice for managing post office API calls and caching
 * - Auth API RTK Query slice for managing authentication API calls and caching
 * 
 * Includes middleware for RTK Query API operations to handle async requests and caching.
 * 
 * @constant {ReturnType<typeof configureStore>} store - The configured Redux store instance
 * 
 * @typedef {ReturnType<typeof store.getState>} RootState - The root state type of the Redux store
 * @typedef {typeof store.dispatch} AppDispatch - The dispatch type for the Redux store
 */



import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./features/theme.slice";
import authReducer from "./features/auth.slice";
import { utilsApi } from "./features/api/utilsApi.sclice";
import  {authApi} from "./features/api/authApi.sclice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    [utilsApi.reducerPath]: utilsApi.reducer,
    [authApi.reducerPath]: authApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(
      utilsApi.middleware,
      authApi.middleware
    ),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
