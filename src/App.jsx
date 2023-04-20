import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import Header from "./components/Header";
import FrontPage from "./pages/FrontPage";
import LoginPage from "./pages/LoginPage";
import TimeTrackingPage from "./pages/TimeTrackingPage";
import UserRoute from "./components/UserRoute";
import GuestRoute from "./components/GuestRoute";

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Header />
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route
            path="login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route path="time-tracking" element={<TimeTrackingPage />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
