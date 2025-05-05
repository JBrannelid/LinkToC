import { Link } from "react-router";
import { ROUTES } from "../../routes/routeConstants";
import SettingIcon from "../../assets/icons/SettingIcon";
import NotificationIcon from "../../assets/icons/NotificationIcon";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 md:justify-start md:pt-6 md:gap-10">
      <Link to={ROUTES.SETTINGS} aria-label="Inställningar">
        <SettingIcon
          strokeWidth={9}
          className="w-6 h-6 md:w-8 md:h-8  text-primary"
        />
      </Link>

      <Link to="/notifications" aria-label="Notifikationer">
        <NotificationIcon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
      </Link>
    </header>
  );
}
