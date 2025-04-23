import { Home, Warehouse, User, Rabbit } from "lucide-react";
import { Link } from "react-router";
import { ROUTES } from "../routes/routeConstants";

// Hardcoded for now, should be replaced with a dynamic variable later
const horseId = 1;
const userId = 1;

export default function Footer() {
  return (
    <footer className="flex items-center justify-between p-4 bg-white shadow-md">
      <Link to={ROUTES.HOME}>
        <Home className="w-6 h-6 text-gray-700" />
      </Link>

      <Link to={`/stable/${userId}`}>
        <Warehouse className="w-6 h-6 text-gray-700" />
      </Link>

      <Link to={`/horsepage/${horseId}`}>
        <Rabbit className="w-6 h-6 text-gray-700" />
      </Link>

      <Link to={`/userpage/${userId}`}>
        <User className="w-6 h-6 text-gray-700" />
      </Link>
    </footer>
  );
}
