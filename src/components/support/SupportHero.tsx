'use client';

import { Bug, Lightbulb, Mail, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SupportHeroProps {
  onSearch: (query: string) => void;
  onQuickAction: (action: string) => void;
}

export function SupportHero({ onSearch, onQuickAction }: SupportHeroProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // Debounce search
    const timer = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  };

  return (
    <div className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 rounded-3xl p-12 mb-8 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          How can we help you today?
        </h1>
        <p className="text-lg text-indigo-100 mb-8">
          Search our knowledge base or get in touch with our support team
        </p>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search for help articles, guides, and FAQs..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 pr-4 h-14 text-base bg-white border-0 rounded-xl shadow-lg focus:ring-2 focus:ring-white/50"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => onQuickAction('bug')}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl backdrop-blur-sm"
          >
            <Bug className="w-4 h-4 mr-2" />
            Report a Bug
          </Button>
          <Button
            onClick={() => onQuickAction('feature')}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl backdrop-blur-sm"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Request Feature
          </Button>
          <Button
            onClick={() => onQuickAction('contact')}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl backdrop-blur-sm"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
