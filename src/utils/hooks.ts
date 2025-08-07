import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { useAppSelector } from "../store";
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
    // Skip connection management for admin users if skipForAdmin is true
    if (options.skipForAdmin && user?.role === "admin") {
      console.log("Skipping SSE connection management for admin user");
      return;
    }

    if (isAuthenticated && user?.id) {
      // Connect to SSE when user is authenticated
      connectToSSE(user, options);
    } else {
      // Only disconnect if user is not authenticated (not for admin users)
      disconnectFromSSE();
    }

    // Cleanup on unmount - but don't disconnect for admin users
    return () => {
      // Only disconnect if user is not admin or not authenticated
      if (!isAuthenticated || user?.role !== "admin") {
        disconnectFromSSE();
      }
    };
  }, [isAuthenticated, user?.id, user?.role, options]);

  return {
    isConnected: isSSEConnected(),
    isConnecting: isSSEConnecting(),
  };
};
