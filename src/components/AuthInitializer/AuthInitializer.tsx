import { useEffect, useState } from "react";
import { useAppDispatch } from "../../utils/hooks";
import { initializeAuth } from "../../features/userSlice";
import { Box, CircularProgress, Typography } from "@mui/material";

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  // Track the token in state to ensure reactivity
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));

  // Listen for changes to localStorage (e.g., after login in another tab)
  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem("authToken"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Also update token if it changes in this tab
  useEffect(() => {
    const id = setInterval(() => {
      const current = localStorage.getItem("authToken");
      if (current !== token) setToken(current);
    }, 300);
    return () => clearInterval(id);
  }, [token]);

  // On mount, rehydrate user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(
        initializeAuth({ user: JSON.parse(storedUser), isAuthenticated: true })
      );
    }
  }, [dispatch]);

  // Remove all usage of useVerifyTokenQuery and related logic

  if (!token) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Verifying authentication...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;
