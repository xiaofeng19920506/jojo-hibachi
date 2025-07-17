import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { logout } from "../../features/userSlice";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

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
  showLogout = true,
  showNavigation = true,
  actionButtons = [],
  elevation = 1,
  color = "default",
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    dispatch(logout());
    navigate("/signin");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

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
      // Add Profile button for authenticated users
      if (currentPath !== "/profile") {
        buttons.push({
          label: "Profile",
          variant: "outlined",
          color: "secondary",
          onClick: () => handleNavigation("/profile"),
        });
      }
    }

    return buttons;
  };

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const allActionButtons = showNavigation
    ? [...getNavigationButtons(), ...actionButtons]
    : actionButtons;

  return (
    <AppBar position="fixed" color={color} elevation={elevation}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          py: 1,
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", mb: 0.5, fontSize: { xs: 20, sm: 28 } }}
          >
            {title}
          </Typography>
        </Box>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerOpen}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={handleDrawerClose}
            >
              <Box
                sx={{ width: 220 }}
                role="presentation"
                onClick={handleDrawerClose}
              >
                <List>
                  {allActionButtons.map((button, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton
                        onClick={button.onClick}
                        disabled={button.disabled}
                      >
                        <ListItemText primary={button.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  {showLogout && isAuthenticated && (
                    <ListItem disablePadding>
                      <ListItemButton onClick={handleLogout}>
                        <ListItemText
                          primary="Logout"
                          sx={{ color: theme.palette.error.main }}
                        />
                      </ListItemButton>
                    </ListItem>
                  )}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box
            display="flex"
            gap={2}
            alignItems="center"
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              width: { xs: "100%", sm: "auto" },
              mt: { xs: 1, sm: 0 },
              mb: { xs: 1, sm: 0 },
              justifyContent: { xs: "flex-end", sm: "flex-end" },
            }}
          >
            {allActionButtons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant || "outlined"}
                color={button.color || "primary"}
                onClick={button.onClick}
                disabled={button.disabled}
                sx={{
                  textTransform: "none",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                {button.label}
              </Button>
            ))}

            {showLogout && isAuthenticated && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{
                  textTransform: "none",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default GlobalAppBar;
