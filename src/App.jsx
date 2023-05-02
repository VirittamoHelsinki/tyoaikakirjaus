import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import WorkSchedulePage from "./pages/WorkSchedulePage";
import UserRoute from "./routes/UserRoute";
import GuestRoute from "./routes/GuestRoute";
import AdminRoute from "./routes/AdminRoute";

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
                <MainPage />
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
            path="work-schedule"
            element={
              <AdminRoute>
                <WorkSchedulePage />
              </AdminRoute>
            }
          />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
