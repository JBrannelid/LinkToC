import { Outlet, useLocation } from "react-router";
import Header from "./components/layout/Header";
import NavigationFooter from "./components/layout/NavigationFooter";
import { useAuth } from "./context/AuthContext";
import { useAppContext } from "./context/AppContext";

function App() {
  const { isAuthenticated } = useAuth();
  const { currentStable } = useAppContext();
  const location = useLocation();

  const hiddenRoutes = ["/login", "/register"];
  const hidePages = hiddenRoutes.includes(location.pathname);

  // Show nav only if authenticated, has stable, and not on login/register pages
  const showNavigation = isAuthenticated && currentStable?.id && !hidePages;

  return (
    <div className="min-h-screen flex flex-col">
      {showNavigation && (
        <header>
          <Header />
        </header>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      {showNavigation && (
        <footer>
          <NavigationFooter />
        </footer>
      )}
    </div>
  );
}

export default App;
