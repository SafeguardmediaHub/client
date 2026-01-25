import type { Metadata } from 'next';
import { BlogBreadcrumbs } from '@/components/blog/BlogBreadcrumbs';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogSidebar } from '@/components/blog/BlogSidebar';
import { FeaturedPost } from '@/components/blog/FeaturedPost';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  getBlogCategories,
  getBlogPosts,
  getBlogTags,
  getFeaturedPosts,
  getRecentPosts,
} from '@/lib/strapi';

export const metadata: Metadata = {
  title: 'Blog | SafeguardMedia',
  description: 'Latest updates and insights from SafeguardMedia.',
};

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; tag?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const pageSize = 10;

  // Parallel fetching for performance
  const [postsRes, categoriesRes, tagsRes, recentPostsRes, featuredPostsRes] =
    await Promise.all([
      getBlogPosts({ page, pageSize }),
      getBlogCategories(),
      getBlogTags(),
      getRecentPosts(3),
      getFeaturedPosts(),
    ]);

  const { data: posts, meta } = postsRes;
  const { pageCount } = meta.pagination;
  const featuredPost = featuredPostsRes.data?.[0]; // Get the first featured post

  // Filter out the featured post from the main list if it exists in the main list
  // This is a client-side filter for now as Strapi filtering can be complex with "not in"
  const filteredPosts = featuredPost
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <BlogBreadcrumbs />

      <div className="max-w-2xl text-center md:text-left mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Latest Insights
        </h1>
        <p className="text-xl text-muted-foreground">
          Explore our latest articles, guides, and news about media security and
          authenticity.
        </p>
      </div>

      {featuredPost && page === 1 && <FeaturedPost post={featuredPost} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-xl">
              <p className="text-muted-foreground">No posts found.</p>
            </div>
          )}

          {pageCount > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={`/blog?page=${page - 1}`} />
                    </PaginationItem>
                  )}

                  {Array.from({ length: pageCount }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href={`/blog?page=${p}`}
                          isActive={page === p}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {page < pageCount && (
                    <PaginationItem>
                      <PaginationNext href={`/blog?page=${page + 1}`} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 order-1 lg:order-2">
          <BlogSidebar
            categories={categoriesRes.data}
            tags={tagsRes.data}
            recentPosts={recentPostsRes.data}
          />
        </aside>
      </div>
    </div>
  );
}
