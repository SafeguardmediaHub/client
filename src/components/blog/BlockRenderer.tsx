/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <> */
/** biome-ignore-all lint/performance/noImgElement: <> */

import { AlertTriangle, Info, Lightbulb, Quote } from 'lucide-react';
import type { ContentBlock } from '@/types/blog';

interface BlockRendererProps {
  blocks: ContentBlock[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-8">
      {blocks.map((block, index) => {
        switch (block.__component) {
          case 'shared.rich-text':
            return (
              <div
                key={index}
                className="prose prose-lg dark:prose-invert mx-auto leading-relaxed my-8"
              >
                <div dangerouslySetInnerHTML={{ __html: block.body }} />
              </div>
            );

          case 'shared.image': {
            const imgUrl = block.image?.url
              ? block.image.url.startsWith('http')
                ? block.image.url
                : `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${block.image.url}`
              : null;
            if (!imgUrl) return null;

            return (
              <figure key={index} className="my-12 max-w-4xl mx-auto">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border/50 bg-muted/20">
                  <img
                    src={imgUrl}
                    alt={block.alt_text || block.caption || 'Blog image'}
                    className="w-full h-auto object-cover"
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-4 text-center text-sm text-muted-foreground italic tracking-wide">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          case 'shared.quote':
            return (
              <div key={index} className="max-w-3xl mx-auto my-14">
                <blockquote className="border-l-4 border-primary/80 pl-8 py-2 italic text-2xl font-serif text-foreground/90 relative">
                  {/* Decorative quote mark */}
                  <Quote className="absolute -top-6 -left-4 h-8 w-8 text-primary/20 -z-10" />
                  <p className="leading-snug">"{block.text}"</p>
                  {block.author && (
                    <footer className="mt-4 text-sm not-italic font-sans font-semibold text-primary tracking-wider uppercase">
                      — {block.author}
                    </footer>
                  )}
                </blockquote>
              </div>
            );

          case 'shared.callout': {
            const calloutIcons = {
              info: (
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
              ),
              warning: (
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-1" />
              ),
              tip: (
                <Lightbulb className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-1" />
              ),
            };
            const type = (block.type as keyof typeof calloutIcons) || 'info';

            // Modern Callout Styles
            const styles = {
              info: 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900',
              warning:
                'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900',
              tip: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900',
            };

            return (
              <div
                key={index}
                className={`max-w-3xl mx-auto my-10 p-6 rounded-xl border flex items-start gap-4 ${styles[type]}`}
              >
                <div className="shrink-0">{calloutIcons[type]}</div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: block.message }} />
                </div>
              </div>
            );
          }

          case 'shared.embed':
            return (
              <div key={index} className="max-w-4xl mx-auto my-12">
                <div className="aspect-video w-full bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-border/50">
                  {block.url.includes('youtube') ||
                  block.url.includes('youtu.be') ? (
                    <iframe
                      src={block.url
                        .replace('watch?v=', 'embed/')
                        .replace('youtu.be/', 'youtube.com/embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      title="Video embed"
                    />
                  ) : (
                    <a
                      href={block.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-3 hover:opacity-80 transition-opacity p-8"
                    >
                      <span className="font-semibold text-lg">
                        View Embedded Content
                      </span>
                      <span className="text-sm text-muted-foreground underline decoration-primary/50 underline-offset-4">
                        {block.url}
                      </span>
                    </a>
                  )}
                </div>
                {block.caption && (
                  <p className="mt-4 text-center text-sm text-muted-foreground italic tracking-wide">
                    {block.caption}
                  </p>
                )}
              </div>
            );

          case 'shared.code-block':
            return (
              <div key={index} className="max-w-[70ch] mx-auto my-10">
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-xl border border-white/10">
                  <div className="flex justify-between items-center px-4 py-2 bg-white/5 border-b border-white/5">
                    <span className="text-xs text-slate-400 font-mono">
                      {block.language || 'text'}
                    </span>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    </div>
                  </div>
                  <pre className="p-6 overflow-x-auto">
                    <code className="font-mono text-sm text-slate-200">
                      {block.code}
                    </code>
                  </pre>
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
