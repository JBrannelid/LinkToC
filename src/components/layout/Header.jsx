import { useAppContext } from "../../context/AppContext";
import { Link, useLocation } from "react-router";
import { ROUTES } from "../../routes/routeConstants";
import SettingIcon from "../../assets/icons/SettingIcon";
import NotificationIcon from "../../assets/icons/NotificationIcon";
import ModalHeader from "../layout/ModalHeader";

export default function Header() {
  const { currentStable } = useAppContext();
  const location = useLocation();

  const setBgToPrimaryLight = location.pathname === ROUTES.SETTINGS;

  const backgroundClass = setBgToPrimaryLight ? "bg-primary-light" : "";

  return (
    <ModalHeader className={`p-4 ${backgroundClass}`}>
      <div className="flex items-center justify-between w-full mt-4">
        <Link to={ROUTES.SETTINGS} aria-label="Link to setting page">
          <SettingIcon strokeWidth={6} className="w-6 h-6 text-primary" />
        </Link>

        <Link to={ROUTES.NOTOFICATIONS} aria-label="Link to notification page">
          <NotificationIcon className="w-6 h-6 text-primary" />
        </Link>
      </div>
    </ModalHeader>
  );
}
