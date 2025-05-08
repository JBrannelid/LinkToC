import { Outlet, useLocation } from "react-router";
import NavigationFooter from "./components/layout/NavigationFooter";
import { useAuth } from "./context/AuthContext";
import { useAppContext } from "./context/AppContext";
import HeaderContainer from "./components/layout/HeaderContainer";
import DesktopNavigation from "./components/layout/DesktopNavigation";

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
      {/* Only visible on lg screens */}
      <DesktopNavigation />

      {/* Hide header on lg screens */}
      {showHeader && <HeaderContainer className="lg:hidden" />}

      <main className="flex-1">
        <Outlet />
      </main>

      {/* hidden on lg screens */}
      {showFooterNav && (
        <footer className="lg:hidden">
          <NavigationFooter />
        </footer>
      )}
    </div>
  );
}

export default App;
