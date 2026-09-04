import "./lib/authSetup"; // must run before any component imports axios/fetch
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './index.css'
import ReactDOM from "react-dom/client";
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
