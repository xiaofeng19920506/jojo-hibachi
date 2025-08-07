# SSE (Server-Sent Events) Implementation

This implementation provides a complete SSE connection management system for real-time notifications in the Jojo Hibachi application.

## Overview

The SSE implementation consists of several components:

1. **SSE Utilities** (`src/utils/sseUtils.ts`) - Core SSE connection management
2. **SSE Hook** (`src/utils/hooks.ts`) - React hook for SSE connection
3. **SSE Connection Component** (`src/components/SSEConnection/SSEConnection.tsx`) - Automatic connection management
4. **Notification Handler** (`src/components/NotificationHandler/NotificationHandler.tsx`) - UI for displaying notifications

## Features

- ✅ Automatic connection when user logs in
- ✅ Automatic disconnection when user logs out
- ✅ **Persistent connections for admin users** (connections established when GlobalAppBar mounts)
- ✅ **Connection management in GlobalAppBar** for admin users (stays active across all pages)
- ✅ Automatic reconnection with exponential backoff
- ✅ Error handling and logging
- ✅ TypeScript support with proper types
- ✅ React integration with hooks
- ✅ Notification display with Material-UI components
- ✅ Connection status indicators (development mode)

## Usage

### Automatic Usage (Recommended)

The SSE connection is automatically managed when you include the components in your app:

```tsx
// In your App.tsx
import SSEConnection from "./components/SSEConnection/SSEConnection";
import NotificationHandler from "./components/NotificationHandler/NotificationHandler";

function App() {
  return (
    <AuthInitializer>
      <SSEConnection />
      <NotificationHandler showSnackbar={true} showNotificationList={false} />
      {/* Your app content */}
    </AuthInitializer>
  );
}
```

### Manual Usage

You can also use the SSE utilities directly:

```tsx
import { connectToSSE, disconnectFromSSE } from "../utils/sseUtils";
import { useSSEConnection } from "../utils/hooks";

// In a component
const MyComponent = () => {
  const { isConnected, isConnecting } = useSSEConnection({
    onNotification: (notification) => {
      console.log("Received notification:", notification);
    },
    onConnected: () => {
      console.log("SSE connected");
    },
    onError: (error) => {
      console.error("SSE error:", error);
    },
  });

  return <div>Status: {isConnected ? "Connected" : "Disconnected"}</div>;
};
```

### Direct API Usage

```tsx
import {
  connectToSSE,
  disconnectFromSSE,
  isSSEConnected,
} from "../utils/sseUtils";

// Connect to SSE
connectToSSE(user, {
  onNotification: (notification) => {
    console.log("Notification:", notification);
  },
  onConnected: () => {
    console.log("Connected");
  },
  onError: (error) => {
    console.error("Error:", error);
  },
});

// Check connection status
const connected = isSSEConnected();

// Disconnect
disconnectFromSSE();
```

## API Reference

### SSE Utilities

#### `connectToSSE(user: User, options?: SSEConnectionOptions)`

Connects to the SSE endpoint for the given user.

**Parameters:**

- `user`: User object with `id` property
- `options`: Optional configuration object

**Options:**

- `onNotification`: Callback for receiving notifications
- `onConnected`: Callback when connection is established
- `onError`: Callback for connection errors
- `onDisconnect`: Callback when connection is closed
- `skipForAdmin`: Skip connection management for admin users (used when connection is managed elsewhere)

#### `disconnectFromSSE(force?: boolean)`

Disconnects from the SSE endpoint. For admin users, only disconnects if `force` is true.

#### `isSSEConnected(): boolean`

Returns whether the SSE connection is currently active.

#### `isSSEConnecting(): boolean`

Returns whether the SSE connection is currently being established.

#### `forceDisconnectSSE()`

Force disconnects the SSE connection (used for logout scenarios).

### React Hook

#### `useSSEConnection(options?: SSEConnectionOptions)`

React hook that automatically manages SSE connection based on authentication state.

**Returns:**

- `isConnected`: Boolean indicating connection status
- `isConnecting`: Boolean indicating if connection is being established

### Components

#### `SSEConnection`

Component that automatically manages SSE connection. Renders nothing visible.

#### `NotificationHandler`

Component that displays notifications received via SSE.

**Props:**

- `showSnackbar`: Whether to show notifications as snackbars (default: true)
- `showNotificationList`: Whether to show a notification list (default: false)

## Notification Data Structure

```typescript
interface NotificationData {
  id: string;
  message: string;
  type: string;
  timestamp: string;
  read: boolean;
}
```

## Configuration

The SSE endpoint URL is constructed using:

```
${import.meta.env.VITE_BACKEND_URL}/api/v1/notification/sse/${userId}?token=${token}
```

Make sure your backend environment variable `VITE_BACKEND_URL` is properly set. The authentication token is passed as a URL parameter since EventSource doesn't support custom headers.

## Error Handling

The implementation includes comprehensive error handling:

- Connection failures trigger automatic reconnection attempts
- Maximum 5 reconnection attempts with exponential backoff
- Proper cleanup on component unmount
- Error logging for debugging

## Development Features

In development mode, a connection status indicator is displayed in the bottom-right corner showing whether the SSE connection is active.

## Security

- SSE connection requires authentication token
- Token is automatically included in connection headers
- Connection is automatically closed on logout

## Examples

See `src/utils/sseExample.ts` for comprehensive usage examples including:

- Basic usage
- Advanced notification handling
- Manual connection management
- Retry logic
- React integration
- Multiple notification handlers
