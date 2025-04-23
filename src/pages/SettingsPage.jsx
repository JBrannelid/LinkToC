import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, LogOut } from "lucide-react";
import { ROUTES } from "../routes/routeConstants";

const SettingsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (confirm("Är du säker på att du vill logga ut?")) {
      await logout();
      navigate(ROUTES.LOGIN);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="p-2 text-gray-600 hover:text-gray-900"
          aria-label="Tillbaka"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold ml-2">Inställningar</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full py-3 px-4 text-left text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logga ut</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
