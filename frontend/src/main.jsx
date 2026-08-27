import "./lib/authSetup"; // must run before any component imports axios/fetch
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './index.css'
import ReactDOM from "react-dom/client";
import React from "react";
import { AuthProvider } from "./context/AuthContext";

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.error('SW registration failed:', err);
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
