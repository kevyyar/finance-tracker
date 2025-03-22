import { useAuth } from "@/contexts/auth-context";
import { signOutUser } from "@/lib/auth";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";

export default function Header() {
  const { userData } = useAuth();

  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/");
  };

  const displayName = userData?.displayName
    ? userData.displayName.charAt(0).toUpperCase() +
      userData.displayName.slice(1)
    : "";

  return (
    <header className="flex items-center justify-between mb-10">
      <h1 className="text-4xl font-bold">Welcome, {displayName}!</h1>
      <Button onClick={handleSignOut} variant="outline">
        Sign Out
      </Button>
    </header>
  );
}
