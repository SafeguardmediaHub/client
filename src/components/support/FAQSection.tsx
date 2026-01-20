'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import type { FAQItem } from '@/lib/support-data';

interface FAQSectionProps {
  faqs: FAQItem[];
  searchQuery: string;
  selectedCategory: string | null;
}

export function FAQSection({
  faqs,
  searchQuery,
  selectedCategory,
}: FAQSectionProps) {
  const [feedback, setFeedback] = useState<
    Record<string, 'helpful' | 'not-helpful' | null>
  >({});

  // Filter FAQs based on search and category
  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      !selectedCategory || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleFeedback = (faqId: string, type: 'helpful' | 'not-helpful') => {
    setFeedback((prev) => ({ ...prev, [faqId]: type }));
    // TODO: Send feedback to analytics
  };

  if (filteredFAQs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-2">No articles found</p>
        <p className="text-sm text-gray-500">
          Try adjusting your search or browse by category
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600">
          {filteredFAQs.length}{' '}
          {filteredFAQs.length === 1 ? 'article' : 'articles'} found
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {filteredFAQs.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="bg-white border border-gray-200 rounded-xl px-6 shadow-sm"
          >
            <AccordionTrigger className="hover:no-underline py-5">
              <span className="text-left font-semibold text-gray-900">
                {faq.question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>

              {/* Feedback */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-600">Was this helpful?</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFeedback(faq.id, 'helpful')}
                    className={`rounded-lg ${
                      feedback[faq.id] === 'helpful'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'border-gray-300'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFeedback(faq.id, 'not-helpful')}
                    className={`rounded-lg ${
                      feedback[faq.id] === 'not-helpful'
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'border-gray-300'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
