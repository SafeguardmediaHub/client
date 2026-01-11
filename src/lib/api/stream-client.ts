import { toast } from 'sonner';

export interface SSEConfig {
  url: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: any;
  onOpen?: () => void;
  onMessage?: (event: string, data: any) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
  signal?: AbortSignal;
  timeoutMs?: number;
}

/**
 * Robust SSE Client using fetch and ReadableStream.
 * Supports:
 * - Custom Headers (for JWT)
 * - POST requests (for sending large payloads)
 * - Connection Timeouts
 * - AbortController for cancellation
 */
export async function fetchSSE({
  url,
  method = 'POST',
  headers = {},
  body,
  onOpen,
  onMessage,
  onError,
  onClose,
  signal,
  timeoutMs = 30000, // Default 30s timeout
}: SSEConfig): Promise<void> {
  let timeoutId: NodeJS.Timeout | null = null;
  const controller = new AbortController();
  
  // Link the passed signal to our internal controller
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  const resetTimeout = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      controller.abort();
      onError?.(new Error('Connection timed out due to inactivity'));
    }, timeoutMs);
  };

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    onOpen?.();
    resetTimeout();

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      resetTimeout(); // Reset timeout on data received

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      
      const lines = buffer.split('\n');
      // Keep the last partial line in the buffer
      buffer = lines.pop() || '';

      let currentEvent = '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (!trimmedLine) continue;

        if (trimmedLine.startsWith('event:')) {
          currentEvent = trimmedLine.substring(6).trim();
        } else if (trimmedLine.startsWith('data:')) {
          const dataStr = trimmedLine.substring(5).trim();
          
          try {
            // Parse JSON data if it looks like JSON, otherwise return string
            const data = dataStr.startsWith('{') || dataStr.startsWith('[') 
              ? JSON.parse(dataStr) 
              : dataStr;
              
            onMessage?.(currentEvent || 'message', data);
            
            // Allow processing multiple events in one chunk, reset event name after use if needed?
            // Standard SSE defines event name persistance until changed, but typically they are paired.
            // For this implementation, we assume event comes before data or defaults to 'message'
          } catch (e) {
            console.warn('Failed to parse SSE data:', dataStr);
          }
        }
      }
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      // Ignore abort errors as they are likely user-initiated
      return;
    }
    onError?.(error);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
    onClose?.();
  }
}

/**
 * Retries an SSE connection with exponential backoff on failure.
 * Wraps clean fetchSSE logic.
 */
export async function streamWithRetry(
  config: SSEConfig, 
  maxRetries = 3
): Promise<void> {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      await fetchSSE(config);
      return; // Success or graceful close
    } catch (error: any) {
      attempt++;
      
      // Don't retry client errors (4xx)
      if (error.message.includes('HTTP error! status: 4')) {
        throw error;
      }
      
      // Check if we exhausted retries
      if (attempt >= maxRetries) {
        throw error;
      }
      
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s...
      console.warn(`Stream connection failed, retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
