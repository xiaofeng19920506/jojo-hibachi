import { useEffect } from "react";
import { useAppDispatch } from "../../utils/hooks";
import { initializeAuth, logout } from "../../features/userSlice";
import { Box, CircularProgress, Typography } from "@mui/material";

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuthentication = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        // No token found, user is not authenticated
        dispatch(initializeAuth({ user: {} as any, isAuthenticated: false }));
        return;
      }

      try {
        // Verify token with backend
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
        console.log("Token verification response:", data); // Debug log

        if (
          response.ok &&
          (data.status === "success" ||
            data.valid === true ||
            data.isValid === true)
        ) {
          // Token is valid, user is authenticated
          const user = data.user || data.data || data;
          dispatch(
            initializeAuth({ user: user as any, isAuthenticated: true })
          );
        } else {
          // Token is invalid, remove it and set user as not authenticated
          console.log("Token verification failed:", data); // Debug log
          localStorage.removeItem("authToken");
          dispatch(initializeAuth({ user: {} as any, isAuthenticated: false }));
        }
      } catch (error) {
        // Error occurred, remove token and set user as not authenticated
        console.error("Error verifying token:", error);
        localStorage.removeItem("authToken");
        dispatch(initializeAuth({ user: {} as any, isAuthenticated: false }));
      }
    };

    initializeAuthentication();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthInitializer;
