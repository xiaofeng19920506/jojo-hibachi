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

  // For admin users, we don't manage connection here since it's handled in GlobalAppBar
  const { isConnected, isConnecting } = useSSEConnection({
    onNotification,
    onConnected,
    onError,
    onDisconnect,
    // Skip connection management for admin users in this component
    skipForAdmin: true,
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
