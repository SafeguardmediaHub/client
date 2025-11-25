'use client';

import { ChevronRight, Copy, Check, Code2 } from 'lucide-react';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MetadataViewerProps {
  data?: Record<string, unknown>;
  className?: string;
  initiallyExpanded?: boolean;
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function JsonNode({
  name,
  value,
  depth = 0,
}: {
  name: string;
  value: JsonValue;
  depth?: number;
}) {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const isObject = typeof value === 'object' && value !== null;
  const isArray = Array.isArray(value);

  const getValueDisplay = () => {
    if (value === null) return <span className="text-gray-400">null</span>;
    if (typeof value === 'boolean') {
      return (
        <span className={value ? 'text-emerald-600' : 'text-red-600'}>
          {value.toString()}
        </span>
      );
    }
    if (typeof value === 'number') {
      return <span className="text-amber-600">{value}</span>;
    }
    if (typeof value === 'string') {
      return <span className="text-emerald-600">"{value}"</span>;
    }
    return null;
  };

  if (!isObject) {
    return (
      <div
        className="flex items-center py-1 px-2 hover:bg-gray-50 rounded text-sm font-mono"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <span className="text-blue-600">{name}</span>
        <span className="text-gray-400 mx-1">:</span>
        {getValueDisplay()}
      </div>
    );
  }

  const entries = isArray
    ? (value as JsonValue[]).map((v, i) => [i.toString(), v])
    : Object.entries(value as Record<string, JsonValue>);
  const count = entries.length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center w-full py-1 px-2 hover:bg-gray-50 rounded text-sm font-mono text-left',
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          <ChevronRight
            className={cn(
              'size-3 mr-1 text-gray-400 transition-transform',
              isOpen && 'rotate-90'
            )}
          />
          <span className="text-blue-600">{name}</span>
          <span className="text-gray-400 mx-1">:</span>
          <span className="text-gray-400">
            {isArray ? `[${count}]` : `{${count}}`}
          </span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {entries.map(([key, val]) => (
          <JsonNode
            key={String(key)}
            name={String(key)}
            value={val as JsonValue}
            depth={depth + 1}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function MetadataViewer({
  data,
  className,
  initiallyExpanded = false,
}: MetadataViewerProps) {
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const handleCopy = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <Code2 className="size-12 mx-auto text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">No metadata available</p>
      </div>
    );
  }

  return (
    <div className={cn('', className)}>
      {/* Header with actions */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
        <span className="text-sm font-medium text-gray-600">Raw Metadata</span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRaw(!showRaw)}
            className="h-7 text-xs"
          >
            <Code2 className="size-3 mr-1" />
            {showRaw ? 'Tree View' : 'Raw JSON'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 text-xs"
          >
            {copied ? (
              <>
                <Check className="size-3 mr-1 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="size-3 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="border border-t-0 rounded-b-lg overflow-hidden">
        {showRaw ? (
          <pre className="p-4 text-xs font-mono text-gray-700 bg-gray-50 overflow-x-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <div className="p-2 max-h-96 overflow-y-auto">
            {Object.entries(data).map(([key, value]) => (
              <JsonNode key={key} name={key} value={value as JsonValue} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function MetadataViewerSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('border rounded-lg', className)}>
      <div className="flex items-center justify-between p-3 border-b bg-gray-50 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="flex gap-2">
          <div className="h-7 w-20 bg-gray-200 rounded" />
          <div className="h-7 w-16 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="p-4 space-y-2 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 bg-gray-100 rounded" style={{ width: `${60 + Math.random() * 30}%` }} />
        ))}
      </div>
    </div>
  );
}
