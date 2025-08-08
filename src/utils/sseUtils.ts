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
  private reconnectDelay = 1000;
  private pendingReloadTimer: number | null = null;

  private _isConnecting = false;
  private currentUserId: string | null = null;
  private handleNotification: ((event: MessageEvent) => void) | null = null;

  connect(userId: string, options: SSEConnectionOptions = {}) {
    if (
      this.eventSource &&
      this.currentUserId === userId &&
      this.isConnected()
    ) {
      return;
    }

    if (this.eventSource && this.currentUserId !== userId) {
      this.disconnect();
    }

    if (this._isConnecting) {
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
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      if (!baseUrl) {
        throw new Error("VITE_BACKEND_URL is not defined");
      }

      const cleanBaseUrl = baseUrl.endsWith("/")
        ? baseUrl.slice(0, -1)
        : baseUrl;
      const url = `${cleanBaseUrl}/notification/sse/${userId}?token=${encodeURIComponent(
        token
      )}`;

      this.eventSource = new EventSource(url);

      const logReadyState = () => {};

      logReadyState();

      const readyStateInterval = setInterval(() => {
        if (this.eventSource) {
          logReadyState();
        } else {
          clearInterval(readyStateInterval);
        }
      }, 5000);

      if (this.handleNotification) {
        this.eventSource.removeEventListener(
          "notification",
          this.handleNotification
        );
      }

      this.handleNotification = (event: MessageEvent) => {
        try {
          if (!event.data) {
            console.error("SSE event data is empty");
            return;
          }

          let rawNotification: NotificationData;
          try {
            rawNotification = JSON.parse(event.data) as NotificationData;
            const ensuredId =
              (rawNotification as any)._id ||
              (rawNotification as any).id ||
              event.lastEventId ||
              `sse-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            (rawNotification as any).id = ensuredId;

            if (!rawNotification.type) {
              throw new Error("Missing required fields in notification");
            }
          } catch (parseError) {
            console.error("Failed to parse notification data:", parseError);
            console.error("Raw data received:", event.data);
            return;
          }

          const user = localStorage.getItem("user");
          const userInfo = user ? JSON.parse(user) : null;

          if (
            rawNotification.customerInfo &&
            !rawNotification.customerInfo.isAnonymous
          ) {
            const isForCurrentUser =
              userInfo &&
              (userInfo.email === rawNotification.customerInfo.email ||
                userInfo.id === this.currentUserId);

            if (!isForCurrentUser) {
              return;
            }
          }

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

          const notification: NotificationData = {
            id: rawNotification.id,
            title: rawNotification.title,
            message: rawNotification.message,
            type: notificationType,
            isRead: false,
            createdAt: rawNotification.createdAt || new Date().toISOString(),
            reservationId: rawNotification.reservationId,
            customerInfo: rawNotification.customerInfo,
            reservationDetails: rawNotification.reservationDetails,
          };

          // Trigger a page refresh for any SSE notification event
          this.schedulePageRefresh();

          options.onNotification?.(notification);
        } catch (error) {
          console.error("Error parsing notification data:", error);
          console.error("Raw event data:", event.data);
        }
      };

      this.eventSource.addEventListener(
        "notification",
        this.handleNotification
      );

      this.eventSource.onmessage = () => {
        // Trigger a page refresh on any generic SSE message
        this.schedulePageRefresh();
      };

      this.eventSource.addEventListener("connected", () => {
        this.reconnectAttempts = 0;
        this._isConnecting = false;
        options.onConnected?.();
      });

      this.eventSource.onopen = () => {
        this.reconnectAttempts = 0;
        this._isConnecting = false;
        options.onConnected?.();
      };

      this.eventSource.onerror = (event) => {
        this._isConnecting = false;
        options.onError?.(event);

        if (this.eventSource?.readyState === EventSource.CLOSED) {
          this.handleReconnect(userId, options);
        }
      };

      this.eventSource.addEventListener("close", () => {
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

    setTimeout(() => {
      this.disconnect();
      this.connect(userId, options);
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  private schedulePageRefresh() {
    // Avoid multiple rapid reloads by debouncing
    if (this.pendingReloadTimer !== null) return;
    this.pendingReloadTimer = window.setTimeout(() => {
      this.pendingReloadTimer = null;
      window.location.reload();
    }, 300);
  }

  disconnect() {
    if (this.eventSource) {
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

const sseManager = new SSEManager();

export const connectToSSE = (
  user: User,
  options: SSEConnectionOptions = {}
) => {
  if (!user?.id) {
    console.error("User ID is required to connect to SSE");
    return;
  }

  sseManager.connect(user.id, options);
};

export const disconnectFromSSE = () => {
  sseManager.disconnect();
};

export const isSSEConnected = (): boolean => {
  return sseManager.isConnected();
};

export const isSSEConnecting = (): boolean => {
  return sseManager.isConnecting();
};

export const forceDisconnectSSE = () => {
  sseManager.disconnect();
};

export { sseManager };

export type { NotificationData, SSEConnectionOptions };
