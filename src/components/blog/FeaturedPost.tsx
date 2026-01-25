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
    <section className="mb-16">
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card shadow-xl">
        <div className="grid md:grid-cols-12 gap-0">
          {/* Image Side */}
          <div className="md:col-span-7 lg:col-span-8 relative min-h-[300px] md:min-h-[450px]">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                No Image
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-card/20 md:via-card/5" />
          </div>

          {/* Content Side */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-center p-8 md:p-10 relative bg-card/95 backdrop-blur-sm md:bg-card">
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge
                variant="default"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Featured
              </Badge>
              {categories?.slice(0, 2).map((cat) => (
                <Badge
                  key={cat.id}
                  variant="outline"
                  className="border-primary/20 text-primary bg-primary/5"
                >
                  {cat.name}
                </Badge>
              ))}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
              <Link
                href={`/blog/${slug}`}
                className="hover:text-primary transition-colors"
              >
                {title}
              </Link>
            </h2>

            <p className="text-muted-foreground mb-6 line-clamp-3 text-lg leading-relaxed">
              {excerpt}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={publishedAt}>
                  {publishedAt
                    ? format(new Date(publishedAt), 'MMM d, yyyy')
                    : 'Draft'}
                </time>
              </div>
            </div>

            <div className="mt-auto">
              <Button
                asChild
                size="lg"
                className="w-full md:w-auto font-semibold shadow-lg shadow-primary/20"
              >
                <Link href={`/blog/${slug}`}>
                  Read Article <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
