import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "auth/signIn/fulfilled",
          "auth/signInWithGoogle/fulfilled",
          "auth/signUp/fulfilled",
          "auth/fetchUserData/fulfilled",
          "auth/setUser",
        ],
        ignoredActionPaths: ["payload.user", "meta.arg"],
        ignoredPaths: [
          "auth.currentUser",
          "auth.userData.createdAt",
          "auth.userData.lastLogin",
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
