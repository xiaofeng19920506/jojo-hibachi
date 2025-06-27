import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Replace with your actual auth logic

  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
