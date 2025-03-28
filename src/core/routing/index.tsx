import SignIn from "@/auth/components/login";
import SignUp from "@/auth/components/register";
import { useAppSelector } from "@/core/hooks/useRedux";
import Dashboard from "@/dashboard/components/Dashboard";
import { Navigate, Route, Routes } from "react-router-dom";

export function AppRoutes() {
  const { userLoggedIn, loading } = useAppSelector((state) => state.auth);

  // Show loading indicator while auth state is being determined
  if (loading || userLoggedIn === null) {
    // Consider replacing with a dedicated loading component/spinner
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Redirect root based on auth state */}
      <Route
        path="/"
        element={
          userLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />

      {/* Public routes - redirect if logged in */}
      <Route
        path="/signin"
        element={userLoggedIn ? <Navigate to="/dashboard" replace /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={userLoggedIn ? <Navigate to="/dashboard" replace /> : <SignUp />}
      />

      {/* Private routes - redirect if not logged in */}
      <Route
        path="/dashboard"
        element={userLoggedIn ? <Dashboard /> : <Navigate to="/signin" replace />}
      />

      {/* Add other routes here */}

      {/* Fallback for unmatched routes (optional) */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
