'use client';

import { Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { FeaturePreviewModal } from '@/components/feature-preview-modal';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { getFeatureById } from '@/lib/features';
import { cn } from '@/lib/utils';

export function NavDetectionTools({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
    featureId?: string;
  }[];
}) {
  const [previewFeatureId, setPreviewFeatureId] = useState<string | null>(null);

  const handleItemClick = (
    e: React.MouseEvent,
    url: string,
    featureId?: string,
  ) => {
    if (url === '#' && featureId) {
      e.preventDefault();
      setPreviewFeatureId(featureId);
    }
  };

  const previewFeature = previewFeatureId
    ? getFeatureById(previewFeatureId)
    : null;

  return (
    <>
      <SidebarGroup suppressHydrationWarning>
        <SidebarGroupLabel>AI-Detection Tools</SidebarGroupLabel>
        <SidebarMenu>
          {projects.map((item) => {
            const isLocked = item.url === '#';
            const feature = item.featureId
              ? getFeatureById(item.featureId)
              : null;

            return (
              <SidebarMenuItem key={item.name}>
                {isLocked ? (
                  <SidebarMenuButton
                    onClick={(e) =>
                      handleItemClick(e, item.url, item.featureId)
                    }
                    className={cn(
                      'opacity-60 cursor-pointer hover:opacity-80 transition-opacity',
                    )}
                  >
                    <item.icon className="text-primary" />
                    <span>{item.name}</span>
                    <Lock className="ml-auto w-3.5 h-3.5 text-gray-400 shrink-0" />
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="text-primary" />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>

      {previewFeature && (
        <FeaturePreviewModal
          feature={previewFeature}
          isOpen={!!previewFeatureId}
          onClose={() => setPreviewFeatureId(null)}
        />
      )}
    </>
  );
}
