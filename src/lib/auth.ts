import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserDocument } from "./firestore";

interface UserData {
  email: string;
  displayName: string;
  createdAt: string;
  lastLogin: string;
}

export const createUser = async (email: string, password: string) => {
  const userCreds = await createUserWithEmailAndPassword(auth, email, password);

  const now = new Date().toISOString();

  // create user doc in firestore
  const userData: UserData = {
    email: userCreds.user.email || email,
    displayName: userCreds.user.displayName || email.split("@")[0],
    createdAt: now,
    lastLogin: now,
  };

  await createUserDocument(userCreds.user.uid, userData);
  return userCreds;
};

export const signIn = async (email: string, password: string) => {
  const userCreds = await signInWithEmailAndPassword(auth, email, password);
  return userCreds;
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCreds = await signInWithPopup(auth, provider);

  const now = new Date().toISOString();

  // create/update user document
  const userData: UserData = {
    email: userCreds.user.email!,
    displayName:
      userCreds.user.displayName || userCreds.user.email!.split("@")[0],
    createdAt: now,
    lastLogin: now,
  };

  await createUserDocument(userCreds.user.uid, userData);
  return userCreds;
};

export const signOutUser = async () => {
  await signOut(auth);
};
