'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface OnboardingTooltipProps {
  onDismiss: () => void;
}

export const OnboardingTooltip = ({ onDismiss }: OnboardingTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay showing tooltip for smooth entrance
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for exit animation
  };

  return (
    <div
      className={`fixed right-24 bottom-8 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}
    >
      <div className="relative">
        {/* Arrow pointing to the button */}
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-blue-600" />
        
        {/* Tooltip content */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl shadow-2xl p-4 max-w-xs">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">
                ✨ Need Help Verifying Media?
              </h4>
              <p className="text-xs text-blue-100">
                Ask our AI Assistant! I'll recommend the best verification workflows for your needs.
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
              aria-label="Dismiss tooltip"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <Button
            onClick={handleDismiss}
            size="sm"
            className="w-full mt-3 bg-white text-blue-600 hover:bg-blue-50 font-medium"
          >
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );
};
