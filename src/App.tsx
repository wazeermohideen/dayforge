/**
 * Root App Component
 *
 * Routes between:
 * - Login page (unauthenticated users)
 * - TodoAssistant main app (authenticated users)
 */

import React, { FC } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import Login from "./components/Login";
import TodoAssistant from "./components/TodoAssistant";

const App: FC = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="App">
      {isAuthenticated ? <TodoAssistant /> : <Login />}
    </div>
  );
};

export default App;
