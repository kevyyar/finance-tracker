import { auth } from "@/lib/firebase";
import { getUserDocument } from "@/lib/firestore";
import { User } from "firebase/auth";
import React from "react";

export interface UserData {
  email: string;
  displayName: string;
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  userLoggedIn: boolean;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        setUserLoggedIn(true);
        // fetch user data from firestore
        const data = await getUserDocument(user.uid);
        setUserData(data as UserData);
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userData,
    userLoggedIn,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
