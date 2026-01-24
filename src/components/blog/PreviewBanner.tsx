import { Eye } from 'lucide-react';

export function PreviewBanner() {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-500 px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
      <Eye className="w-4 h-4" />
      <span>Preview Mode: You are viewing unpublished draft content.</span>
    </div>
  );
}
