export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export type StrapiData<T> = T & {
  id: number;
  documentId: string;
};

export interface ImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface Image {
  id: number;
  documentId: string;
  url: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: {
    thumbnail: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    large: ImageFormat;
  };
}

export interface Author {
  name: string;
  bio?: string;
  avatar?: Image;
}

export interface Category {
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  name: string;
  slug: string;
}

// Dynamic Zone Blocks
export type BlockType =
  | 'shared.rich-text'
  | 'shared.image'
  | 'shared.quote'
  | 'shared.callout'
  | 'shared.embed'
  | 'shared.code-block';

export interface RichTextBlock {
  __component: 'shared.rich-text';
  body: string; // Changed from text to body based on user JSON
}

export interface ImageBlock {
  __component: 'shared.image';
  image: Image;
  caption?: string;
  alt_text?: string;
}

export interface QuoteBlock {
  __component: 'shared.quote';
  text: string;
  author?: string;
}

export interface CalloutBlock {
  __component: 'shared.callout';
  message: string;
  type?: 'info' | 'warning' | 'tip';
}

export interface EmbedBlock {
  __component: 'shared.embed';
  url: string;
  type: 'video' | 'social';
  caption?: string;
}

export interface CodeBlock {
  __component: 'shared.code-block';
  code: string;
  language?: string;
}

export type ContentBlock =
  | RichTextBlock
  | ImageBlock
  | QuoteBlock
  | CalloutBlock
  | EmbedBlock
  | CodeBlock;

export interface BlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  content: ContentBlock[];
  cover_image?: Image;
  author?: StrapiData<Author>;
  categories?: StrapiData<Category>[];
  tags?: StrapiData<Tag>[];
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  meta_image?: Image;
  reading_time?: number;
  featured?: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
