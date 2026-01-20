'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/lib/support-data';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
  index: number;
}

export function CategoryCard({ category, onClick, index }: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="group relative bg-white border border-gray-200 rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-all w-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-3 rounded-xl transition-colors"
          style={{ backgroundColor: `${category.color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color: category.color }} />
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
      </div>

      <h3
        className="text-lg font-bold text-gray-900 mb-2"
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        {category.name}
      </h3>
      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
      <p className="text-xs font-medium text-gray-500">
        {category.articleCount} articles
      </p>
    </motion.button>
  );
}
