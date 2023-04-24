import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { admin } = UserAuth();

  if (!admin) {
    return <Navigate to="/" />;
  }
  return children;
};

export default AdminRoute;
