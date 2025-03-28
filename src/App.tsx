import BalanceCardList from "@/accounts/components/balance-card-list";
import SignIn from "@/auth/components/login";
import SignUp from "@/auth/components/register";
import { auth } from "@/lib/firebase";
import ExpenseChart from "@/reporting/components/expense-chart";
import Header from "@/shared/components/header";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchUserDataAsync,
  setLoading,
  setUser,
} from "@/store/slices/authSlice";
import {
  clearTransactions,
  fetchTransactionsAsync,
} from "@/store/slices/transactionSlice";
import TransactionFormContainer from "@/transactions/components/transaction-form/form-container";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

function AuthMonitor({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      dispatch(setUser(user));

      if (user) {
        dispatch(fetchUserDataAsync(user.uid));
        dispatch(fetchTransactionsAsync(user.uid));
      } else {
        dispatch(clearTransactions());
      }

      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);
  return <>{children}</>;
}

function Dashboard() {
  return (
    <div className="container mx-auto p-10 font-nunito">
      <Header />
      <main className="flex flex-col gap-10">
        <BalanceCardList />
        <div className="flex flex-col gap-10 text-center md:text-left md:flex-row md:justify-between">
          <ExpenseChart />
          <TransactionFormContainer />
        </div>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { userLoggedIn, loading } = useAppSelector((state) => state.auth);

  if (loading || userLoggedIn === null) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          userLoggedIn ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/signin" />
          )
        }
      />
      <Route
        path="/signin"
        element={userLoggedIn ? <Navigate to="/dashboard" /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={userLoggedIn ? <Navigate to="/dashboard" /> : <SignUp />}
      />
      <Route
        path="/dashboard"
        element={userLoggedIn ? <Dashboard /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthMonitor>
        <AppRoutes />
      </AuthMonitor>
    </BrowserRouter>
  );
}

export default App;
