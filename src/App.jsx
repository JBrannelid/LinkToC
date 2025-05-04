import { Outlet, useLocation } from "react-router";
import NavigationFooter from "./components/layout/NavigationFooter";
import { useAuth } from "./context/AuthContext";
import { useAppContext } from "./context/AppContext";
import HeaderContainer from "./components/layout/HeaderContainer";

function App() {
  const { isAuthenticated } = useAuth();
  const { currentStable } = useAppContext();
  const location = useLocation();

  const headerHiddenRoutes = ["/login", "/register"];
  const shouldHideHeader = headerHiddenRoutes.includes(location.pathname);

  const footerHiddenRoutes = ["/stable-onboarding"];
  const shouldHideFooter = footerHiddenRoutes.includes(location.pathname);

  // Show nav only if authenticated, has stable, and not on login/register pages
  const showHeader = isAuthenticated && currentStable?.id && !shouldHideHeader;
  const showFooterNav = isAuthenticated && !shouldHideFooter;

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <HeaderContainer />}

      <main className="flex-1">
        <Outlet />
      </main>

      {showFooterNav && (
        <footer>
          <NavigationFooter />
        </footer>
      )}
    </div>
  );
}

export default App;
