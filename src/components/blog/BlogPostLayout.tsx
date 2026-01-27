/** biome-ignore-all lint/performance/noImgElement: <> */
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { BlogPost, Category, StrapiData, Tag } from '@/types/blog';
import { BlockRenderer } from './BlockRenderer';
import { PreviewBanner } from './PreviewBanner';
import { ScrollProgress } from './ScrollProgress';
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

  return (
    <article className="min-h-screen bg-slate-950 text-slate-200 pb-20 selection:bg-primary/30 selection:text-primary-foreground">
      <ScrollProgress />
      {isPreview && <PreviewBanner />}

      {/* Immersive Hero Header */}
      <div className="relative w-full h-[60vh] min-h-[500px] flex items-end">
        {/* Background Image */}
        <div className="absolute inset-0">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-900" />
          )}
          {/* Cinematic Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto px-4 max-w-4xl pb-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          <div className="flex flex-wrap gap-2 mb-6">
            {postCategories?.map((cat) => (
              <Badge
                key={cat.id}
                variant="outline"
                className="border-white/30 text-white bg-white/10 backdrop-blur-sm px-3 py-1 text-xs tracking-wide uppercase"
              >
                {cat.name}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-xl">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm md:text-base font-medium">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-white/20">
                <AvatarImage src={authorAvatarUrl || ''} alt={authorName} />
                <AvatarFallback className="bg-slate-800 text-slate-200">
                  {authorName[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-white">{authorName}</span>
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
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-8 relative z-20">
        <div className="grid grid-cols-1 gap-12">
          {/* Main Content Column */}
          <div className="w-full">
            {/* Body - Prose Invert for Dark Mode */}
            <div
              className="prose prose-lg prose-invert max-w-none 
              prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight 
              prose-p:text-slate-300 prose-p:leading-8 
              prose-strong:text-white prose-strong:font-semibold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-primary prose-blockquote:text-slate-400 prose-blockquote:italic
              prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded
              prose-img:rounded-xl prose-img:shadow-2xl prose-img:border prose-img:border-white/10"
            >
              <BlockRenderer blocks={content || []} />
            </div>

            {/* Footer Tags & Bio */}
            <footer className="mt-16 pt-10 border-t border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                <div className="flex flex-wrap gap-2">
                  {postTags?.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 font-normal px-3 py-1 cursor-pointer transition-colors"
                    >
                      #{tag.name}
                    </Badge>
                  ))}
                </div>
                <ShareButtons title={title} slug={slug} />
              </div>

              {authorBio && (
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm flex flex-col sm:flex-row gap-6 items-start transition-all hover:bg-white/10">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                    <AvatarImage src={authorAvatarUrl || ''} alt={authorName} />
                    <AvatarFallback className="bg-slate-800 text-slate-200">
                      {authorName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg text-white mb-2">
                      About {authorName}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {authorBio}
                    </p>
                  </div>
                </div>
              )}
            </footer>
          </div>
        </div>
      </div>
    </article>
  );
}
