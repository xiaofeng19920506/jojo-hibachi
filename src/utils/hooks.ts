import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { connectToSSE, disconnectFromSSE } from "./sseUtils";
import { useEffect, useState } from "react";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useSSEConnection = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      setIsConnecting(true);
      connectToSSE(user, {
        onConnected: () => {
          setIsConnected(true);
          setIsConnecting(false);
        },
        onDisconnect: () => {
          setIsConnected(false);
          setIsConnecting(false);
        },
        onError: () => {
          setIsConnected(false);
          setIsConnecting(false);
        },
      });
    } else {
      disconnectFromSSE();
      setIsConnected(false);
      setIsConnecting(false);
    }

    return () => {
      disconnectFromSSE();
      setIsConnected(false);
      setIsConnecting(false);
    };
  }, [isAuthenticated, user?.id]);

  return {
    isConnected,
    isConnecting,
  };
};
