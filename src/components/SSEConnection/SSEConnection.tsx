import React, { useEffect } from "react";
import { useAppSelector } from "../../utils/hooks";
import {
  connectToSSE,
  disconnectFromSSE,
  isSSEConnected,
} from "../../utils/sseUtils";

interface SSEConnectionProps {
  onNotification?: (notification: any) => void;
}

const SSEConnection: React.FC<SSEConnectionProps> = ({ onNotification }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      connectToSSE(user, {
        onNotification: (notification) => {
          const event = new CustomEvent("sse-notification", {
            detail: notification,
          });
          window.dispatchEvent(event);
          onNotification?.(notification);
        },
        onConnected: () => {},
        onDisconnect: () => {},
        onError: () => {},
      });
    } else {
      disconnectFromSSE();
    }

    return () => {
      disconnectFromSSE();
    };
  }, [isAuthenticated, user?.id, onNotification]);

  return null;
};

export default SSEConnection;
