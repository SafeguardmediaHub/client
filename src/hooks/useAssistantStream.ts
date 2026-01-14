import { useState, useCallback, useRef } from 'react';
import { streamWithRetry } from '@/lib/api/stream-client';
import type { WorkflowRecommendation, AcknowledgmentContent, ClarifyingQuestion } from '@/types/assistant';

interface StreamState {
  isStreaming: boolean;
  error: string | null;
}

interface UseAssistantStreamProps {
  onWorkflowReceived: (workflow: WorkflowRecommendation) => void;
  onChunkReceived: (text: string) => void;
  onInstantResponse: (explanation: string, source: 'keyword_match' | 'llm' | 'cache') => void;
  onAcknowledgmentReceived: (content: AcknowledgmentContent) => void;
  onQuestionReceived: (question: ClarifyingQuestion) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}

export function useAssistantStream({
  onWorkflowReceived,
  onChunkReceived,
  onInstantResponse,
  onAcknowledgmentReceived,
  onQuestionReceived,
  onComplete,
  onError,
}: UseAssistantStreamProps) {
  const [state, setState] = useState<StreamState>({
    isStreaming: false,
    error: null,
  });

  // Keep track of the abort controller to cancel active streams
  const abortControllerRef = useRef<AbortController | null>(null);

  const startStream = useCallback(async (message: string, mediaId?: string, sessionId?: string) => {
    // 1. Abort any existing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setState({ isStreaming: true, error: null });

    // 2. Get Auth Token
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    // We can proceed without token if it's a public assistant, but usually we need it.
    // Assuming we need it for now, or the backend handles public access.

    // 3. Construct full URL
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '';
    const streamUrl = `${baseUrl}/api/assistant/intent-stream`;

    try {
      await streamWithRetry({
        url: streamUrl,
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: { 
          message, 
          media_id: mediaId,
          session_id: sessionId 
        },
        signal: abortControllerRef.current.signal,
        timeoutMs: 45000, // Generous timeout for LLMs
        onMessage: (event, data) => {
          switch (event) {
            case 'structure':
              // Handle different structure types
              if (data.type === 'workflow') {
                onWorkflowReceived(data.content);
              } else if (data.type === 'acknowledgment') {
                onAcknowledgmentReceived(data.content);
              } else if (data.type === 'question') {
                onQuestionReceived(data.content);
              }
              break;
            case 'chunk':
              if (data.text) {
                onChunkReceived(data.text);
              }
              break;
            case 'instant':
              onInstantResponse(data.explanation, data.source);
              break;
            case 'error':
              onError(data.error || 'Stream error');
              break;
            case 'done':
              // Stream will close naturally
              break;
          }
        },
        onError: (err) => {
          console.error('Stream error:', err);
          const errorMessage = err.message === 'Unauthorized' 
            ? 'Please log in to continue.' 
            : 'Failed to connect to assistant. Please try again.';
          
          setState(prev => ({ ...prev, error: errorMessage }));
          onError(errorMessage);
        },
        onClose: () => {
          setState(prev => ({ ...prev, isStreaming: false }));
          abortControllerRef.current = null;
          onComplete();
        }
      });
    } catch (err: any) {
      // Top-level catch for setup errors not handled by stream client
      const msg = err.message || 'Failed to start stream';
      setState({ isStreaming: false, error: msg });
      onError(msg);
    }
  }, [onWorkflowReceived, onChunkReceived, onInstantResponse, onAcknowledgmentReceived, onQuestionReceived, onComplete, onError]);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setState(prev => ({ ...prev, isStreaming: false }));
    }
  }, []);

  return {
    ...state,
    startStream,
    stopStream
  };
}
