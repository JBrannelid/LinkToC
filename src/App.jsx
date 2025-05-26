import { Outlet, useLocation } from "react-router";
import NavigationFooter from "./components/layout/NavigationFooter";
import { useAuth } from "./context/AuthContext";
import HeaderContainer from "./components/layout/HeaderContainer";
import DesktopNavigation from "./components/layout/DesktopNavigation";
import DesktopFooter from "./components/layout/DesktopFooter";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Routes that should never show the header (regardless of screen size)
  const alwaysHideHeaderRoutes = ["/login", "/register"];

  // Hide header on mobile but show on lg+
  const mobileOnlyHideHeaderRoutes = ["/userpage", "/horse-profile"];

  // Check if we should completely hide the header
  const shouldCompletelyHideHeader = alwaysHideHeaderRoutes.some(
    (route) =>
      location.pathname === route || location.pathname.startsWith(`${route}/`)
  );

  // Check if this is a route that should only hide header on mobile
  const isMobileHideRoute = mobileOnlyHideHeaderRoutes.some(
    (route) =>
      location.pathname === route || location.pathname.startsWith(`${route}/`)
  );

  // Show mobile header only if authenticated, not a complete hide route, and not a mobile-only hide route
  const showMobileHeader =
    isAuthenticated && !shouldCompletelyHideHeader && !isMobileHideRoute;

  // Show desktop header if authenticated and not a complete hide route (including mobile-only hide routes)
  const showDesktopHeader = isAuthenticated && !shouldCompletelyHideHeader;

  // Footer hiding logic
  const footerHiddenRoutes = ["/login", "/register", "/stable-onboarding"];
  const shouldHideFooter = footerHiddenRoutes.some(
    (route) =>
      location.pathname === route || location.pathname.startsWith(`${route}/`)
  );
  const showFooterNav = isAuthenticated && !shouldHideFooter;

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        {/* Desktop header - always hidden on mobile, but conditionally shown on lg+ */}
        {showDesktopHeader && (
          <header className="hidden lg:block">
            <DesktopNavigation />
          </header>
        )}

        {/* Mobile header - completely hidden on lg+ */}
        {showMobileHeader && (
          <header className="lg:hidden">
            <HeaderContainer />
          </header>
        )}

        <main className="flex-1/2">
          <Outlet />
        </main>

        {/* Mobile footer nav */}
        {showFooterNav && (
          <footer className="lg:hidden mt-auto">
            <NavigationFooter />
          </footer>
        )}

        {/* Desktop footer */}
        {showFooterNav && (
          <footer className="hidden lg:block mt-auto">
            <DesktopFooter />
          </footer>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
