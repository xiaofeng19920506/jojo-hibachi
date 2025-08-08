import React, { useEffect } from "react";
import { useAppSelector } from "../../utils/hooks";
import { connectToSSE, disconnectFromSSE } from "../../utils/sseUtils";

interface NotificationHandlerProps {
  onNotification?: (notification: any) => void;
}

const NotificationHandler: React.FC<NotificationHandlerProps> = ({
  onNotification,
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      connectToSSE(user, {
        onNotification: (notification) => {
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

export default NotificationHandler;
