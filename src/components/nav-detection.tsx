"use client";

import type { LucideIcon } from "lucide-react";
import { Lock } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FeaturePreviewModal } from "@/components/feature-preview-modal";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getFeatureById } from "@/lib/features";
import { cn } from "@/lib/utils";

export function NavDetectionTools({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
    featureId?: string;
    disabled?: boolean;
    disabledReason?: string;
  }[];
}) {
  const [previewFeatureId, setPreviewFeatureId] = useState<string | null>(null);
  const pathname = usePathname();

  const handleItemClick = (
    e: React.MouseEvent,
    url: string,
    featureId?: string,
  ) => {
    if (url === "#" && featureId) {
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
        <SidebarGroupLabel>Detection</SidebarGroupLabel>
        <SidebarMenu>
          {projects.map((item) => {
            const isLocked = item.url === "#" || item.disabled;
            // const feature = item.featureId
            //   ? getFeatureById(item.featureId)
            //   : null;

            return (
              <SidebarMenuItem key={item.name}>
                {isLocked ? (
                  <SidebarMenuButton
                    onClick={(e) =>
                      handleItemClick(e, item.url, item.featureId)
                    }
                    title={item.disabledReason || undefined}
                    className={cn(
                      "opacity-60 cursor-pointer hover:opacity-80 transition-opacity",
                    )}
                  >
                    <item.icon className="text-primary" />
                    <span>{item.name}</span>
                    {item.disabledReason ? (
                      <span className="ml-auto hidden items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 xl:inline-flex">
                        {item.disabledReason}
                      </span>
                    ) : null}
                    <Lock className="ml-auto w-3.5 h-3.5 text-gray-400 shrink-0" />
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
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
