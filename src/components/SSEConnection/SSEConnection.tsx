import { useSSEConnection } from "../../utils/hooks";
import { useEffect } from "react";
import { useAppSelector } from "../../utils/hooks";

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
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  const { isConnected, isConnecting } = useSSEConnection({
    onNotification: (notification) => {
      // Call the provided callback if any
      onNotification?.(notification);

      // Dispatch a custom event for GlobalAppBar to listen to
      const event = new CustomEvent("sse-notification", {
        detail: notification,
      });
      window.dispatchEvent(event);
    },
    onConnected,
    onError,
    onDisconnect,
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
