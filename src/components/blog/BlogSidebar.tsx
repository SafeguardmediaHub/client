/** biome-ignore-all lint/performance/noImgElement: <> */

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <aside className="space-y-8 sticky top-24">
      {/* Categories */}
      <Card className="shadow-sm border-muted/60">
        <CardHeader className="pb-3 border-b border-muted/40">
          <CardTitle className="text-lg font-bold tracking-tight">
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid gap-2">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className="flex items-center justify-between group py-1"
              >
                <span className="text-muted-foreground group-hover:text-primary transition-colors text-sm font-medium">
                  {cat.name}
                </span>
                {/* Optional: Add count if available from API in future */}
                {/* <span className="text-xs text-muted-foreground/50">12</span> */}
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No categories found.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card className="shadow-sm border-muted/60">
        <CardHeader className="pb-3 border-b border-muted/40">
          <CardTitle className="text-lg font-bold tracking-tight">
            Recent Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid gap-4">
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
                    <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden bg-muted">
                      <img
                        src={coverUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No recent posts.</p>
          )}
        </CardContent>
      </Card>

      {/* Tags Cloud */}
      <Card className="shadow-sm border-muted/60">
        <CardHeader className="pb-3 border-b border-muted/40">
          <CardTitle className="text-lg font-bold tracking-tight">
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                <Badge
                  variant="secondary"
                  className="hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer font-normal"
                >
                  #{tag.name}
                </Badge>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No tags found.</p>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
