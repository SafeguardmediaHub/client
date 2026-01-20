'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { CategoryCard } from '@/components/support/CategoryCard';
import { ContactForm } from '@/components/support/ContactForm';
import { FAQSection } from '@/components/support/FAQSection';
import { SupportHero } from '@/components/support/SupportHero';
import { SystemStatus } from '@/components/support/SystemStatus';
import { Button } from '@/components/ui/button';
import { categories, faqs } from '@/lib/support-data';

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [contactFormData, setContactFormData] = useState<{
    category?: string;
    subject?: string;
  }>({});

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    // Scroll to FAQ section
    document
      .getElementById('faq-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickAction = (action: string) => {
    if (action === 'bug') {
      setContactFormData({ category: 'bug', subject: 'Bug Report: ' });
    } else if (action === 'feature') {
      setContactFormData({ category: 'feature', subject: 'Feature Request: ' });
    } else if (action === 'contact') {
      setContactFormData({});
    }
    // Scroll to contact form
    setTimeout(() => {
      document
        .getElementById('contact-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <SupportHero
          onSearch={handleSearch}
          onQuickAction={handleQuickAction}
        />

        {/* Categories Grid */}
        <section>
          <h2
            className="text-2xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategoryClick(category.id)}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq-section">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {selectedCategory
                ? `${categories.find((c) => c.id === selectedCategory)?.name} Articles`
                : 'Frequently Asked Questions'}
            </h2>
            {selectedCategory && (
              <Button
                onClick={handleClearCategory}
                variant="outline"
                className="border-gray-300 rounded-xl"
              >
                <X className="w-4 h-4 mr-2" />
                Show All
              </Button>
            )}
          </div>
          <FAQSection
            faqs={faqs}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
          />
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <section id="contact-section" className="lg:col-span-2">
            <ContactForm
              initialCategory={contactFormData.category}
              initialSubject={contactFormData.subject}
            />
          </section>

          {/* System Status */}
          <section className="lg:col-span-1">
            <SystemStatus />
          </section>
        </div>

        {/* Additional Resources */}
        <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h3
            className="text-xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Additional Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors group text-left"
            >
              <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                API Documentation
              </h4>
              <p className="text-sm text-gray-600">
                Complete API reference and integration guides
              </p>
            </button>
            <button
              type="button"
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors group text-left"
            >
              <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                Video Tutorials
              </h4>
              <p className="text-sm text-gray-600">
                Step-by-step guides for all features
              </p>
            </button>
            <button
              type="button"
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors group text-left"
            >
              <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                Community Forum
              </h4>
              <p className="text-sm text-gray-600">
                Connect with other users and share tips
              </p>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
