import { UserData } from "@/contexts/auth-context";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const createUserDocument = async (
  userId: string,
  userData: UserData
) => {
  try {
    await setDoc(doc(db, "users", userId), {
      ...userData,
      createdAt: userData.createdAt,
      lastLogin: userData.lastLogin,
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const getUserDocument = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    console.log(userDoc.data());
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error fetching user document:", error);
    throw error;
  }
};
