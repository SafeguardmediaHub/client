"use client";

import type { LucideIcon } from "lucide-react";
import { Lock } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavReporting({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
    featureId?: string;
    disabled?: boolean;
    disabledReason?: string;
    disabledMessage?: string;
  }[];
}) {
  const pathname = usePathname();

  const handleItemClick = (
    e: React.MouseEvent,
    url: string,
    disabledMessage?: string,
    itemName?: string,
  ) => {
    if (url === "#") {
      e.preventDefault();
      toast(
        disabledMessage || `${itemName || "This feature"} is unavailable.`,
        {
          duration: 3500,
        },
      );
    }
  };

  return (
    <SidebarGroup suppressHydrationWarning>
      <SidebarGroupLabel>Reporting & Collaboration</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const isLocked = item.url === "#" || item.disabled;

          return (
            <SidebarMenuItem key={item.name}>
              {isLocked ? (
                <SidebarMenuButton
                  title={item.disabledReason || undefined}
                  onClick={(e) =>
                    handleItemClick(
                      e,
                      item.url,
                      item.disabledMessage,
                      item.name,
                    )
                  }
                  className={cn(
                    "opacity-60 cursor-pointer hover:opacity-80 transition-opacity",
                  )}
                >
                  <item.icon className="text-primary" />
                  <span>{item.name}</span>
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
  );
}
