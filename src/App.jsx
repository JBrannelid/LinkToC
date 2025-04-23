import { Outlet } from "react-router";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import { useAuth } from "./context/AuthContext";
import { useAppContext } from "./context/AppContext";

function App() {
  const { isAuthenticated } = useAuth();
  const { currentStable } = useAppContext();

  // Only show header/footer when authenticated and with a stable
  const showNavigation = isAuthenticated && currentStable?.id;

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
          <Footer />
        </footer>
      )}
    </div>
  );
}

export default App;
