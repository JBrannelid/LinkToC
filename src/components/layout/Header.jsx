import { Settings, Bell } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routeConstants";

export default function Header() {
  const { currentStable } = useAppContext();

  return (
    <header className="flex items-center justify-between p-4">
      <Link to={ROUTES.SETTINGS} aria-label="Inställningar">
        <Settings className="w-6 h-6 text-olive-500" />
      </Link>

      <Link to="/notifications" aria-label="Notifikationer">
        <Bell className="w-6 h-6 text-olive-500" />
      </Link>
    </header>
  );
}
