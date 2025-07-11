import { Navigate } from "react-router-dom";
import { useEffect, type ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { login, logout } from "../../features/userSlice";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        dispatch(logout());
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/verifyToken`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok && data.status === "success") {
          dispatch(login(...data));
        }
      } catch (error) {
        dispatch(logout());
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
