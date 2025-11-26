'use client';

import { ArrowLeft, Award, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  BadgeModal,
  BadgePreview,
  BadgePreviewSkeleton,
} from '@/components/c2pa';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useBadges } from '@/hooks/useC2PA';
import type { C2PABadge } from '@/types/c2pa';

export default function BadgesPage() {
  const router = useRouter();
  const badgesQuery = useBadges();
  const [selectedBadge, setSelectedBadge] = useState<C2PABadge | null>(null);

  const badges = Array.isArray(badgesQuery.data?.data?.badges)
    ? badgesQuery.data.data.badges
    : [];

  const handleBadgeClick = (badge: C2PABadge) => {
    setSelectedBadge(badge);
  };

  const handleCloseModal = () => {
    setSelectedBadge(null);
  };

  return (
    <div className="w-full flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/authenticity')}
        >
          <ArrowLeft className="size-4 mr-1" />
          Back
        </Button>
      </div>

      {/* Title section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <Award className="size-5 text-amber-600" />
          </div>
          <h1 className="text-2xl font-medium text-gray-900">
            Authenticity Badges
          </h1>
        </div>
        <p className="text-sm text-gray-600 mt-2 ml-13">
          Browse the available C2PA authenticity badges and their display rules.
          Click on a badge to view its detailed configuration.
        </p>
      </div>

      {/* Info card */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
        <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-blue-900">
            About C2PA Badges
          </h3>
          <p className="text-sm text-blue-800 mt-1">
            These badges are displayed on verified media to indicate their authenticity status.
            Each badge has specific display rules that determine when and how it appears
            based on the verification result.
          </p>
        </div>
      </div>

      {/* Badge grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Available Badges</h2>

        {badgesQuery.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <BadgePreviewSkeleton />
            <BadgePreviewSkeleton />
            <BadgePreviewSkeleton />
            <BadgePreviewSkeleton />
            <BadgePreviewSkeleton />
            <BadgePreviewSkeleton />
          </div>
        ) : badges.length === 0 ? (
          <div className="p-12 text-center bg-gray-50 rounded-xl border border-gray-200">
            <Award className="size-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No badges available</h3>
            <p className="text-sm text-gray-500 mt-1">
              Badge configurations will appear here once they are set up.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge, index) => (
              <div
                key={badge.id}
                className="animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <BadgePreview
                  badge={badge}
                  onClick={() => handleBadgeClick(badge)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badge categories info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <h4 className="text-sm font-semibold text-emerald-800 mb-2">
            Verified Badges
          </h4>
          <p className="text-xs text-emerald-700">
            Displayed when content passes all authenticity checks including
            valid signatures and intact content integrity.
          </p>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <h4 className="text-sm font-semibold text-red-800 mb-2">
            Warning Badges
          </h4>
          <p className="text-xs text-red-700">
            Shown when tampering is detected or certificate validation fails.
            These indicate potential content manipulation.
          </p>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            Neutral Badges
          </h4>
          <p className="text-xs text-gray-700">
            Used when no C2PA metadata is found. This doesn't indicate
            manipulation, just absence of provenance data.
          </p>
        </div>
      </div>

      {/* Badge modal */}
      <BadgeModal
        badge={selectedBadge}
        isOpen={!!selectedBadge}
        onClose={handleCloseModal}
      />
    </div>
  );
}
