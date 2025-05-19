import { useRouteError, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/index.jsx";

export default function ErrorPage() {
  const error = useRouteError();
  const { isAuthenticated } = useAuth();

  // Redirect base on authentication status
  const redirectTo = isAuthenticated ? ROUTES.HOME : ROUTES.LOGIN;
  const linkText = isAuthenticated
    ? "Return to main menu"
    : "Return to login page";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Oops!</h1>
      <p className="text-xl mb-6">Ett fel har inträffat</p>
      <p className="text-gray-600 mb-8">
        {error?.statusText || error?.message || "Unknown error"}
      </p>
      <Link to={redirectTo} className="text-blue-600 hover:underline">
        {linkText}
      </Link>
    </div>
  );
}
