/**
 * Application Entry Point
 *
 * Initializes the React application with:
 * - MSAL authentication provider
 * - Tailwind CSS styling
 * - Root component mounting
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import "./index.css";
import App from "./App";
import { msalConfig } from "./authConfig";
import { initializeApi } from "./services/api";

/**
 * Initialize MSAL - Microsoft Authentication Library
 * This creates the authentication context for the entire application
 */
const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Initialize API service with MSAL for token-based authentication
 */
initializeApi(msalInstance);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
);
