"use client";

import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavOverview({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
    disabled?: boolean;
    disabledReason?: string;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="">
      <SidebarGroupLabel>Overview</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            {item.disabled ? (
              <SidebarMenuButton
                title={item.disabledReason || undefined}
                className="cursor-not-allowed opacity-60"
              >
                <item.icon className="text-primary" />
                <span>{item.name}</span>
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
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
