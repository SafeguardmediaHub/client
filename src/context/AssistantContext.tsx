'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import { flushSync } from 'react-dom';
import { useAssistantStream } from '@/hooks/useAssistantStream';
import {
  generateSessionId,
  getLastSessionId,
  loadSessionFromStorage,
  saveSessionToStorage,
  transformBackendWorkflow,
} from '@/lib/assistant-utils';
import type {
  AssistantState,
  AttachedMedia,
  Message,
  WorkflowRecommendation,
} from '@/types/assistant';

interface AssistantContextType extends AssistantState {
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  sendMessage: (message: string) => Promise<void>;
  setMediaContext: (mediaId?: string, mediaType?: 'image' | 'video' | 'audio') => void;
  clearMessages: () => void;
  setCurrentWorkflow: (workflow: WorkflowRecommendation | null) => void;
  attachedMedia: AttachedMedia | null;
  attachMedia: (media: AttachedMedia) => void;
  removeAttachedMedia: () => void;
  resetConversation: () => void;
}

const AssistantContext = createContext<AssistantContextType | undefined>(
  undefined
);

export const AssistantProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentWorkflow, setCurrentWorkflow] =
    useState<WorkflowRecommendation | null>(null);
  const [mediaContext, setMediaContextState] = useState<{
    mediaId?: string;
    mediaType?: 'image' | 'video' | 'audio';
  }>({});
  const [attachedMedia, setAttachedMedia] = useState<AttachedMedia | null>(null);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize session on mount
  useEffect(() => {
    const lastSessionId = getLastSessionId();
    if (lastSessionId) {
      const sessionData = loadSessionFromStorage(lastSessionId);
      if (sessionData && typeof sessionData === 'object') {
        const data = sessionData as {
          messages?: Message[];
          currentWorkflow?: WorkflowRecommendation | null;
        };
        setSessionId(lastSessionId);
        if (data.messages) {
          setMessages(
            data.messages.map((msg) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }))
          );
        }
        if (data.currentWorkflow) {
          setCurrentWorkflow(data.currentWorkflow);
        }
      }
    } else {
      // Create new session
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
    }
  }, []);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (sessionId) {
      saveSessionToStorage(sessionId, {
        messages,
        currentWorkflow,
      });
    }
  }, [sessionId, messages, currentWorkflow]);

  const openAssistant = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeAssistant = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleAssistant = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const setMediaContext = useCallback(
    (mediaId?: string, mediaType?: 'image' | 'video' | 'audio') => {
      setMediaContextState({ mediaId, mediaType });
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentWorkflow(null);
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
  }, []);

  const attachMedia = useCallback((media: AttachedMedia) => {
    setAttachedMedia(media);
    // Also update mediaContext for backward compatibility
    setMediaContextState({
      mediaId: media.id,
      mediaType: media.type,
    });
    // Open assistant if not already open
    if (!isOpen) {
      setIsOpen(true);
    }
  }, [isOpen]);

  const removeAttachedMedia = useCallback(() => {
    setAttachedMedia(null);
    setMediaContextState({});
  }, []);



  // Stream handlers
  const handleWorkflowReceived = useCallback((workflow: WorkflowRecommendation) => {
    // Transform backend format to frontend format
    const transformedWorkflow = transformBackendWorkflow(workflow);
    
    // Store the workflow for reference, but don't display it as a card
    // The assistant provides recommendations via text explanation (chunks), not executable workflows
    setCurrentWorkflow(transformedWorkflow);
    
    // Don't add a workflow message - the explanation comes via text chunks
  }, []);

  // Typewriter effect state
  const typewriterBufferRef = useRef<string>('');
  const typewriterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef<boolean>(false);

  const handleChunkReceived = useCallback((text: string) => {
    // Add incoming text to buffer
    typewriterBufferRef.current += text;
    
    // Start typewriter if not already running
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      
      const typeNextChar = () => {
        if (typewriterBufferRef.current.length === 0) {
          // Buffer empty, stop typing
          isTypingRef.current = false;
          if (typewriterTimerRef.current) {
            clearTimeout(typewriterTimerRef.current);
            typewriterTimerRef.current = null;
          }
          return;
        }
        
        // Take next 3 characters from buffer (or whatever is left)
        const charsToAdd = typewriterBufferRef.current.slice(0, 3);
        typewriterBufferRef.current = typewriterBufferRef.current.slice(3);
        
        // Add characters to message
        flushSync(() => {
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            
            if (lastMessage && lastMessage.role === 'assistant' && lastMessage.type === 'text') {
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, content: (lastMessage.content as string) + charsToAdd }
              ];
            }
            
            return [
              ...prev,
              {
                role: 'assistant',
                type: 'text',
                content: charsToAdd,
                timestamp: new Date(),
              },
            ];
          });
        });
        
        // Schedule next batch (3 chars every 5ms = ~600 chars/sec)
        typewriterTimerRef.current = setTimeout(typeNextChar, 5);
      };
      
      typeNextChar();
    }
  }, []);

  const handleInstantResponse = useCallback((explanation: string, source: 'keyword_match' | 'llm') => {
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        type: 'text',
        content: explanation,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleStreamComplete = useCallback(() => {
    setIsThinking(false);
  }, []);

  const handleStreamError = useCallback((error: string) => {
    setIsThinking(false);
    toast.error(error);
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        type: 'text',
        content: "I'm having trouble connecting. Please check your connection and try again.",
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Initialize streaming hook
  const { startStream } = useAssistantStream({
    onWorkflowReceived: handleWorkflowReceived,
    onChunkReceived: handleChunkReceived,
    onInstantResponse: handleInstantResponse,
    onComplete: handleStreamComplete,
    onError: handleStreamError,
  });

  // Cleanup typewriter timer on unmount
  useEffect(() => {
    return () => {
      if (typewriterTimerRef.current) {
        clearTimeout(typewriterTimerRef.current);
      }
    };
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || !sessionId) return;

      // Add user message
      const userMessage: Message = {
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      setIsThinking(true);
      
      // Clear attached media immediately so UI updates
      if (attachedMedia) {
        removeAttachedMedia();
      }

      // Start streaming
      // Note: We use the session ID from state. The stream will handle Auth token internally.
      startStream(message, mediaContext.mediaId, sessionId);
    },
    [sessionId, mediaContext.mediaId, attachedMedia, removeAttachedMedia, startStream]
  );

  // Reset conversation
  const resetConversation = useCallback(() => {
    // Clear all messages
    setMessages([]);
    
    // Generate new session ID
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    
    // Clear workflow
    setCurrentWorkflow(null);
    
    // Remove attached media
    removeAttachedMedia();
    
    // Clear media context
    setMediaContextState({});
    
    // Clear storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('assistant_session');
    }
    
    // Show success message
    toast.success('New conversation started');
  }, [removeAttachedMedia]);

  // Idle timer for gentle reminder
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      // Only set timer if media is uploaded and assistant is closed
      if (mediaContext.mediaId && !isOpen) {
        idleTimerRef.current = setTimeout(() => {
          // Show gentle reminder (this would trigger a pulse animation)
          toast.info('Need help deciding the next step?', {
            duration: 5000,
          });
        }, 15000); // 15 seconds
      }
    };

    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [mediaContext.mediaId, isOpen]);

  const value: AssistantContextType = {
    isOpen,
    isThinking,
    sessionId,
    messages,
    currentWorkflow,
    mediaContext,
    openAssistant,
    closeAssistant,
    toggleAssistant,
    sendMessage,
    setMediaContext,
    clearMessages,
    setCurrentWorkflow,
    attachedMedia,
    attachMedia,
    removeAttachedMedia,
    resetConversation,
  };

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within AssistantProvider');
  }
  return context;
};
