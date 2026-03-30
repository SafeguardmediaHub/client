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

export function NavOverview({
  label = "Overview",
  projects,
}: {
  label?: string;
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
    disabled?: boolean;
    disabledReason?: string;
    disabledMessage?: string;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            {item.disabled ? (
              <SidebarMenuButton
                title={item.disabledReason || undefined}
                onClick={() =>
                  toast(
                    item.disabledMessage || `${item.name} is unavailable.`,
                    {
                      duration: 3500,
                    },
                  )
                }
                className="cursor-not-allowed opacity-60 transition-opacity hover:opacity-80"
              >
                <item.icon className="text-primary" />
                <span>{item.name}</span>
                {item.disabledReason ? (
                  <span className="ml-auto hidden items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 xl:inline-flex">
                    {item.disabledReason}
                  </span>
                ) : null}
                <Lock className="ml-auto size-3.5 shrink-0 text-gray-400" />
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
