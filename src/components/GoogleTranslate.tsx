'use client';

import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' },
  { code: 'ar', label: 'Arabic' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ru', label: 'Russian' },
  { code: 'ja', label: 'Japanese' },
  { code: 'hi', label: 'Hindi' },
];

interface GoogleTranslateProps {
  className?: string;
  variant?: 'outline' | 'ghost' | 'default' | 'secondary';
}

export default function GoogleTranslate({ 
  className,
  variant = 'ghost' 
}: GoogleTranslateProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('English');

  useEffect(() => {
    setMounted(true);
    
    // Check if script already exists
    if (!document.querySelector('script[src*="translate_a/element.js"]')) {
      const script = document.createElement('script');
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: LANGUAGES.map(l => l.code).join(','),
            autoDisplay: false,
          },
          'google_translate_element'
        );
      };
    }
  }, []);

  const handleLanguageChange = (langCode: string, label: string) => {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
      setSelectedLabel(label);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <div className="fixed bottom-0 right-0 pointer-events-none opacity-0">
        <div id="google_translate_element"></div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={variant} 
            size="sm" 
            className={cn("gap-2", className)}
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{selectedLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code, lang.label)}
              className="cursor-pointer"
            >
              {lang.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <style jsx global>{`
        .goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .goog-tooltip {
          display: none !important;
        }
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
          font-size: 0 !important;
        }
      `}</style>
    </>
  );
}
