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
import { analyzeIntent } from '@/lib/api/assistant';
import {
  generateSessionId,
  getLastSessionId,
  loadSessionFromStorage,
  saveSessionToStorage,
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

      try {
        const response = await analyzeIntent({
          message,
          media_id: mediaContext.mediaId,
          session_id: sessionId,
        });

        // Update session ID if it changed
        if (response.session_id !== sessionId) {
          setSessionId(response.session_id);
        }

        // Add assistant response
        const assistantMessage: Message = {
          role: 'assistant',
          type: response.response.type,
          content: response.response.content as string | WorkflowRecommendation,
          timestamp: new Date(),
        } as Message;

        setMessages((prev) => [...prev, assistantMessage]);

        // If it's a workflow recommendation, set it as current
        if (response.response.type === 'workflow') {
          setCurrentWorkflow(
            response.response.content as WorkflowRecommendation
          );
        }

        // Clear attached media after successful send
        if (attachedMedia) {
          removeAttachedMedia();
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        toast.error(
          "I'm having trouble connecting. Please check your connection and try again."
        );

        // Add error message
        const errorMessage: Message = {
          role: 'assistant',
          type: 'text',
          content:
            "I'm having trouble connecting. Please check your connection and try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsThinking(false);
      }
    },
    [sessionId, mediaContext.mediaId, attachedMedia, removeAttachedMedia]
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
