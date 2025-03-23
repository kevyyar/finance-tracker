import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import BalanceCardList from "./components/balance-card-list";
import ExpenseChart from "./components/expense-chart";
import Header from "./components/header";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import TransactionForm from "./components/transaction-form";
import { useAuth } from "./contexts/auth-context";
import { TransactionProvider } from "./contexts/transaction-context";
import { useAppDispatch } from "./store";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import {
  fetchUserDataAsync,
  setLoading,
  setUser,
} from "./store/slices/authSlice";

function AuthMonitor({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      dispatch(setUser(user));

      if (user) {
        dispatch(fetchUserDataAsync(user.uid));
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
          <TransactionForm />
        </div>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { userLoggedIn, loading } = useAuth();

  if (loading) {
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
        <TransactionProvider>
          <AppRoutes />
        </TransactionProvider>
      </AuthMonitor>
    </BrowserRouter>
  );
}

export default App;
