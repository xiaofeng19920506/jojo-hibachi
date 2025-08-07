import { type User } from "../features/types";

interface NotificationData {
  id: string;
  message: string;
  type: string;
  timestamp: string;
  read: boolean;
}

interface SSEConnectionOptions {
  onNotification?: (notification: NotificationData) => void;
  onConnected?: () => void;
  onError?: (error: Event) => void;
  onDisconnect?: () => void;
  skipForAdmin?: boolean; // Skip connection management for admin users
}

class SSEManager {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1 second
  private _isConnecting = false;

  connect(userId: string, options: SSEConnectionOptions = {}) {
    if (this.eventSource || this._isConnecting) {
      console.log("SSE connection already exists or connecting");
      return;
    }

    this._isConnecting = true;
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token available for SSE connection");
      this._isConnecting = false;
      return;
    }

    try {
      // Create EventSource with user ID and token
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      // Remove trailing slash if present to avoid double slashes
      const cleanBaseUrl = baseUrl.endsWith("/")
        ? baseUrl.slice(0, -1)
        : baseUrl;
      // EventSource doesn't support custom headers, so we pass the token as a URL parameter
      const url = `${cleanBaseUrl}/notification/sse/${userId}?token=${encodeURIComponent(
        token
      )}`;
      console.log("SSE URL:", url); // Debug log
      this.eventSource = new EventSource(url);

      // Listen for notifications
      this.eventSource.addEventListener("notification", (event) => {
        try {
          const notification = JSON.parse(event.data) as NotificationData;
          console.log("New notification:", notification);
          options.onNotification?.(notification);
        } catch (error) {
          console.error("Error parsing notification data:", error);
        }
      });

      // Listen for connection confirmation
      this.eventSource.addEventListener("connected", (event) => {
        console.log("SSE connection established");
        this.reconnectAttempts = 0;
        this._isConnecting = false;
        options.onConnected?.();
      });

      // Handle connection open
      this.eventSource.onopen = () => {
        console.log("SSE connection opened");
        this.reconnectAttempts = 0;
        this._isConnecting = false;
        options.onConnected?.();
      };

      // Handle errors
      this.eventSource.onerror = (event) => {
        console.error("SSE connection error:", event);
        this._isConnecting = false;
        options.onError?.(event);

        // Attempt to reconnect if connection was lost
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          this.handleReconnect(userId, options);
        }
      };

      // Handle connection close
      this.eventSource.addEventListener("close", () => {
        console.log("SSE connection closed");
        this._isConnecting = false;
        options.onDisconnect?.();
      });
    } catch (error) {
      console.error("Error creating SSE connection:", error);
      this._isConnecting = false;
      options.onError?.(error as Event);
    }
  }

  private handleReconnect(userId: string, options: SSEConnectionOptions) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
    );

    setTimeout(() => {
      this.disconnect();
      this.connect(userId, options);
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this._isConnecting = false;
      this.reconnectAttempts = 0;
      console.log("SSE connection disconnected");
    }
  }

  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }

  isConnecting(): boolean {
    return this._isConnecting;
  }
}

// Create a singleton instance
const sseManager = new SSEManager();

// Utility function to connect to SSE when user logs in
export const connectToSSE = (
  user: User,
  options: SSEConnectionOptions = {}
) => {
  if (!user?.id) {
    console.error("User ID is required to connect to SSE");
    return;
  }

  // Check if we should maintain existing connection for admin users
  const shouldMaintainConnection =
    user.role === "admin" && sseManager.isConnected();

  if (shouldMaintainConnection) {
    console.log("Maintaining existing SSE connection for admin user");
    return;
  }

  // Disconnect any existing connection first (except for admin users)
  if (user.role !== "admin") {
    sseManager.disconnect();
  }

  // Connect with the new user
  sseManager.connect(user.id, options);
};

// Utility function to disconnect from SSE
export const disconnectFromSSE = (force: boolean = false) => {
  // For admin users, only force disconnect if explicitly requested
  if (!force) {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (currentUser.role === "admin" && sseManager.isConnected()) {
      console.log("Keeping SSE connection active for admin user");
      return;
    }
  }

  sseManager.disconnect();
};

// Utility function to check connection status
export const isSSEConnected = (): boolean => {
  return sseManager.isConnected();
};

// Utility function to check if connecting
export const isSSEConnecting = (): boolean => {
  return sseManager.isConnecting();
};

// Utility function to force disconnect (for logout scenarios)
export const forceDisconnectSSE = () => {
  sseManager.disconnect();
};

// Export the manager instance for advanced usage
export { sseManager };

export type { NotificationData, SSEConnectionOptions };
