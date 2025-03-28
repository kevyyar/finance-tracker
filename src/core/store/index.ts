import { configureStore } from "@reduxjs/toolkit";
import { RootReducer } from "./rootReducer";

export const createAppStore = () => {
  return configureStore({
    reducer: RootReducer,
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
};

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
