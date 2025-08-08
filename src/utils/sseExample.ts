// Example usage of SSE utilities
import { connectToSSE, disconnectFromSSE, isSSEConnected } from "./sseUtils";

const handleNotification = (notification: any) => {
  switch (notification.type) {
    case "reservation_updated":
      break;
    case "payment_successful":
      break;
    case "system_alert":
      break;
    default:
      break;
  }
};

const handleConnected = () => {};

const handleDisconnected = () => {};

const handleError = (error: Event) => {
  console.error("SSE connection error:", error);
};

connectToSSE(
  { id: "user123", email: "user@example.com", role: "user" },
  {
    onNotification: handleNotification,
    onConnected: handleConnected,
    onDisconnect: handleDisconnected,
    onError: handleError,
  }
);

const isConnected = isSSEConnected();

disconnectFromSSE();

const retryConnection = (user: any, maxRetries = 3) => {
  let retryCount = 0;

  const attemptConnection = () => {
    if (retryCount >= maxRetries) {
      console.error("Max retry attempts reached");
      return;
    }

    connectToSSE(user, {
      onConnected: () => {},
      onError: () => {
        retryCount++;
        setTimeout(attemptConnection, 1000 * retryCount);
      },
    });
  };

  attemptConnection();
};

const ReactComponent = () => {
  const handleNotification = (notification: any) => {};

  const handleConnected = () => {};

  const handleDisconnected = () => {};

  return null;
};

const NotificationHandlers = {
  reservation: (notification: any) => {},
  payment: (notification: any) => {},
};
