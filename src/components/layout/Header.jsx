import { useAppContext } from "../../context/AppContext";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routeConstants";
import SettingIcon from "../../assets/icons/SettingIcon";
import NotificationIcon from "../../assets/icons/NotificationIcon";

export default function Header() {
  const { currentStable } = useAppContext();

  return (
    <header className="flex items-center justify-between p-4">
      <Link to={ROUTES.SETTINGS} aria-label="Link to setting page">
        <SettingIcon strokeWidth={6} className="w-6 h-6 text-primary" />
      </Link>

      <Link to={ROUTES.NOTOFICATIONS} aria-label="Link to notification page">
        <NotificationIcon className="w-6 h-6 text-primary" />
      </Link>
    </header>
  );
}
