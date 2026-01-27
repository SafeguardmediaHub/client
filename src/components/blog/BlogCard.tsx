/** biome-ignore-all lint/performance/noImgElement: <> */
/** biome-ignore-all lint/performance/noImgElement: <> */
import { format } from 'date-fns';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { BlogPost, StrapiData } from '@/types/blog';

interface BlogCardProps {
  post: StrapiData<BlogPost>;
}

export function BlogCard({ post }: BlogCardProps) {
  const { title, slug, excerpt, cover_image, author, categories, publishedAt } =
    post;

  const coverUrl = cover_image?.url
    ? cover_image.url.startsWith('http')
      ? cover_image.url
      : `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${cover_image.url}`
    : null;

  const authorName = author?.name || 'Unknown Author';

  return (
    <Link href={`/blog/${slug}`} className="group flex flex-col h-full">
      <div className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-white/5 border border-white/10 transition-all duration-500 hover:border-primary/50 hover:bg-white/10 hover:shadow-[0_0_40px_-10px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-slate-500 bg-slate-900">
              <span className="text-sm font-medium">No Image</span>
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {categories?.slice(0, 2).map((cat) => (
              <Badge
                key={cat.id}
                variant="secondary"
                className="font-medium bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-black/70 px-2.5 py-1"
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-col flex-grow p-6">
          {/* Meta Top */}
          <div className="flex items-center gap-2 mb-4 text-xs font-medium text-slate-400">
            <span className="text-primary">{authorName}</span>
            <span className="w-1 h-1 rounded-full bg-slate-500" />
            <time dateTime={publishedAt}>
              {publishedAt
                ? format(new Date(publishedAt), 'MMM d, yyyy')
                : 'Draft'}
            </time>
          </div>

          <h3 className="text-xl md:text-2xl font-bold tracking-tight leading-tight text-slate-100 mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>

          <p className="text-slate-400 line-clamp-3 text-sm leading-relaxed mb-6 flex-grow">
            {excerpt}
          </p>

          <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
            <div className="flex items-center gap-2 text-sm text-primary font-medium opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              Read Post <span className="text-lg">→</span>
            </div>
            {/* Optional: Add reading time or other meta here */}
          </div>
        </div>
      </div>
    </Link>
  );
}
