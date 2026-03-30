"use client";

import { ChevronRight, Lock, type LucideIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import type * as React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FeaturePreviewModal } from "@/components/feature-preview-modal";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { getFeatureById } from "@/lib/features";
import { cn } from "@/lib/utils";

type FeatureSubItem = {
  title: string;
  url: string;
  featureId?: string;
  disabled?: boolean;
  disabledReason?: string;
  disabledMessage?: string;
  activePrefixes?: string[];
};

type FeatureSection = {
  title: string;
  icon: LucideIcon;
  activePrefixes?: string[];
  items: FeatureSubItem[];
};

function matchesUrl(
  pathname: string,
  searchParams: ReturnType<typeof useSearchParams>,
  url: string,
) {
  if (url === "#") {
    return false;
  }

  const parsed = new URL(url, "http://localhost");

  if (pathname !== parsed.pathname) {
    return false;
  }

  return Array.from(parsed.searchParams.entries()).every(
    ([key, value]) => searchParams.get(key) === value,
  );
}

export function NavFeatureSections({
  label = "Features",
  sections,
}: {
  label?: string;
  sections: FeatureSection[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [previewFeatureId, setPreviewFeatureId] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const previewFeature = previewFeatureId
    ? getFeatureById(previewFeatureId)
    : null;

  const sectionStates = useMemo(
    () =>
      sections.map((section) => {
        const hasActiveChild = section.items.some((item) => {
          if (
            item.activePrefixes?.some((prefix) => pathname.startsWith(prefix))
          ) {
            return true;
          }

          return matchesUrl(pathname, searchParams, item.url);
        });

        const isSectionActive =
          hasActiveChild ||
          section.activePrefixes?.some((prefix) =>
            pathname.startsWith(prefix),
          ) ||
          false;

        return {
          ...section,
          hasActiveChild,
          isSectionActive,
        };
      }),
    [pathname, searchParams, sections],
  );

  const handleLockedItemClick = (
    event: React.MouseEvent,
    item: FeatureSubItem,
  ) => {
    if (item.disabledMessage) {
      event.preventDefault();
      toast(item.disabledMessage, { duration: 3500 });
      return;
    }

    if (item.url === "#" && item.featureId) {
      event.preventDefault();
      setPreviewFeatureId(item.featureId);
    }
  };

  return (
    <>
      <SidebarGroup suppressHydrationWarning>
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
        <SidebarMenu>
          {sectionStates.map((section) => (
            <Collapsible
              key={section.title}
              asChild
              open={section.isSectionActive || !!openSections[section.title]}
              onOpenChange={(open) =>
                setOpenSections((current) => ({
                  ...current,
                  [section.title]: open,
                }))
              }
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={section.isSectionActive}
                    tooltip={section.title}
                  >
                    <section.icon className="text-primary" />
                    <span>{section.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {section.items.map((item) => {
                      const isActive =
                        item.activePrefixes?.some((prefix) =>
                          pathname.startsWith(prefix),
                        ) || matchesUrl(pathname, searchParams, item.url);

                      const isLocked = item.url === "#" || item.disabled;

                      return (
                        <SidebarMenuSubItem key={item.title}>
                          {isLocked ? (
                            <SidebarMenuSubButton
                              isActive={isActive}
                              title={item.disabledReason || undefined}
                              onClick={(event) =>
                                handleLockedItemClick(event, item)
                              }
                              className={cn(
                                "cursor-pointer opacity-65 transition-opacity hover:opacity-85",
                              )}
                            >
                              <span>{item.title}</span>
                              {item.disabledReason ? (
                                <span className="ml-auto hidden items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 2xl:inline-flex">
                                  {item.disabledReason}
                                </span>
                              ) : null}
                              <Lock className="ml-auto size-3.5 shrink-0 text-gray-400" />
                            </SidebarMenuSubButton>
                          ) : (
                            <SidebarMenuSubButton asChild isActive={isActive}>
                              <a href={item.url}>
                                <span>{item.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          )}
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
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
