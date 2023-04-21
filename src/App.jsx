import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import Header from "./components/Header";
import FrontPage from "./pages/FrontPage";
import LoginPage from "./pages/LoginPage";
import WorkingTimePage from "./pages/WorkingTimePage";
import UserRoute from "./components/UserRoute";
import GuestRoute from "./components/GuestRoute";

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <UserRoute>
                <FrontPage />
              </UserRoute>
            }
          />
          <Route
            path="login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="working-time"
            element={
              <UserRoute>
                <WorkingTimePage />
              </UserRoute>
            }
          />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
