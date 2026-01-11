'use client';

import { Sparkles } from 'lucide-react';

interface SuggestionChipsProps {
  onSuggestionClick: (suggestion: string) => void;
  show: boolean;
}

const suggestions = [
  'I want to verify if an image is authentic',
  'How can I check where this photo was taken?',
  'Is there a way to detect photo manipulation?',
  'Help me find where a video originally came from',
];

export const SuggestionChips = ({ onSuggestionClick, show }: SuggestionChipsProps) => {
  if (!show) return null;

  return (
    <div className="px-4 pb-3 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-t border-white/20 dark:border-slate-700/50 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Quick suggestions
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSuggestionClick(suggestion)}
            className="group inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 hover:scale-105 cursor-pointer backdrop-blur-sm"
          >
            <span className="truncate max-w-[200px]">{suggestion}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
