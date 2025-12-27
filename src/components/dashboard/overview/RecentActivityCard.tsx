'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { RecentActivityItem } from '@/types/dashboard';
import {
  getStatusBadge,
  getVerdictColor,
  getVerdictLabel,
} from '@/lib/dashboard-utils';
import { timeAgo } from '@/lib/utils';
import { ChevronDown, FileImage } from 'lucide-react';
import { useState } from 'react';

interface RecentActivityCardProps {
  data: RecentActivityItem[];
  isLoading?: boolean;
}

export function RecentActivityCard({
  data,
  isLoading,
}: RecentActivityCardProps) {
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <Card className="p-6">
        <CardContent className="p-0 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show only first 5 items unless "Show All" is clicked
  const displayedData = showAll ? data : data.slice(0, 5);
  const hasMore = data.length > 5;

  return (
    <Card className="p-6">
      <CardContent className="p-0 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium">Recent Activity</h3>
          {hasMore && (
            <span className="text-sm text-muted-foreground">
              {showAll ? data.length : 5} of {data.length}
            </span>
          )}
        </div>

        <div className="divide-y rounded-xl border">
          {data.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No recent activity
            </div>
          ) : (
            displayedData.map((item) => {
              const statusBadge = getStatusBadge(item.status);
              const verdictColor = item.verdict
                ? getVerdictColor(item.verdict)
                : null;

              return (
                <div
                  key={item.mediaId}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div className="size-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                    <FileImage className="size-5 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold truncate">
                        {item.filename}
                      </h4>
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                      {item.verdict && verdictColor && (
                        <Badge
                          className={`${verdictColor.bg} ${verdictColor.text} ${verdictColor.border}`}
                        >
                          {getVerdictLabel(item.verdict)}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      {item.integrityScore !== undefined && (
                        <>
                          <span>
                            Score: {item.integrityScore.toFixed(1)}%
                          </span>
                          <span className="h-3 w-px bg-border" />
                        </>
                      )}
                      <span>{timeAgo(new Date(item.uploadedAt))}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {hasMore && (
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                Show Less
                <ChevronDown className="ml-2 h-4 w-4 rotate-180" />
              </>
            ) : (
              <>
                Show All ({data.length - 5} more)
                <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
