import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { useAppSelector } from "../../utils/hooks";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.user);

  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
