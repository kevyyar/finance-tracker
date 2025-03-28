import { useAppDispatch } from "@/core/hooks/useRedux";
import { auth } from "@/lib/firebase";
import {
  fetchUserDataAsync,
  setLoading,
  setUser,
} from "@/store/slices/authSlice";
import {
  clearTransactions,
  fetchTransactionsAsync,
} from "@/store/slices/transactionSlice";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(true)); // Start loading
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      dispatch(setUser(user));

      if (user) {
        await dispatch(fetchUserDataAsync(user.uid));
        await dispatch(fetchTransactionsAsync(user.uid));
      } else {
        dispatch(clearTransactions());
      }

      dispatch(setLoading(false)); // Finish loading
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}
