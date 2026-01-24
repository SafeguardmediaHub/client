import { FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center max-w-3xl mx-auto">
      <div className="bg-muted/30 p-6 rounded-full mb-8">
        <FileQuestion className="w-16 h-16 text-muted-foreground" />
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
        Page Not Found
      </h1>

      <p className="text-xl text-muted-foreground mb-10 max-w-lg mx-auto">
        Sorry, we couldn't find the page you're looking for. It might have been
        moved, deleted, or never existed.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/blog">Browse Blog</Link>
        </Button>
      </div>
    </div>
  );
}
