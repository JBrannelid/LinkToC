import { Outlet } from "react-router";
import Header from "./pages/Header";
import Footer from "./pages/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <Header />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
