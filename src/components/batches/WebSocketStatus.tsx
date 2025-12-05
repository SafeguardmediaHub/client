import { Wifi, WifiOff } from 'lucide-react';
import { useWebSocket } from '@/context/WebSocketContext';

export function WebSocketStatus() {
  const { isConnected } = useWebSocket();

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
        ${isConnected
          ? 'bg-green-100 text-green-700 border border-green-200'
          : 'bg-orange-100 text-orange-700 border border-orange-200'
        }
      `}
    >
      {isConnected ? (
        <>
          <Wifi className="h-3.5 w-3.5" />
          <span>Live Updates</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5" />
          <span>Polling Mode</span>
        </>
      )}
    </div>
  );
}
