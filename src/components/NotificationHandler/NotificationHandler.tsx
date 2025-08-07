import { useState, useEffect } from "react";
import { useSSEConnection } from "../../utils/hooks";
import { type NotificationData } from "../../utils/sseUtils";
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Badge,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

interface NotificationHandlerProps {
  showSnackbar?: boolean;
  showNotificationList?: boolean;
}

const NotificationHandler: React.FC<NotificationHandlerProps> = ({
  showSnackbar = true,
  showNotificationList = false,
}) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [currentNotification, setCurrentNotification] =
    useState<NotificationData | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { isConnected } = useSSEConnection({
    onNotification: (notification: NotificationData) => {
      console.log("Received notification:", notification);

      // Add to notifications list
      setNotifications((prev) => [notification, ...prev]);

      // Show as snackbar if enabled
      if (showSnackbar) {
        setCurrentNotification(notification);
        setSnackbarOpen(true);
      }
    },
    onConnected: () => {
      console.log("SSE connection established");
    },
    onError: (error) => {
      console.error("SSE connection error:", error);
    },
    onDisconnect: () => {
      console.log("SSE connection disconnected");
    },
    skipForAdmin: true, // Skip connection management for admin users
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setCurrentNotification(null);
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

  return (
    <>
      {/* Snackbar for current notification */}
      {showSnackbar && currentNotification && (
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
            <AlertTitle>{currentNotification.type}</AlertTitle>
            {currentNotification.message}
          </Alert>
        </Snackbar>
      )}

      {/* Notification list */}
      {showNotificationList && (
        <Paper
          sx={{
            position: "fixed",
            top: 80,
            right: 20,
            width: 350,
            maxHeight: 400,
            overflow: "auto",
            zIndex: 1000,
            display: notifications.length > 0 ? "block" : "none",
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6" component="div">
              <Badge badgeContent={notifications.length} color="primary">
                <NotificationsIcon />
              </Badge>{" "}
              Notifications
            </Typography>
          </Box>
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <ListItem
                key={notification.id || index}
                sx={{
                  borderBottom: index < notifications.length - 1 ? 1 : 0,
                  borderColor: "divider",
                }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={notification.message}
                  secondary={new Date(notification.timestamp).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </>
  );
};

export default NotificationHandler;
