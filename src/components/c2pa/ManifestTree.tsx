'use client';

import {
  AlertTriangle,
  ChevronRight,
  FileImage,
  FileText,
  Layers,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { ManifestNode } from '@/types/c2pa';

interface ManifestTreeProps {
  manifest?: ManifestNode;
  className?: string;
}

const nodeTypeConfig: Record<
  ManifestNode['type'],
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }
> = {
  claim: {
    icon: FileText,
    color: 'text-blue-600',
  },
  assertion: {
    icon: Settings,
    color: 'text-purple-600',
  },
  ingredient: {
    icon: Layers,
    color: 'text-amber-600',
  },
  action: {
    icon: FileImage,
    color: 'text-emerald-600',
  },
};

function ManifestTreeNode({
  node,
  depth = 0,
}: {
  node: ManifestNode;
  depth?: number;
}) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const config = nodeTypeConfig[node.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'animate-in fade-in slide-in-from-left-1',
        depth > 0 && 'ml-4 border-l border-gray-200 pl-4'
      )}
      style={{ animationDelay: `${depth * 30}ms` }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={cn(
            'flex items-center gap-2 py-2 px-3 rounded-lg transition-colors',
            'hover:bg-gray-50',
            node.isTampered && 'bg-red-50 border border-red-200'
          )}
        >
          {hasChildren && (
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="p-0.5 rounded hover:bg-gray-200 transition-colors"
              >
                <ChevronRight
                  className={cn(
                    'size-4 text-gray-400 transition-transform',
                    isOpen && 'rotate-90'
                  )}
                />
              </button>
            </CollapsibleTrigger>
          )}

          {!hasChildren && <span className="w-5" />}

          <Icon className={cn('size-4', config.color)} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 truncate">
                {node.label}
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                {node.type}
              </span>
              {node.isTampered && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                  <AlertTriangle className="size-3" />
                  Tampered
                </span>
              )}
            </div>
            {node.value && (
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {node.value}
              </p>
            )}
          </div>
        </div>

        {hasChildren && (
          <CollapsibleContent>
            <div className="mt-1 space-y-1">
              {node.children?.map((child) => (
                <ManifestTreeNode
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                />
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}

export function ManifestTree({ manifest, className }: ManifestTreeProps) {
  if (!manifest) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <FileText className="size-12 mx-auto text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">No manifest data available</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      <ManifestTreeNode node={manifest} />
    </div>
  );
}

export function ManifestTreeSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2 py-2 px-3 animate-pulse">
          <div className="size-4 bg-gray-200 rounded" />
          <div className="size-4 bg-gray-200 rounded" />
          <div className="flex-1 space-y-1">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-48 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
