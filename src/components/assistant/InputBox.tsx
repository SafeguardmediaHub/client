'use client';

import { Send, Paperclip } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { AttachedMediaChip } from './AttachedMediaChip';
import { MediaPickerModal } from './MediaPickerModal';
import type { AttachedMedia } from '@/types/assistant';

interface InputBoxProps {
  onSend: (message: string) => void;
  disabled: boolean;
  attachedMedia: AttachedMedia | null;
  onAttachMedia: (media: AttachedMedia) => void;
  onRemoveMedia: () => void;
}

export const InputBox = ({ 
  onSend, 
  disabled, 
  attachedMedia,
  onAttachMedia,
  onRemoveMedia 
}: InputBoxProps) => {
  const [input, setInput] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleSend = () => {
    // Allow sending if there's text OR if there's media attached
    if ((input.trim() || attachedMedia) && !disabled) {
      onSend(input.trim() || 'Check this media');
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMediaSelect = (media: AttachedMedia) => {
    onAttachMedia(media);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const getPlaceholder = () => {
    if (disabled) return 'Thinking...';
    if (attachedMedia) {
      const mediaType = attachedMedia.type;
      return `Ask about this ${mediaType}...`;
    }
    return 'Ask the AI assistant anything...';
  };

  return (
    <div className="p-4 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-t border-white/20 dark:border-slate-700/50">
      {/* Attached Media Chip */}
      {attachedMedia && (
        <div className="mb-3">
          <AttachedMediaChip 
            media={attachedMedia} 
            onRemove={onRemoveMedia}
          />
        </div>
      )}

      {/* Input Container with Glassmorphism */}
      <div className="relative backdrop-blur-md bg-white/60 dark:bg-slate-800/60 rounded-xl border border-white/30 dark:border-slate-700/50 shadow-lg transition-all duration-300 focus-within:border-indigo-400 dark:focus-within:border-indigo-500 focus-within:shadow-xl focus-within:shadow-indigo-500/20 dark:focus-within:shadow-indigo-500/30 focus-within:ring-2 focus-within:ring-indigo-400/50 dark:focus-within:ring-indigo-500/50">
        {/* Text Input */}
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          disabled={disabled}
          className="min-h-[80px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 pb-12 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          aria-label="Message input"
        />

        {/* Controls - Positioned inside at bottom with justify-between */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          {/* Left: Attachment Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowMediaPicker(true)}
            disabled={disabled || !!attachedMedia}
            className="h-9 w-9 cursor-pointer hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg"
            aria-label="Attach media from gallery"
            title={attachedMedia ? 'Remove current attachment first' : 'Attach media from gallery'}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Right: Send Button */}
          <Button
            onClick={handleSend}
            disabled={disabled || (!input.trim() && !attachedMedia)}
            size="icon"
            className="h-9 w-9 cursor-pointer rounded-lg"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-400 mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  );
};
