import { Outlet, useLocation } from "react-router";
import NavigationFooter from "./components/layout/NavigationFooter";
import { useAuth } from "./context/AuthContext";
import HeaderContainer from "./components/layout/HeaderContainer";
import DesktopNavigation from "./components/layout/DesktopNavigation";
import DesktopFooter from "./components/layout/DesktopFooter";

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const headerHiddenRoutes = ["/login", "/register"];
  const shouldHideHeader = headerHiddenRoutes.includes(location.pathname);

  const footerHiddenRoutes = ["/login", "/register", "/stable-onboarding"];
  const shouldHideFooter = footerHiddenRoutes.includes(location.pathname);

  // Show nav only if authenticated and not on login/register pages
  const showHeader = isAuthenticated && !shouldHideHeader;
  const showFooterNav = isAuthenticated && !shouldHideFooter;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Only visible on lg screens */}
      {showHeader && (
        <header className="hidden lg:block">
          <DesktopNavigation />
        </header>
      )}
      {/* Hide header on lg screens */}
      {showHeader && (
        <header className="lg:hidden">
          <HeaderContainer />
        </header>
      )}

      <main className="flex-1/2">
        <Outlet />
      </main>

      {/* hidden on lg screens */}
      {showFooterNav && (
        <footer className="lg:hidden mt-auto">
          <NavigationFooter />
        </footer>
      )}
      {showFooterNav && (
        <footer className="hidden lg:block mt-auto">
          <DesktopFooter />
        </footer>
      )}
    </div>
  );
}

export default App;
