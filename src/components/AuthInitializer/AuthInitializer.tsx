import { useEffect, useState } from "react";
import { useAppDispatch } from "../../utils/hooks";
import { initializeAuth } from "../../features/userSlice";
import { useVerifyTokenQuery } from "../../services/api";
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

  const skip = !token;
  const { data, error, isLoading } = useVerifyTokenQuery(undefined, { skip });

  useEffect(() => {
    if (skip) {
      dispatch(initializeAuth({ user: {} as any, isAuthenticated: false }));
      return;
    }
    if (isLoading) return;
    if (error || !data) {
      localStorage.removeItem("authToken");
      dispatch(initializeAuth({ user: {} as any, isAuthenticated: false }));
    } else {
      let userObj = data.user || data.data || data;
      if (userObj.user) userObj = userObj.user; // Unwrap if nested
      console.log("Auth verification response:", data);
      console.log("User set in Redux:", userObj);
      dispatch(initializeAuth({ user: userObj as any, isAuthenticated: true }));
    }
  }, [data, error, isLoading, skip, dispatch]);

  if (!skip && isLoading) {
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
