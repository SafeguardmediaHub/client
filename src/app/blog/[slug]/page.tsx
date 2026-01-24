import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPostLayout } from '@/components/blog/BlogPostLayout';
import {
  getBlogCategories,
  getBlogPostBySlug,
  getBlogTags,
  getRecentPosts,
} from '@/lib/strapi';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | SafeguardMedia',
    };
  }

  const {
    title,
    excerpt,
    seo_title,
    seo_description,
    meta_image,
    cover_image,
  } = post;
  const metaImage = meta_image?.url || cover_image?.url;
  const imageUrl = metaImage
    ? metaImage.startsWith('http')
      ? metaImage
      : `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${metaImage}`
    : undefined;

  return {
    title: seo_title || title,
    description: seo_description || excerpt,
    openGraph: {
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  // Parallel fetch for post + sidebar data
  const [post, categoriesRes, tagsRes, recentPostsRes] = await Promise.all([
    getBlogPostBySlug(slug),
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
    />
  );
}
