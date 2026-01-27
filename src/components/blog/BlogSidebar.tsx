/** biome-ignore-all lint/performance/noImgElement: <> */

/** biome-ignore-all lint/performance/noImgElement: <> */
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

import type { BlogPost, Category, StrapiData, Tag } from '@/types/blog';

interface BlogSidebarProps {
  categories: StrapiData<Category>[];
  tags: StrapiData<Tag>[];
  recentPosts: StrapiData<BlogPost>[];
}

export function BlogSidebar({
  categories,
  tags,
  recentPosts,
}: BlogSidebarProps) {
  return (
    <aside className="space-y-8 sticky top-32">
      {/* Categories */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold tracking-tight text-white mb-4 pb-2 border-b border-white/10">
          Categories
        </h3>
        <div className="grid gap-2">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className="flex items-center justify-between group py-1"
              >
                <span className="text-slate-400 group-hover:text-primary transition-colors text-sm font-medium">
                  {cat.name}
                </span>
                <span className="text-slate-600 group-hover:text-primary/50 text-xs">
                  →
                </span>
              </Link>
            ))
          ) : (
            <p className="text-sm text-slate-500">No categories found.</p>
          )}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold tracking-tight text-white mb-4 pb-2 border-b border-white/10">
          Recent Posts
        </h3>
        <div className="grid gap-4">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => {
              const coverUrl = post.cover_image?.url
                ? post.cover_image.url.startsWith('http')
                  ? post.cover_image.url
                  : `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${post.cover_image.url}`
                : null;

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-3 items-start"
                >
                  {coverUrl && (
                    <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden bg-slate-800 ring-1 ring-white/10 group-hover:ring-primary/50 transition-all">
                      <img
                        src={coverUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-tight text-slate-200 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-sm text-slate-500">No recent posts.</p>
          )}
        </div>
      </div>

      {/* Tags Cloud */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold tracking-tight text-white mb-4 pb-2 border-b border-white/10">
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                <Badge
                  variant="outline"
                  className="border-white/20 text-slate-300 hover:bg-primary hover:text-black transition-all cursor-pointer font-normal"
                >
                  #{tag.name}
                </Badge>
              </Link>
            ))
          ) : (
            <p className="text-sm text-slate-500">No tags found.</p>
          )}
        </div>
      </div>
    </aside>
  );
}
