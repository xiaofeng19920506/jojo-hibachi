import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useAppDispatch } from "../../utils/hooks";
import { logout } from "../../features/userSlice";

// Types for button configuration
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
  actionButtons?: ActionButton[];
  elevation?: number;
  color?: "default" | "primary" | "secondary" | "transparent" | "inherit";
}

const GlobalAppBar: React.FC<GlobalAppBarProps> = ({
  title = "Dashboard",
  subtitle,
  showLogout = true,
  actionButtons = [],
  elevation = 1,
  color = "default",
}) => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("authToken");
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
          {actionButtons.map((button, index) => (
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

          {showLogout && (
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
