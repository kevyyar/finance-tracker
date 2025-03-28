import { AuthProvider } from "@/core/providers/AuthProvider";
import { AppRoutes } from "@/core/routing";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
