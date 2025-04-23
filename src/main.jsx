import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Navigate } from "react-router";
import App from "./App.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProfileTester from "./testing/ProfileTester.jsx";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import LoginForm from "./pages/LoginPage.jsx";
import RegistrationPage from "./pages/RegistrationPage.jsx";
import StableSelectionPage from "./pages/StableSelectionPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "register",
        element: <RegistrationPage />,
      },
      {
        path: "select-stable",
        element: (
          <ProtectedRoute>
            <StableSelectionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute requiresStable={true}>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "horsepage/:horseId",
        element: (
          <ProtectedRoute requiresStable={true}>
            <ProfileTester />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </AuthProvider>
  </StrictMode>
);
