import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  connectToSSE,
  disconnectFromSSE,
  isSSEConnected,
  isSSEConnecting,
  type SSEConnectionOptions,
} from "./sseUtils";
import { useEffect } from "react";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hook for SSE connection management
export const useSSEConnection = (options: SSEConnectionOptions = {}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  useEffect(() => {
    console.log("useSSEConnection: Auth state changed", {
      isAuthenticated,
      userId: user?.id,
    });

    if (isAuthenticated && user?.id) {
      console.log("useSSEConnection: User is authenticated, connecting to SSE");
      // Connect to SSE when user is authenticated
      connectToSSE(user, {
        ...options,
        onConnected: () => {
          console.log(
            "useSSEConnection: SSE connection established for user",
            user.id
          );
          options.onConnected?.();
        },
        onError: (error) => {
          console.error("useSSEConnection: SSE connection error", error);
          options.onError?.(error);
        },
        onDisconnect: () => {
          console.log(
            "useSSEConnection: SSE connection disconnected for user",
            user.id
          );
          options.onDisconnect?.();
        },
      });
    } else {
      console.log(
        "useSSEConnection: User is not authenticated, disconnecting SSE"
      );
      // Disconnect when user is not authenticated
      disconnectFromSSE();
    }

    // Set up an interval to check connection status
    const checkInterval = setInterval(() => {
      const connected = isSSEConnected();
      console.log("useSSEConnection: Connection status check", {
        userId: user?.id,
        isConnected: connected,
      });

      // If we're authenticated but not connected, try to reconnect
      if (isAuthenticated && user?.id && !connected) {
        console.log(
          "useSSEConnection: Connection lost, attempting to reconnect"
        );
        connectToSSE(user, options);
      }
    }, 30000); // Check every 30 seconds

    // Cleanup on unmount
    return () => {
      clearInterval(checkInterval);
      console.log("useSSEConnection: Cleaning up", {
        isAuthenticated,
        userId: user?.id,
      });
      // Only disconnect if user is not authenticated
      if (!isAuthenticated) {
        disconnectFromSSE();
      }
    };
  }, [isAuthenticated, user?.id, user?.role, options]);

  const connected = isSSEConnected();
  const connecting = isSSEConnecting();

  console.log("useSSEConnection: Current state", {
    isConnected: connected,
    isConnecting: connecting,
    userId: user?.id,
  });

  return {
    isConnected: connected,
    isConnecting: connecting,
  };
};
