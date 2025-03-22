import { UserData } from "@/contexts/auth-context";
import { Transaction } from "@/contexts/transaction-context";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
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

// New functions for transactions
export const addTransaction = async (transaction: Transaction) => {
  try {
    await setDoc(doc(db, "transactions", transaction.id), transaction);
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

export const getUserTransactions = async (
  userId: string
): Promise<Transaction[]> => {
  try {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as Transaction);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
