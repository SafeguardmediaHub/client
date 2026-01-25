/** biome-ignore-all lint/performance/noImgElement: <> */
import { format } from 'date-fns';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
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
  const authorAvatarUrl = author?.avatar?.url
    ? author.avatar.url.startsWith('http')
      ? author.avatar.url
      : `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${author.avatar.url}`
    : null;

  return (
    <Link href={`/blog/${slug}`} className="group flex flex-col h-full">
      <Card className="h-full flex flex-col overflow-hidden border-border/40 bg-card transition-all duration-300 hover:shadow-xl hover:border-primary/20 group-hover:-translate-y-1">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground bg-secondary/30">
              <span className="text-sm font-medium">No Image</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {categories?.slice(0, 2).map((cat) => (
              <Badge
                key={cat.id}
                variant="secondary"
                className="font-medium bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 text-[10px] px-2 py-0.5 h-auto"
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>

        <CardHeader className="p-5 pb-2 space-y-2">
          <h3 className="text-xl font-bold tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{authorName}</span>
            <span>•</span>
            <time dateTime={publishedAt}>
              {publishedAt
                ? format(new Date(publishedAt), 'MMM d, yyyy')
                : 'Draft'}
            </time>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-2 flex-grow">
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {excerpt}
          </p>
        </CardContent>

        <CardFooter className="p-5 pt-0 mt-auto flex items-center justify-between border-t border-border/40 pt-4">
          {/* Author Avatar small */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={authorAvatarUrl || ''} alt={authorName} />
              <AvatarFallback className="text-[10px]">
                {authorName[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Read Article
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
