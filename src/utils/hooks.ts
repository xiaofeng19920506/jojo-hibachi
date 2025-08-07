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
    if (isAuthenticated && user?.id) {
      // Connect to SSE when user is authenticated
      connectToSSE(user, options);
    } else {
      // Disconnect when user is not authenticated
      disconnectFromSSE();
    }

    // Cleanup on unmount
    return () => {
      // Only disconnect if user is not authenticated
      if (!isAuthenticated) {
        disconnectFromSSE();
      }
    };
  }, [isAuthenticated, user?.id, user?.role, options]);

  return {
    isConnected: isSSEConnected(),
    isConnecting: isSSEConnecting(),
  };
};
