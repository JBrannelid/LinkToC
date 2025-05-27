import "./index.css";
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { AppProvider } from "./context/AppContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FileUploadProvider } from "./context/FileUploadContext";
import { router } from "./routes/index.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <FileUploadProvider>
          <RouterProvider router={router} />
        </FileUploadProvider>
      </AppProvider>
    </AuthProvider>
  </StrictMode>
);
