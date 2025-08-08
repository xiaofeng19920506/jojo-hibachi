import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Badge,
  Menu,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { logout } from "../../features/userSlice";
import { api } from "../../services/api";
import {
  forceDisconnectSSE,
  type NotificationData,
} from "../../utils/sseUtils";
import { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import ListItemButton from "@mui/material/ListItemButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  MarkEmailRead as MarkReadIcon,
} from "@mui/icons-material";
import logo from "../../asset/logo.png";

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
  elevation?: number;
  themeMode?: string;
  setThemeMode?: (mode: string) => void;
}

const GlobalAppBar: React.FC<GlobalAppBarProps> = ({
  title = "Dashboard",
  showLogout = true,
  showNavigation = true,
  elevation = 1,
  themeMode = "light",
  setThemeMode,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [currentNotification, setCurrentNotification] =
    useState<NotificationData | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [notificationMenuAnchor, setNotificationMenuAnchor] =
    useState<null | HTMLElement>(null);

  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const currentPath = location.pathname;
  const isOnPasswordResetFlow =
    currentPath.includes("/reset-password") ||
    currentPath.includes("/forgot-password");

  useEffect(() => {
    const handleNotification = (event: CustomEvent<NotificationData>) => {
      console.log("Notification received in GlobalAppBar:", event.detail);
      setNotifications((prev) => [event.detail, ...prev]);
      setCurrentNotification(event.detail);
      setSnackbarOpen(true);
    };

    // Cast the event listener to handle CustomEvent
    window.addEventListener(
      "sse-notification",
      handleNotification as EventListener
    );

    return () => {
      window.removeEventListener(
        "sse-notification",
        handleNotification as EventListener
      );
    };
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setCurrentNotification(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationMenuAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchor(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    handleNotificationMenuClose();
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "success":
        return <SuccessIcon color="success" />;
      case "warning":
        return <WarningIcon color="warning" />;
      case "error":
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getNotificationSeverity = (type: string) => {
    switch (type.toLowerCase()) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "error";
      default:
        return "info";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    forceDisconnectSSE();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    dispatch(logout());
    dispatch(api.util.resetApiState());
    navigate("/signin");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getNavigationButtons = () => {
    const buttons: ActionButton[] = [];

    if (!isOnPasswordResetFlow) {
      buttons.push({
        label: "Book Now",
        variant: "contained",
        color: "secondary",
        onClick: () => handleNavigation("/booknow"),
      });
    }

    if (!isAuthenticated || isOnPasswordResetFlow) {
      if (currentPath !== "/signin") {
        buttons.push({
          label: "Login",
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
      // For authenticated users, always show Dashboard and Profile
      buttons.push({
        label: "Dashboard",
        variant: "contained",
        color: "primary",
        onClick: () => handleNavigation("/dashboard"),
      });

      buttons.push({
        label: "Profile",
        variant: "outlined",
        color: "secondary",
        onClick: () => handleNavigation("/profile"),
      });

      // Show Weekly Calendar only for non-user roles
      if (currentPath !== "/calendar" && user?.role && user.role !== "user") {
        buttons.push({
          label: "Weekly Calendar",
          variant: "contained",
          color: "primary",
          onClick: () => handleNavigation("/calendar"),
        });
      }
    }

    return buttons;
  };

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const allActionButtons = showNavigation ? [...getNavigationButtons()] : [];

  return (
    <AppBar position="fixed" color="primary" elevation={elevation}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          py: 1,
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            component="img"
            src={logo}
            alt="Fancy Hibachi Logo"
            sx={{
              height: { xs: 40, sm: 50 },
              width: "auto",
              cursor: "pointer",
              mixBlendMode: "multiply", // This removes white backgrounds
              filter: "contrast(1.1) brightness(1.1)", // Enhances visibility
              // Alternative blend modes if multiply doesn't work well:
              // mixBlendMode: "screen", // For dark backgrounds
              // mixBlendMode: "overlay", // For mixed backgrounds
            }}
            onClick={() => handleNavigation("/")}
          />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            sx={{ flex: 1 }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", mb: 0.5, fontSize: { xs: 20, sm: 28 } }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          {!isMobile && (
            <>
              {allActionButtons.map((button, index) => {
                const isSpecial = [
                  "Dashboard",
                  "Weekly Calendar",
                  "Book Now",
                  "Profile",
                  "Logout",
                  "Login",
                  "Sign Up",
                ].includes(button.label);
                return (
                  <Button
                    key={index}
                    variant={button.variant || "outlined"}
                    color={button.color || "primary"}
                    onClick={button.onClick}
                    disabled={button.disabled}
                    sx={{
                      textTransform: "none",
                      width: { xs: "100%", sm: "auto" },
                      borderColor: "#fff",
                      color: "#fff",
                      ...(isSpecial && {
                        border: "2px solid #fff",
                        backgroundColor: "transparent",
                        "&:hover": {
                          backgroundColor:
                            button.label === "Login" ||
                            button.label === "Sign Up"
                              ? theme.palette.primary.main
                              : theme.palette.secondary.main,
                          borderColor:
                            button.label === "Login" ||
                            button.label === "Sign Up"
                              ? theme.palette.primary.main
                              : theme.palette.secondary.main,
                          color: "#fff",
                        },
                      }),
                    }}
                  >
                    {button.label}
                  </Button>
                );
              })}

              {showLogout && isAuthenticated && !isOnPasswordResetFlow && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  sx={{
                    textTransform: "none",
                    width: { xs: "100%", sm: "auto" },
                    border: "2px solid #fff",
                    color: "#fff",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.main,
                      borderColor: theme.palette.secondary.main,
                      color: "#fff",
                    },
                  }}
                >
                  Logout
                </Button>
              )}

              {/* Notification Icon - For all authenticated users */}
              {isAuthenticated && (
                <IconButton
                  color="inherit"
                  onClick={handleNotificationMenuOpen}
                  sx={{
                    ml: 1,
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                  aria-label="notifications"
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              )}

              {/* Theme Toggle - Always visible on desktop */}
              {setThemeMode && (
                <IconButton
                  color="inherit"
                  onClick={() =>
                    setThemeMode(themeMode === "dark" ? "light" : "dark")
                  }
                  sx={{
                    ml: 1,
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                  aria-label="toggle dark mode"
                >
                  {themeMode === "dark" ? (
                    <Brightness7Icon />
                  ) : (
                    <Brightness4Icon />
                  )}
                </IconButton>
              )}
            </>
          )}
        </Box>
        {isMobile && (
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
                sx={{
                  width: 220,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                role="presentation"
                onClick={handleDrawerClose}
              >
                <List sx={{ flex: 1 }}>
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
                  {/* Notifications - For all authenticated users */}
                  {isAuthenticated && (
                    <ListItem disablePadding>
                      <ListItemButton onClick={handleNotificationMenuOpen}>
                        <ListItemIcon>
                          <Badge badgeContent={unreadCount} color="error">
                            <NotificationsIcon />
                          </Badge>
                        </ListItemIcon>
                        <ListItemText primary="Notifications" />
                      </ListItemButton>
                    </ListItem>
                  )}
                  {showLogout && isAuthenticated && !isOnPasswordResetFlow && (
                    <ListItem disablePadding>
                      <ListItemButton onClick={handleLogout}>
                        <ListItemText
                          primary="Logout"
                          sx={{ color: theme.palette.error.main }}
                        />
                      </ListItemButton>
                    </ListItem>
                  )}
                  {/* Theme Toggle - Always visible in mobile drawer */}
                  {setThemeMode && (
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() =>
                          setThemeMode(themeMode === "dark" ? "light" : "dark")
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {themeMode === "dark" ? (
                          <Brightness7Icon />
                        ) : (
                          <Brightness4Icon />
                        )}
                        <ListItemText
                          primary={
                            themeMode === "dark" ? "Light Mode" : "Dark Mode"
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  )}
                </List>

                {/* Logo at the bottom of the drawer */}
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    borderTop: 1,
                    borderColor: "divider",
                    backgroundColor: "background.paper",
                  }}
                >
                  <Box
                    component="img"
                    src={logo}
                    alt="Fancy Hibachi Logo"
                    sx={{
                      height: 40,
                      width: "auto",
                      cursor: "pointer",
                      mixBlendMode: "multiply",
                      filter: "contrast(1.1) brightness(1.1)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation("/");
                      handleDrawerClose();
                    }}
                  />
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    sx={{ flex: 1 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        fontSize: 14,
                        color: "text.primary",
                      }}
                    >
                      Fancy Hibachi
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: 10,
                        color: "text.secondary",
                        fontStyle: "italic",
                        fontWeight: 500,
                      }}
                    >
                      @2025 by Fancy Hibachi
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: 10,
                        color: "text.secondary",
                        fontStyle: "italic",
                        fontWeight: 500,
                      }}
                    >
                      Version 1.0.0
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Drawer>
          </>
        )}
      </Toolbar>

      {/* Notification Snackbar */}
      {currentNotification && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={getNotificationSeverity(currentNotification.type)}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleSnackbarClose}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <AlertTitle>{currentNotification.title}</AlertTitle>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {currentNotification.message}
              </Typography>
              {currentNotification.reservationDetails && (
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                >
                  Date: {currentNotification.reservationDetails.date} at{" "}
                  {currentNotification.reservationDetails.time}
                  <br />
                  Guests: {currentNotification.reservationDetails.totalGuests}
                  <br />
                  Price: $
                  {currentNotification.reservationDetails.price.toFixed(2)}
                </Typography>
              )}
            </Box>
          </Alert>
        </Snackbar>
      )}

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationMenuAnchor}
        open={Boolean(notificationMenuAnchor)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 400,
            overflow: "auto",
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" component="div">
              <Badge badgeContent={unreadCount} color="primary">
                <NotificationsIcon />
              </Badge>{" "}
              Notifications
            </Typography>
            {notifications.length > 0 && (
              <Button
                size="small"
                startIcon={<MarkReadIcon />}
                onClick={handleMarkAllAsRead}
              >
                Mark all read
              </Button>
            )}
          </Box>
        </Box>

        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <ListItem
                key={notification.id || index}
                sx={{
                  borderBottom: index < notifications.length - 1 ? 1 : 0,
                  borderColor: "divider",
                  backgroundColor: notification.read
                    ? "transparent"
                    : "action.hover",
                }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{ mb: 0.5 }}
                      >
                        {notification.message}
                      </Typography>
                      {notification.reservationDetails && (
                        <Typography
                          variant="caption"
                          component="div"
                          color="text.secondary"
                        >
                          Date: {notification.reservationDetails.date} at{" "}
                          {notification.reservationDetails.time}
                          <br />
                          Guests: {notification.reservationDetails.totalGuests}
                          <br />
                          Price: $
                          {notification.reservationDetails.price.toFixed(2)}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: notification.isRead ? "normal" : "bold",
                    },
                  }}
                />
                {!notification.isRead && (
                  <IconButton
                    size="small"
                    onClick={() => handleMarkAsRead(notification.id)}
                    sx={{ ml: 1 }}
                  >
                    <MarkReadIcon fontSize="small" />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Menu>
    </AppBar>
  );
};

export default GlobalAppBar;
