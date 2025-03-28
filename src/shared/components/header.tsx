import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import { signOutAsync } from "@/store/slices/authSlice";

export default function Header() {
  const { userData } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await dispatch(signOutAsync());
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
