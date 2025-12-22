'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io, type Socket } from 'socket.io-client';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
});

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect if user is authenticated
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Flag to prevent state updates after cleanup
    let isMounted = true;

    // Fetch temporary WebSocket token from backend
    const connectWebSocket = async () => {
      try {
        // Get temporary WebSocket token from backend (protected by HTTP-only cookie)
        const response = await api.get('/api/auth/ws-token');
        const wsToken = response.data.data.wsToken;

        if (!isMounted) return; // Component unmounted, don't continue

        if (!wsToken) {
          console.error('[WebSocket] No token received from backend');
          toast.error('Failed to establish real-time connection');
          return;
        }

        // Initialize socket connection with temporary token
        const newSocket = io(
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000',
          {
            query: { token: wsToken },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            autoConnect: true,
          }
        );

        // Connection events
        newSocket.on('connect', () => {
          if (isMounted) setIsConnected(true);
        });

        newSocket.on('connected', (data) => {});

        newSocket.on('disconnect', (reason) => {
          if (isMounted) setIsConnected(false);

          if (reason === 'io server disconnect') {
            // Server disconnected us, try to reconnect manually
            newSocket.connect();
          }
        });

        newSocket.on('connect_error', (error) => {
          console.error('[WebSocket] Connection error:', error.message);
          if (isMounted) setIsConnected(false);

          // Show toast only for auth errors
          if (error.message.includes('Authentication')) {
            toast.error(
              'WebSocket authentication failed. Please refresh the page.'
            );
          }
        });

        newSocket.on('error', (error) => {
          console.error('[WebSocket] Error:', error);
        });

        newSocket.on('reconnect', (_attemptNumber) => {
          toast.success('Connection restored');
        });

        newSocket.on('reconnect_failed', () => {
          console.error('[WebSocket] Failed to reconnect');
          toast.error('Unable to connect to server. Please refresh the page.');
        });

        if (isMounted) {
          setSocket(newSocket);
        }
      } catch (error) {
        console.error('[WebSocket] Failed to initialize connection:', error);
        if (isMounted) {
          toast.error('Failed to establish real-time connection');
        }
      }
    };

    // Start connection process
    connectWebSocket();

    // Cleanup
    return () => {
      isMounted = false;
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
    };
  }, [user]);

  return (
    <WebSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}
