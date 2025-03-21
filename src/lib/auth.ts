import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserDocument } from "./firestore";

export const createUser = async(email: string, password: string) => {
  const userCreds = await createUserWithEmailAndPassword(auth, email, password);

  // create user doc in firestore
  await createUserDocument(userCreds.user.uid, {
    email: userCreds.user.email,
    createdAt: new Date(),
    lastLogin: new Date(),
  })

  return userCreds;
}

export const signIn = async(email: string, password: string) => {
  const userCreds = await signInWithEmailAndPassword(auth, email, password);

  // update last login
  await createUserDocument(userCreds.user.uid, {
    email: userCreds.user.email,
    createdAt: new Date(),
    lastLogin: new Date(),
  })

  return userCreds;
}

export const googleSignIn = async() => {
  const provider = new GoogleAuthProvider();
  const userCreds = await signInWithPopup(auth, provider);

  // create/update user document
  await createUserDocument(userCreds.user.uid, {
    email: userCreds.user.email,
    createdAt: new Date(),
    lastLogin: new Date()
  })

  return userCreds;
}