import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import Header from "./components/Header";
import FrontPage from "./pages/FrontPage";
import LoginPage from "./pages/LoginPage";
import WorkingTimePage from "./pages/WorkingTimePage";
import EmployeesPage from "./pages/EmployeesPage";
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
          <Route
            path="employees"
            element={
              <AdminRoute>
                <EmployeesPage />
              </AdminRoute>
            }
          />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
