import { type User } from "../features/types";

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isAnonymous: boolean;
}

interface ReservationDetails {
  date: string;
  time: string;
  totalGuests: number;
  address: string;
  price: number;
}

interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  reservationId?: string;
  customerInfo?: CustomerInfo;
  reservationDetails?: ReservationDetails;
}

interface SSEConnectionOptions {
  onNotification?: (notification: NotificationData) => void;
  onConnected?: () => void;
  onError?: (error: Event) => void;
  onDisconnect?: () => void;
}

class SSEManager {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1 second
  private _isConnecting = false;
  private currentUserId: string | null = null;
  private handleNotification: ((event: MessageEvent) => void) | null = null;

  connect(userId: string, options: SSEConnectionOptions = {}) {
    // If already connected to the same user, don't reconnect
    if (
      this.eventSource &&
      this.currentUserId === userId &&
      this.isConnected()
    ) {
      console.log("SSE connection already exists for this user");
      return;
    }

    // If connecting to a different user, disconnect first
    if (this.eventSource && this.currentUserId !== userId) {
      this.disconnect();
    }

    if (this._isConnecting) {
      console.log("SSE connection already in progress");
      return;
    }

    this._isConnecting = true;
    this.currentUserId = userId;
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token available for SSE connection");
      this._isConnecting = false;
      return;
    }

    try {
      // Create EventSource with user ID and token
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      console.log("Backend URL from env:", {
        baseUrl,
        isDefined: typeof baseUrl !== "undefined",
        envVars: import.meta.env,
      });

      if (!baseUrl) {
        throw new Error("VITE_BACKEND_URL is not defined");
      }

      // Remove trailing slash if present to avoid double slashes
      const cleanBaseUrl = baseUrl.endsWith("/")
        ? baseUrl.slice(0, -1)
        : baseUrl;
      // EventSource doesn't support custom headers, so we pass the token as a URL parameter
      const url = `${cleanBaseUrl}/notification/sse/${userId}?token=${encodeURIComponent(
        token
      )}`;
      console.log("Attempting SSE connection with:", {
        url,
        userId,
        hasToken: !!token,
        existingConnection: !!this.eventSource,
        readyState: this.eventSource?.readyState,
      });

      this.eventSource = new EventSource(url);
      console.log("EventSource created successfully");

      // Log readyState changes
      const logReadyState = () => {
        const states = ["CONNECTING", "OPEN", "CLOSED"];
        console.log("SSE ReadyState:", {
          state: states[this.eventSource?.readyState || 0],
          numeric: this.eventSource?.readyState,
          timestamp: new Date().toISOString(),
        });
      };

      // Log initial state
      logReadyState();

      // Monitor readyState changes
      const readyStateInterval = setInterval(() => {
        if (this.eventSource) {
          logReadyState();
        } else {
          clearInterval(readyStateInterval);
        }
      }, 5000); // Check every 5 seconds

      // Remove any existing notification listeners to prevent duplicates
      if (this.handleNotification) {
        this.eventSource.removeEventListener(
          "notification",
          this.handleNotification
        );
      }

      // Create a bound event handler
      this.handleNotification = (event: MessageEvent) => {
        try {
          const eventId = Math.random().toString(36).substring(7);
          console.log(`[${eventId}] Raw SSE notification event received:`, {
            event,
            type: event.type,
            data: event.data,
            lastEventId: event.lastEventId,
          });

          // Verify the event data is a string and not empty
          if (!event.data) {
            console.error("SSE event data is empty");
            return;
          }

          let rawNotification: NotificationData;
          try {
            rawNotification = JSON.parse(event.data) as NotificationData;
            console.log("Parsed notification:", rawNotification);
            // Ensure we have a stable id even if backend payload omits it
            const ensuredId =
              (rawNotification as any)._id || // Check for _id first (backend format)
              (rawNotification as any).id || // Then check for id (SSE format)
              event.lastEventId ||
              `sse-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            (rawNotification as any).id = ensuredId;

            // Validate required fields (type is required)
            if (!rawNotification.type) {
              throw new Error("Missing required fields in notification");
            }
          } catch (parseError) {
            console.error("Failed to parse notification data:", parseError);
            console.error("Raw data received:", event.data);
            return;
          }

          console.log("SSE connection state:", {
            currentUserId: this.currentUserId,
            readyState: this.eventSource?.readyState,
            notificationType: rawNotification.type,
          });

          // Get user info from localStorage
          const user = localStorage.getItem("user");
          const userInfo = user ? JSON.parse(user) : null;
          console.log("Current user info:", userInfo);

          // Check if this notification is for the current user
          if (
            rawNotification.customerInfo &&
            !rawNotification.customerInfo.isAnonymous
          ) {
            const isForCurrentUser =
              userInfo &&
              (userInfo.email === rawNotification.customerInfo.email ||
                userInfo.id === this.currentUserId);

            if (!isForCurrentUser) {
              console.log("Notification is for a different user, skipping");
              return;
            }
          }

          // Transform notification type for UI display
          let notificationType: "success" | "info" | "warning" | "error" =
            "info";
          switch (rawNotification.type) {
            case "reservation_confirmed":
            case "reservation_updated":
              notificationType = "success";
              break;
            case "reservation_pending":
              notificationType = "info";
              break;
            case "reservation_warning":
              notificationType = "warning";
              break;
            case "reservation_cancelled":
            case "reservation_rejected":
              notificationType = "error";
              break;
            default:
              notificationType = "info";
          }

          // Transform the notification for UI consumption
          const notification: NotificationData = {
            id: rawNotification.id, // Ensure id is explicitly set
            title: rawNotification.title,
            message: rawNotification.message,
            type: notificationType,
            isRead: false,
            createdAt: rawNotification.createdAt || new Date().toISOString(),
            reservationId: rawNotification.reservationId,
            customerInfo: rawNotification.customerInfo,
            reservationDetails: rawNotification.reservationDetails,
          };

          console.log(`[${eventId}] Processed notification:`, notification);

          // Log before dispatching to onNotification
          console.log(`[${eventId}] Calling onNotification callback`);
          options.onNotification?.(notification);

          // Log after dispatching to onNotification
          console.log(`[${eventId}] onNotification callback completed`);
        } catch (error) {
          console.error("Error parsing notification data:", error);
          console.error("Raw event data:", event.data);
        }
      };

      // Add the event listener
      this.eventSource.addEventListener(
        "notification",
        this.handleNotification
      );

      // Listen for all events (for debugging)
      this.eventSource.onmessage = (event) => {
        console.log("SSE generic message received:", {
          data: event.data,
          lastEventId: event.lastEventId,
          origin: event.origin,
          timestamp: new Date().toISOString(),
        });
      };

      // Listen for connection confirmation
      this.eventSource.addEventListener("connected", (event) => {
        console.log("SSE connection established:", {
          data: event.data,
          lastEventId: event.lastEventId,
          origin: event.origin,
          timestamp: new Date().toISOString(),
        });
        this.reconnectAttempts = 0;
        this._isConnecting = false;
        options.onConnected?.();
      });

      // Handle connection open
      this.eventSource.onopen = () => {
        console.log("SSE connection opened:", {
          readyState: this.eventSource?.readyState,
          userId: this.currentUserId,
          timestamp: new Date().toISOString(),
        });
        this.reconnectAttempts = 0;
        this._isConnecting = false;
        options.onConnected?.();
      };

      // Handle errors
      this.eventSource.onerror = (event) => {
        console.error("SSE connection error:", {
          event,
          readyState: this.eventSource?.readyState,
          userId: this.currentUserId,
          reconnectAttempts: this.reconnectAttempts,
          timestamp: new Date().toISOString(),
        });
        this._isConnecting = false;
        options.onError?.(event);

        // Attempt to reconnect if connection was lost
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          console.log("SSE connection closed, attempting reconnect");
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
      // Remove event listeners
      if (this.handleNotification) {
        this.eventSource.removeEventListener(
          "notification",
          this.handleNotification
        );
        this.handleNotification = null;
      }

      this.eventSource.close();
      this.eventSource = null;
      this._isConnecting = false;
      this.reconnectAttempts = 0;
      this.currentUserId = null;
      console.log("SSE connection disconnected");
    }
  }

  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }

  isConnecting(): boolean {
    return this._isConnecting;
  }

  getCurrentUserId(): string | null {
    return this.currentUserId;
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

  // Connect with the new user
  sseManager.connect(user.id, options);
};

// Utility function to disconnect from SSE
export const disconnectFromSSE = () => {
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
