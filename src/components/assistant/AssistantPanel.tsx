'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { useAssistant } from '@/context/AssistantContext';
import { AssistantHeader } from './AssistantHeader';
import { ConversationView } from './ConversationView';
import { InputBox } from './InputBox';
import { SuggestionChips } from './SuggestionChips';
import { Button } from '../ui/button';
import type { AttachedMedia } from '@/types/assistant';

export const AssistantPanel = () => {
  const {
    isOpen,
    isThinking,
    messages,
    closeAssistant,
    toggleAssistant,
    sendMessage,
    attachedMedia,
    attachMedia,
    removeAttachedMedia,
    resetConversation,
  } = useAssistant();

  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeAssistant();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeAssistant]);

  return (
    <>
      {/* Floating Icon (when collapsed) */}
      {!isOpen && (
        <Button
          onClick={toggleAssistant}
          className="fixed right-6 bottom-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse cursor-pointer"
          size="icon"
          aria-label="Open verification assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Assistant Panel */}
      <div
        className={`fixed right-0 top-0 h-full z-40 backdrop-blur-2xl bg-white/70 dark:bg-slate-900/70 border-l border-white/20 dark:border-slate-700/50 shadow-2xl transition-transform duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } w-full md:w-[400px]`}
        role="complementary"
        aria-label="Verification Assistant"
      >
        <div className="flex flex-col h-full overflow-hidden backdrop-blur-sm">
          <AssistantHeader 
            onClose={closeAssistant} 
            onReset={resetConversation} 
            isThinking={isThinking} 
          />
          <ConversationView messages={messages} isThinking={isThinking} />
          {/* <SuggestionChips 
            onSuggestionClick={(suggestion) => sendMessage(suggestion)}
            show={messages.length <= 3}
          /> */}
          <InputBox
            onSend={sendMessage}
            disabled={isThinking}
            attachedMedia={attachedMedia}
            onAttachMedia={attachMedia}
            onRemoveMedia={removeAttachedMedia}
          />
        </div>

      </div>

      {/* Backdrop (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeAssistant}
          aria-hidden="true"
        />
      )}
    </>
  );
};
