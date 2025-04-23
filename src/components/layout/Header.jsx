import { Settings, Mail } from "lucide-react";
import StableName from "./StableName";
import { useAppContext } from "../../context/AppContext";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routeConstants";

export default function Header() {
  const { currentStable } = useAppContext();

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <Link to={ROUTES.SETTINGS} aria-label="Inställningar">
        <Settings className="w-6 h-6 text-gray-700 hover:text-gray-900" />
      </Link>

      <div className="text-sm font-light">
        <StableName currentStableId={currentStable.id} />
      </div>

      <div className="relative">
        <Mail className="w-6 h-6 text-gray-700" />
        <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500" />
      </div>
    </header>
  );
}
