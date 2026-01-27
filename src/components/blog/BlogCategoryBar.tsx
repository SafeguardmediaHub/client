'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Category, StrapiData } from '@/types/blog';

interface BlogCategoryBarProps {
  categories: StrapiData<Category>[];
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export function BlogCategoryBar({ categories }: BlogCategoryBarProps) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <motion.div
      className="sticky top-[80px] z-40 w-full border-b border-white/5 bg-slate-950/70 backdrop-blur-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          className="flex items-center gap-3 overflow-x-auto py-4 no-scrollbar mask-gradient-x"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Link
              href="/blog"
              className={cn(
                'relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border',
                !currentCategory
                  ? 'bg-white/10 text-white border-white/20 shadow-[0_0_15px_-3px_rgba(255,255,255,0.2)]'
                  : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5',
              )}
            >
              All Posts
              {!currentCategory && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 rounded-full border border-white/20"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          </motion.div>

          {categories.map((cat) => {
            const isActive = currentCategory === cat.slug;
            return (
              <motion.div key={cat.id} variants={itemVariants}>
                <Link
                  href={`/blog?category=${cat.slug}`}
                  className={cn(
                    'relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border whitespace-nowrap',
                    isActive
                      ? 'bg-primary/20 text-primary border-primary/30 shadow-[0_0_15px_-3px_rgba(var(--primary-rgb),0.3)]'
                      : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5',
                  )}
                >
                  {cat.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 rounded-full border border-primary/30"
                      transition={{
                        type: 'spring',
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
