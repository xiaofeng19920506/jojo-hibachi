// Example usage of SSE utilities
import { connectToSSE, disconnectFromSSE } from "./sseUtils";

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
  {
    id: "user123",
    email: "user@example.com",
    role: "user",
    firstName: "John",
    lastName: "Doe",
  },
  {
    onNotification: handleNotification,
    onConnected: handleConnected,
    onDisconnect: handleDisconnected,
    onError: handleError,
  }
);

disconnectFromSSE();
