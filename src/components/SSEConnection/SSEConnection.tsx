import { useSSEConnection } from "../../utils/hooks";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { api } from "../../services/api";

interface SSEConnectionProps {
  onNotification?: (notification: any) => void;
  onConnected?: () => void;
  onError?: (error: Event) => void;
  onDisconnect?: () => void;
}

const SSEConnection: React.FC<SSEConnectionProps> = ({
  onNotification,
  onConnected,
  onError,
  onDisconnect,
}) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  const { isConnected, isConnecting } = useSSEConnection({
    onNotification: (notification) => {
      console.log("SSEConnection: Notification received", notification);

      // Dispatch a custom event for GlobalAppBar to listen to
      console.log("SSEConnection: Dispatching sse-notification event");
      const event = new CustomEvent("sse-notification", {
        detail: notification,
      });
      window.dispatchEvent(event);
      console.log("SSEConnection: Event dispatched");

      // Invalidate RTK Query caches so data refreshes automatically
      // Prefer targeted tags; most notifications relate to reservations
      try {
        dispatch(api.util.invalidateTags(["Reservations"]));
      } catch (e) {
        console.error("Failed to invalidate RTK Query tags on notification", e);
      }

      // Call the provided callback if any (after dispatching event)
      if (onNotification) {
        console.log("SSEConnection: Calling onNotification callback");
        onNotification(notification);
      }
    },
    onConnected: () => {
      console.log("SSEConnection: Connection established");
      onConnected?.();
    },
    onError: (error) => {
      console.error("SSEConnection: Connection error", error);
      onError?.(error);
    },
    onDisconnect: () => {
      console.log("SSEConnection: Connection disconnected");
      onDisconnect?.();
    },
  });

  // Log connection status for debugging
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      if (isConnected) {
        console.log(`SSE connected for user: ${user.id} (role: ${user.role})`);
      } else if (isConnecting) {
        console.log(`SSE connecting for user: ${user.id} (role: ${user.role})`);
      } else {
        console.log(
          `SSE disconnected for user: ${user.id} (role: ${user.role})`
        );
      }
    }
  }, [isConnected, isConnecting, isAuthenticated, user?.id, user?.role]);

  // This component doesn't render anything visible
  // It just manages the SSE connection
  return null;
};

export default SSEConnection;
