import "./index.css";
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./routes/index.jsx";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { FileUploadProvider } from "./context/FileUploadContext";

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
