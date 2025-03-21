import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

interface UserData {
  email: string | null;
  createdAt: Date;
  lastLogin: Date;
}

export const createUserDocument = async (userId: string, userData: UserData) => {
  try {
    await setDoc(doc(db, "users", userId), {
      ...userData,
      createdAt: userData.createdAt.toISOString(),
      lastLogin: userData.lastLogin.toISOString(),
    })
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
} 

export const getUserDocument = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error('Error fetching user document:', error);
    throw error;
  }
}