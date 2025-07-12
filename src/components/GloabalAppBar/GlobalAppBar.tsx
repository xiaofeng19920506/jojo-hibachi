import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { logout } from "../../features/userSlice";
interface ActionButton {
  label: string;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  onClick: () => void;
  disabled?: boolean;
}

interface GlobalAppBarProps {
  title?: string;
  subtitle?: string;
  showLogout?: boolean;
  showNavigation?: boolean;
  actionButtons?: ActionButton[];
  elevation?: number;
  color?: "default" | "primary" | "secondary" | "transparent" | "inherit";
}

const GlobalAppBar: React.FC<GlobalAppBarProps> = ({
  title = "Dashboard",
  subtitle,
  showLogout = true,
  showNavigation = true,
  actionButtons = [],
  elevation = 1,
  color = "default",
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("authToken");
    navigate("/signin");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const defaultSubtitle =
    subtitle ||
    `${getGreeting()}! Welcome back to your ${title.toLowerCase()}.`;

  const getNavigationButtons = () => {
    const buttons: ActionButton[] = [];
    const currentPath = location.pathname;

    if (!isAuthenticated) {
      if (currentPath !== "/signin") {
        buttons.push({
          label: "Sign In",
          variant: "outlined",
          color: "secondary",
          onClick: () => handleNavigation("/signin"),
        });
      }
      if (currentPath !== "/signup") {
        buttons.push({
          label: "Sign Up",
          variant: "contained",
          color: "secondary",
          onClick: () => handleNavigation("/signup"),
        });
      }
    } else {
      if (currentPath !== "/dashboard") {
        buttons.push({
          label: "Dashboard",
          variant: "outlined",
          color: "secondary",
          onClick: () => handleNavigation("/dashboard"),
        });
      }
      if (currentPath !== "/booknow") {
        buttons.push({
          label: "Book Now",
          variant: "contained",
          color: "secondary",
          onClick: () => handleNavigation("/booknow"),
        });
      }
    }

    return buttons;
  };

  const allActionButtons = showNavigation
    ? [...getNavigationButtons(), ...actionButtons]
    : actionButtons;

  return (
    <AppBar position="static" color={color} elevation={elevation}>
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", mb: 0.5 }}
          >
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {defaultSubtitle}
          </Typography>
        </Box>

        <Box display="flex" gap={2} alignItems="center">
          {allActionButtons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant || "outlined"}
              color={button.color || "primary"}
              onClick={button.onClick}
              disabled={button.disabled}
              sx={{ textTransform: "none" }}
            >
              {button.label}
            </Button>
          ))}

          {showLogout && isAuthenticated && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              sx={{ textTransform: "none" }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default GlobalAppBar;
