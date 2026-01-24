import { notFound } from 'next/navigation';
import { BlogPostLayout } from '@/components/blog/BlogPostLayout';
import {
  getBlogCategories,
  getBlogTags,
  getPreviewBlogPostBySlug,
  getRecentPosts,
} from '@/lib/strapi';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPreviewPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch using the preview logic + public sidebar data
  const [post, categoriesRes, tagsRes, recentPostsRes] = await Promise.all([
    getPreviewBlogPostBySlug(slug),
    getBlogCategories(),
    getBlogTags(),
    getRecentPosts(3),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <BlogPostLayout
      post={post}
      categories={categoriesRes.data}
      tags={tagsRes.data}
      recentPosts={recentPostsRes.data}
      isPreview={true}
    />
  );
}
