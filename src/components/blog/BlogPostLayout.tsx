/** biome-ignore-all lint/performance/noImgElement: <> */

import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { BlogPost, Category, StrapiData, Tag } from '@/types/blog';
import { BlockRenderer } from './BlockRenderer';
import { BlogBreadcrumbs } from './BlogBreadcrumbs';
import { BlogSidebar } from './BlogSidebar';
import { PreviewBanner } from './PreviewBanner';
import { ShareButtons } from './ShareButtons';

interface BlogPostLayoutProps {
  post: StrapiData<BlogPost>;
  categories: StrapiData<Category>[];
  tags: StrapiData<Tag>[];
  recentPosts: StrapiData<BlogPost>[];
  isPreview?: boolean;
}

export function BlogPostLayout({
  post,
  categories,
  tags,
  recentPosts,
  isPreview = false,
}: BlogPostLayoutProps) {
  const {
    title,
    slug,
    content,
    cover_image,
    author,
    categories: postCategories,
    tags: postTags,
    publishedAt,
    reading_time,
    updatedAt,
  } = post;

  const coverUrl = cover_image?.url
    ? cover_image.url.startsWith('http')
      ? cover_image.url
      : `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${cover_image.url}`
    : null;

  const authorName = author?.name || 'Unknown Author';
  const authorBio = author?.bio;
  const authorAvatarUrl = author?.avatar?.url
    ? author.avatar.url.startsWith('http')
      ? author.avatar.url
      : `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${author.avatar.url}`
    : null;

  const primaryCategory = postCategories?.[0];

  return (
    <article className="min-h-screen bg-background pb-20">
      {isPreview && <PreviewBanner />}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <BlogBreadcrumbs category={primaryCategory} title={title} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            {/* Header */}
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {postCategories?.map((cat) => (
                  <Badge key={cat.id} variant="secondary">
                    {cat.name}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
                {title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-6 border-b pb-8 mb-8">
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10 border-2 border-background">
                      <AvatarImage
                        src={authorAvatarUrl || ''}
                        alt={authorName}
                      />
                      <AvatarFallback>{authorName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">
                      {authorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={publishedAt || updatedAt}>
                      {publishedAt
                        ? format(new Date(publishedAt), 'MMMM d, yyyy')
                        : 'Draft'}
                    </time>
                  </div>
                  {reading_time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{reading_time} min read</span>
                    </div>
                  )}
                </div>

                <ShareButtons title={title} slug={slug} />
              </div>
            </header>

            {/* Cover Image */}
            {coverUrl && (
              <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm mb-10 bg-muted border border-muted/60">
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Body */}
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-lg">
              <BlockRenderer blocks={content || []} />
            </div>

            {/* Footer Tags & Bio */}
            <footer className="mt-12 pt-8 border-t">
              {postTags && postTags.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {postTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="text-muted-foreground hover:bg-muted font-normal"
                      >
                        #{tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {authorBio && (
                <div className="bg-muted/30 p-8 rounded-xl flex flex-col sm:flex-row gap-6 items-start border border-muted/60">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={authorAvatarUrl || ''} alt={authorName} />
                    <AvatarFallback>{authorName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      About {authorName}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {authorBio}
                    </p>
                  </div>
                </div>
              )}
            </footer>
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-8">
            <BlogSidebar
              categories={categories}
              tags={tags}
              recentPosts={recentPosts}
            />
          </aside>
        </div>
      </div>
    </article>
  );
}
