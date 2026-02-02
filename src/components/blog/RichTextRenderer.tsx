/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils';

// Types for Strapi Blocks
export type BlockNode = {
  type: string;
  children?: BlockNode[];
  level?: number;
  format?: 'unordered' | 'ordered';
  url?: string;
  image?: {
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
  };
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

interface RichTextRendererProps {
  content: BlockNode[] | null;
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  if (!content) return null;

  return (
    <div className="rich-text-content">
      {content.map((block, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Order is stable for static content
        <Block key={index} block={block} />
      ))}
    </div>
  );
}

const Block = ({ block }: { block: BlockNode }) => {
  switch (block.type) {
    case 'heading': {
      // Cast to any to avoid complex JSX.IntrinsicElements namespace issues in some setups
      const HeadingTag = `h${block.level || 1}` as any;
      return (
        <HeadingTag
          className={cn('font-bold tracking-tight text-white mb-4', {
            'text-4xl mt-10': block.level === 1,
            'text-3xl mt-10': block.level === 2,
            'text-2xl mt-8': block.level === 3,
            'text-xl mt-6': block.level === 4,
            'text-lg mt-6': block.level === 5,
            'text-base mt-4': block.level === 6,
          })}
        >
          <SerializeNodes nodes={block.children} />
        </HeadingTag>
      );
    }

    case 'paragraph':
      // Paragraphs with just one empty text node should be treated as line break
      if (block.children?.length === 1 && block.children[0].text === '') {
        return <br className="my-4" />;
      }
      return (
        <p className="my-4 leading-relaxed text-slate-300">
          <SerializeNodes nodes={block.children} />
        </p>
      );

    case 'list': {
      const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag
          className={cn(
            'my-6 ml-6 space-y-2 text-slate-300',
            block.format === 'ordered' ? 'list-decimal' : 'list-disc',
          )}
        >
          {block.children?.map((child, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Static content
            <Block key={i} block={child} />
          ))}
        </ListTag>
      );
    }

    case 'list-item':
      return (
        <li className="pl-2 marker:text-slate-500">
          <SerializeNodes nodes={block.children} />
        </li>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 italic text-slate-400 bg-slate-900/50 rounded-r-lg">
          <SerializeNodes nodes={block.children} />
        </blockquote>
      );

    case 'code':
      return (
        <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto my-6 border border-slate-800 relative group">
          <code className="font-mono text-sm text-slate-200">
            <SerializeNodes nodes={block.children} />
          </code>
        </pre>
      );

    case 'image': {
      if (!block.image?.url) return null;

      const imgUrl = block.image.url.startsWith('http')
        ? block.image.url
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${block.image.url}`;

      return (
        <figure className="my-10">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-muted/20">
            {block.image.width && block.image.height ? (
              <Image
                src={imgUrl}
                alt={block.image.alternativeText || 'Blog Image'}
                width={block.image.width}
                height={block.image.height}
                className="w-full h-auto object-cover"
              />
            ) : (
              // biome-ignore lint/performance/noImgElement: Fallback when dimensions missing
              <img
                src={imgUrl}
                alt={block.image.alternativeText || 'Blog Image'}
                className="w-full h-auto object-cover"
              />
            )}
          </div>
          {block.image.caption && (
            <figcaption className="text-center text-sm text-slate-500 mt-3 italic">
              {block.image.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'link':
      return (
        <Link
          href={block.url || '#'}
          className="text-primary hover:underline underline-offset-4 decoration-primary/50 transition-colors"
          target={block.url?.startsWith('http') ? '_blank' : undefined}
          rel={
            block.url?.startsWith('http') ? 'noopener noreferrer' : undefined
          }
        >
          <SerializeNodes nodes={block.children} />
        </Link>
      );

    default:
      // Fallback for text nodes handled here if they slip through as blocks
      if (
        block.type === 'text' ||
        (!block.type && typeof block.text === 'string')
      ) {
        return <SerializeText node={block} />;
      }
      return null;
  }
};

const SerializeNodes = ({ nodes }: { nodes?: BlockNode[] }) => {
  if (!nodes) return null;
  return (
    <>
      {nodes.map((child, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static content
        <React.Fragment key={i}>
          {child.type === 'text' ||
          (!child.type && typeof child.text === 'string') ? (
            <SerializeText node={child} />
          ) : (
            <Block block={child} />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

const SerializeText = ({ node }: { node: BlockNode }) => {
  let text = <>{node.text}</>;

  if (node.bold) {
    text = <strong className="font-semibold text-white">{text}</strong>;
  }
  if (node.italic) {
    text = <em className="italic text-slate-200">{text}</em>;
  }
  if (node.underline) {
    text = (
      <span className="underline decoration-slate-500 underline-offset-4">
        {text}
      </span>
    );
  }
  if (node.strikethrough) {
    text = <span className="line-through decoration-slate-500">{text}</span>;
  }
  if (node.code) {
    text = (
      <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-primary-foreground border border-slate-700">
        {text}
      </code>
    );
  }

  return text;
};
