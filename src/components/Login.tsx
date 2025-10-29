/**
 * Login Component
 *
 * Displays the authentication page with a "Sign in with Microsoft" button.
 * Uses MSAL to handle Azure Entra ID authentication.
 */

import React, { FC } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

const Login: FC = () => {
  const { instance } = useMsal();

  const handleLogin = async (): Promise<void> => {
    try {
      // Initiate login flow
      await instance.loginPopup(loginRequest);
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        console.error("Login requires interaction:", error);
      } else {
        console.error("Login failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        {/* Logo/Title Section */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📅</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">DayForge</h1>
          <p className="text-gray-600">Your AI-Powered Daily Assistant</p>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-700 text-center mb-4">
            Organize your tasks, build better habits, and let AI create your perfect daily schedule.
          </p>
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <span className="text-xl mr-3">✓</span>
              <span className="text-sm">Smart task management with priorities</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="text-xl mr-3">✓</span>
              <span className="text-sm">Track and build your habits</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="text-xl mr-3">✓</span>
              <span className="text-sm">AI-generated daily schedule</span>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          aria-label="Sign in with Microsoft"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
          </svg>
          Sign in with Microsoft
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-6">
          By signing in, you agree to secure your data with Azure Entra ID
        </p>
      </div>
    </div>
  );
};

export default Login;
