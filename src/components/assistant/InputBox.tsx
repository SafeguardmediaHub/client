'use client';

import { Send } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface InputBoxProps {
  onSend: (message: string) => void;
  disabled: boolean;
  hasMedia: boolean;
}

export const InputBox = ({ onSend, disabled, hasMedia }: InputBoxProps) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-4 bg-white dark:bg-slate-900">
      {hasMedia && (
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>Media uploaded</span>
        </div>
      )}
      <div className="flex items-end gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? 'Thinking...'
              : 'Ask me about verification tools...'
          }
          disabled={disabled}
          className="min-h-[60px] max-h-[120px] resize-none"
          aria-label="Message input"
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          size="icon"
          className="h-[60px] w-12 flex-shrink-0"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
};
