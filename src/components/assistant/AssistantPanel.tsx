'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { useAssistant } from '@/context/AssistantContext';
import { AssistantHeader } from './AssistantHeader';
import { ConversationView } from './ConversationView';
import { InputBox } from './InputBox';
import { SuggestionChips } from './SuggestionChips';
import { OnboardingTooltip } from './OnboardingTooltip';
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

  // Onboarding tooltip state
  const [showTooltip, setShowTooltip] = useState(false);

  // Show tooltip on every page load
  useEffect(() => {
    if (!isOpen) {
      // Show tooltip after a short delay
      const timer = setTimeout(() => setShowTooltip(true), 2000);
      return () => clearTimeout(timer);
    } else {
      // Hide tooltip when assistant is opened
      setShowTooltip(false);
    }
  }, [isOpen]);

  const handleDismissTooltip = () => {
    setShowTooltip(false);
  };

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
        <>
          <div className="fixed right-6 bottom-6 z-50">
            {/* Animated gradient ring */}
            <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 opacity-75 blur-sm animate-spin-slow" />
            
            {/* Glow/spotlight effect */}
            <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 opacity-30 blur-xl animate-pulse" />
            
            <Button
              onClick={toggleAssistant}
              className="relative h-14 w-14 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-2 border-white"
              size="icon"
              aria-label="Open AI assistant"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </div>

          {/* Onboarding tooltip for first-time users */}
          {showTooltip && <OnboardingTooltip onDismiss={handleDismissTooltip} />}
        </>
      )}

      {/* Assistant Panel */}
      <div
        className={`fixed right-0 top-0 h-full z-40 backdrop-blur-2xl bg-white/70 dark:bg-slate-900/70 border-l border-white/20 dark:border-slate-700/50 shadow-2xl transition-transform duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } w-full md:w-[400px]`}
        role="complementary"
        aria-label="AI Assistant"
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
