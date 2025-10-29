/**
 * Authentication Configuration for Azure Entra ID (MSAL)
 *
 * This file configures the Microsoft Authentication Library (MSAL) for React.
 * Update the clientId and authority with your Azure Entra ID application details.
 */

import type { MSALConfig, LoginRequest, ApiRequest } from "./types";

export const msalConfig: MSALConfig = {
  auth: {
    // Replace with your Azure Entra ID tenant ID and client ID
    clientId: process.env.REACT_APP_CLIENT_ID || "YOUR_CLIENT_ID",
    authority:
      process.env.REACT_APP_AUTHORITY || "https://login.microsoftonline.com/YOUR_TENANT_ID",
    redirectUri: process.env.REACT_APP_REDIRECT_URI || "http://localhost:3000",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

/**
 * Login request configuration
 * Scopes define what permissions the app is requesting from the user
 */
export const loginRequest: LoginRequest = {
  scopes: ["openid", "profile", "email"],
};

/**
 * API request configuration
 * This scope should match the backend API scope configured in Azure Entra ID
 */
export const apiRequest: ApiRequest = {
  scopes: [process.env.REACT_APP_API_SCOPE || "api://<YOUR_API_CLIENT_ID>/.default"],
};
