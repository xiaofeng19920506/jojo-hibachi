import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAppSelector } from "../../utils/hooks";

const HomeNav: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isInitialized } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    const handleNavigation = () => {
      if (!isInitialized) {
        return; // Wait for authentication to be initialized
      }

      if (!isAuthenticated) {
        navigate("/booknow");
        return;
      }

      if (user?.role) {
        switch (user.role.toLowerCase()) {
          case "user":
            navigate("/booknow");
            break;
          case "employee":
            navigate("/dashboard");
            break;
          case "admin":
            navigate("/dashboard");
            break;
          default:
            navigate("/booknow");
            break;
        }
      } else {
        navigate("/booknow");
      }
    };

    const timer = setTimeout(handleNavigation, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, isInitialized, navigate]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
      }}
    >
      <CircularProgress size={40} sx={{ mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        Redirecting...
      </Typography>
    </Box>
  );
};

export default HomeNav;
