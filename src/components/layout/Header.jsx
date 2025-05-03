import { Link } from "react-router";
import { ROUTES } from "../../routes/routeConstants";
import SettingIcon from "../../assets/icons/SettingIcon";
import NotificationIcon from "../../assets/icons/NotificationIcon";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <Link to={ROUTES.SETTINGS} aria-label="Inställningar">
        <SettingIcon strokeWidth={9} className="w-7 h-7 text-olive-500" />
      </Link>

      <Link to="/notifications" aria-label="Notifikationer">
        <NotificationIcon className="w-6 h-6 text-olive-500" />
      </Link>
    </header>
  );
}
