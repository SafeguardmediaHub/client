/** biome-ignore-all lint/performance/noImgElement: <> */
import { format } from 'date-fns';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BlogPost, StrapiData } from '@/types/blog';

interface FeaturedPostProps {
  post: StrapiData<BlogPost>;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const { title, slug, excerpt, cover_image, author, categories, publishedAt } =
    post;

  const coverUrl = cover_image?.url
    ? cover_image.url.startsWith('http')
      ? cover_image.url
      : `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${cover_image.url}`
    : null;

  const authorName = author?.name || 'Unknown Author';

  return (
    <section className="relative w-full min-h-[85vh] flex items-end overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-[2s] ease-in-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-500">
            No Image
          </div>
        )}

        {/* Cinematic Gradient Overlay - crucial for blending into the dark page */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-transparent opacity-80" />
      </div>

      {/* Content Container */}
      <div className="container relative z-10 mx-auto px-4 max-w-7xl pb-24 lg:pb-32">
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge
              variant="default"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1 text-sm font-semibold tracking-wide uppercase"
            >
              Featured Story
            </Badge>
            {categories?.slice(0, 2).map((cat) => (
              <Badge
                key={cat.id}
                variant="outline"
                className="border-white/30 text-white bg-white/10 backdrop-blur-sm px-4 py-1 text-sm tracking-wide uppercase"
              >
                {cat.name}
              </Badge>
            ))}
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 leading-[1.1] text-white drop-shadow-xl">
            <Link
              href={`/blog/${slug}`}
              className="hover:text-primary transition-colors duration-300"
            >
              {title}
            </Link>
          </h2>

          <p className="text-lg md:text-2xl text-slate-200 mb-8 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-3xl drop-shadow-md">
            {excerpt}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 pt-4 border-t border-white/20 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden ring-2 ring-white/50">
                {/* Author Avatar placeholder or image if available could go here */}
                <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-bold">
                  <User className="h-5 w-5 md:h-6 md:w-6" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-slate-400 uppercase tracking-wider font-semibold">
                  Written by
                </span>
                <span className="text-base md:text-lg font-medium text-white">
                  {authorName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <Calendar className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-slate-400 uppercase tracking-wider font-semibold">
                  Published
                </span>
                <time
                  dateTime={publishedAt}
                  className="text-base md:text-lg font-medium text-white"
                >
                  {publishedAt
                    ? format(new Date(publishedAt), 'MMM d, yyyy')
                    : 'Draft'}
                </time>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="mt-6 sm:mt-0 ml-auto bg-white/10 hover:bg-white text-white hover:text-black border border-white/30 hover:border-white transition-all backdrop-blur-sm rounded-full px-8 h-12 md:h-14 text-base md:text-lg"
            >
              <Link href={`/blog/${slug}`}>
                Read Article <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
