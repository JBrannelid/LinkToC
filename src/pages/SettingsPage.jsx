import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";
import { ROUTES } from "../routes/routeConstants";
import Button from "../components/ui/Button";

const SettingsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (confirm("Är du säker på att du vill logga ut?")) {
      await logout();
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 items-center mb-10">
        <h1 className="text-2xl ml-2">Inställningar</h1>
      </div>
      <div className="space-y-4">
        <Button
          type="secondary"
          size="small"
          onClick={handleLogout}
          className="flex items-center w-full py-3 px-4 text-left text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logga ut</span>
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
