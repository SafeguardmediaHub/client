import qs from 'qs';
import type {
  BlogPost,
  Category,
  StrapiData,
  StrapiResponse,
  Tag,
} from '@/types/blog';

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const PREVIEW_SECRET = process.env.STRAPI_PREVIEW_SECRET;

export async function fetchAPI(
  path: string,
  urlParamsObject = {},
  options: RequestInit = {},
) {
  try {
    // Merge default and user options
    const mergedOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject, {
      arrayFormat: 'brackets',
    });
    const requestUrl = `${STRAPI_URL}${path}${queryString ? `?${queryString}` : ''}`;

    // Trigger API call
    console.log(`[Strapi] Fetching: ${requestUrl}`);
    const response = await fetch(requestUrl, mergedOptions);

    if (!response.ok) {
      console.error(
        `[Strapi] Error ${response.status}: ${response.statusText}`,
      );
      const errorData = await response.json().catch(() => ({}));
      console.error('[Strapi] Error Details:', errorData);
      throw new Error(`Failed to fetch API: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(
      `[Strapi] Success: ${response.status} - Fetched ${data?.data?.length ?? 'unknown'} items`,
    );

    return data;
  } catch (error) {
    console.error('[Strapi] Network/Fetch Error:', error);
    throw error;
  }
}

export async function getBlogPosts({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}): Promise<StrapiResponse<StrapiData<BlogPost>[]>> {
  const query = {
    populate: {
      cover_image: { fields: ['url', 'alternativeText', 'width', 'height'] },
      author: { populate: ['avatar'] },
      categories: { fields: ['name', 'slug'] },
      tags: { fields: ['name', 'slug'] },
    },
    sort: ['publishedAt:desc'],
    pagination: {
      page,
      pageSize,
    },
    publicationState: 'live',
  };

  return fetchAPI('/api/blog-posts', query);
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<StrapiData<BlogPost> | null> {
  try {
    const query = {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        content: {
          populate: '*',
        },
        cover_image: {
          fields: ['url', 'alternativeText', 'width', 'height'],
        },
        author: {
          populate: {
            avatar: {
              fields: ['url', 'alternativeText'],
            },
          },
        },
        categories: {
          fields: ['name', 'slug'],
        },
        tags: {
          fields: ['name', 'slug'],
        },
        meta_image: {
          fields: ['url', 'alternativeText'],
        },
      },
      publicationState: 'live',
    };

    const res = await fetchAPI('/api/blog-posts', query);
    return res.data?.[0] || null;
  } catch (error) {
    console.error(`[Strapi] Failed to fetch post by slug "${slug}":`, error);
    // Return null to trigger notFound() in the page instead of crashing
    return null;
  }
}

export async function getPreviewBlogPostBySlug(
  slug: string,
): Promise<StrapiData<BlogPost> | null> {
  if (!PREVIEW_SECRET) {
    console.warn('STRAPI_PREVIEW_SECRET is not set');
  }

  const query = {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      content: { populate: '*' },
      cover_image: '*',
      author: { populate: ['avatar'] },
      categories: '*',
      tags: '*',
      meta_image: '*',
    },
    publicationState: 'preview',
  };

  const res = await fetchAPI('/api/blog-posts', query, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${PREVIEW_SECRET}`,
    },
    cache: 'no-store', // Ensure we always get the latest draft
  });
  return res.data?.[0] || null;
}

export async function getBlogCategories(): Promise<
  StrapiResponse<StrapiData<Category>[]>
> {
  const query = {
    sort: ['name:asc'],
    pagination: {
      pageSize: 100,
    },
  };
  return fetchAPI('/api/categories', query);
}

export async function getBlogTags(): Promise<
  StrapiResponse<StrapiData<Tag>[]>
> {
  const query = {
    sort: ['name:asc'],
    pagination: {
      pageSize: 100,
    },
  };
  return fetchAPI('/api/tags', query);
}

export async function getRecentPosts(
  limit = 5,
): Promise<StrapiResponse<StrapiData<BlogPost>[]>> {
  const query = {
    populate: {
      cover_image: { fields: ['url', 'alternativeText'] },
      author: { populate: ['avatar'] },
      categories: { fields: ['name', 'slug'] },
    },
    sort: ['publishedAt:desc'],
    pagination: {
      page: 1,
      pageSize: limit,
    },
    publicationState: 'live',
  };

  return fetchAPI('/api/blog-posts', query);
}

export async function getFeaturedPosts(): Promise<
  StrapiResponse<StrapiData<BlogPost>[]>
> {
  const query = {
    filters: {
      featured: {
        $eq: true,
      },
    },
    populate: {
      cover_image: { fields: ['url', 'alternativeText', 'width', 'height'] },
      author: { populate: ['avatar'] },
      categories: { fields: ['name', 'slug'] },
      tags: { fields: ['name', 'slug'] },
    },
    sort: ['publishedAt:desc'],
    pagination: {
      page: 1,
      pageSize: 1, // Only need the top one for Hero
    },
    publicationState: 'live',
  };

  return fetchAPI('/api/blog-posts', query);
}
