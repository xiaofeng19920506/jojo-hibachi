// Example usage of SSE utilities
import { connectToSSE, disconnectFromSSE, isSSEConnected, sseManager, type SSEConnectionOptions } from './sseUtils';
import { type User } from '../features/types';

// Example 1: Basic usage with a user object
export const exampleBasicUsage = (user: User) => {
  // Connect to SSE when user logs in
  connectToSSE(user, {
    onNotification: (notification) => {
      console.log('Received notification:', notification);
      // Handle the notification (e.g., show toast, update UI, etc.)
    },
    onConnected: () => {
      console.log('SSE connection established');
    },
    onError: (error) => {
      console.error('SSE connection error:', error);
    },
    onDisconnect: () => {
      console.log('SSE connection disconnected');
    },
  });
};

// Example 2: Advanced usage with custom notification handling
export const exampleAdvancedUsage = (user: User) => {
  const options: SSEConnectionOptions = {
    onNotification: (notification) => {
      // Custom notification handling
      switch (notification.type) {
        case 'reservation_update':
          // Handle reservation updates
          console.log('Reservation updated:', notification.message);
          break;
        case 'payment_success':
          // Handle payment confirmations
          console.log('Payment successful:', notification.message);
          break;
        case 'system_alert':
          // Handle system alerts
          console.log('System alert:', notification.message);
          break;
        default:
          console.log('General notification:', notification.message);
      }
    },
    onConnected: () => {
      console.log('Connected to notification service');
      // You could update UI state here
    },
    onError: (error) => {
      console.error('SSE error:', error);
      // You could show an error message to the user
    },
    onDisconnect: () => {
      console.log('Disconnected from notification service');
      // You could update UI state here
    },
  };

  connectToSSE(user, options);
};

// Example 3: Manual connection management
export const exampleManualManagement = (user: User) => {
  // Connect manually
  sseManager.connect(user.id, {
    onNotification: (notification) => {
      console.log('Manual notification:', notification);
    },
  });

  // Check connection status
  const isConnected = isSSEConnected();
  console.log('Is connected:', isConnected);

  // Disconnect manually
  disconnectFromSSE();
};

// Example 4: Connection with retry logic
export const exampleWithRetry = (user: User) => {
  let retryCount = 0;
  const maxRetries = 3;

  const connectWithRetry = () => {
    connectToSSE(user, {
      onConnected: () => {
        console.log('Successfully connected to SSE');
        retryCount = 0; // Reset retry count on successful connection
      },
      onError: (error) => {
        console.error('SSE connection failed:', error);
        retryCount++;
        
        if (retryCount < maxRetries) {
          console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
          setTimeout(() => {
            connectWithRetry();
          }, 1000 * retryCount); // Exponential backoff
        } else {
          console.error('Max retries reached, giving up');
        }
      },
    });
  };

  connectWithRetry();
};

// Example 5: Integration with React component
export const exampleReactIntegration = () => {
  // This would be used in a React component
  // The useSSEConnection hook handles most of this automatically
  
  return {
    // The hook automatically connects/disconnects based on authentication state
    // You just need to provide the callback functions
    onNotification: (notification: any) => {
      console.log('React component received notification:', notification);
    },
    onConnected: () => {
      console.log('React component SSE connected');
    },
    onError: (error: Event) => {
      console.error('React component SSE error:', error);
    },
    onDisconnect: () => {
      console.log('React component SSE disconnected');
    },
  };
};

// Example 6: Multiple notification handlers
export const exampleMultipleHandlers = (user: User) => {
  // You can have different handlers for different parts of your app
  const reservationHandler = {
    onNotification: (notification: any) => {
      if (notification.type === 'reservation_update') {
        console.log('Reservation handler:', notification);
      }
    },
  };

  const paymentHandler = {
    onNotification: (notification: any) => {
      if (notification.type === 'payment_success' || notification.type === 'payment_failed') {
        console.log('Payment handler:', notification);
      }
    },
  };

  // Note: Only one SSE connection per user is supported
  // You would typically combine handlers or use a central notification system
  connectToSSE(user, {
    onNotification: (notification) => {
      // Route to appropriate handlers
      reservationHandler.onNotification(notification);
      paymentHandler.onNotification(notification);
    },
  });
}; 