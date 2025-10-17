"use client";

import {
  BookCheck,
  BookOpen,
  CalendarClock,
  Command,
  FileBarChart,
  FileText,
  Film,
  Frame,
  LayoutDashboard,
  MapPin,
  Scissors,
  Search,
  SearchCheck,
  Share2,
  ShieldAlert,
  Users,
} from "lucide-react";
import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavDetectionTools } from "./nav-detection";
import { NavOverview } from "./nav-overview";
import { NavReporting } from "./nav-reporting";
import { NavVerificationTools } from "./nav-verification";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  overview: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Library",
      url: "/dashboard/library",
      icon: BookOpen,
    },
  ],

  detection: [
    {
      name: "Deepfake Detection",
      url: "#",
      icon: Frame, // still a good fit: "framing" faces/content
    },
    {
      name: "Cheapfake Detection",
      url: "#",
      icon: Film,
    },
    {
      name: "Visual Forensics",
      url: "#",
      icon: Search,
    },
    {
      name: "Tamper Detection",
      url: "#",
      icon: ShieldAlert,
    },
    {
      name: "Keyframe Extraction",
      url: "/dashboard/keyframe",
      icon: Scissors,
    },
  ],

  verification: [
    {
      name: "Reverse Lookup",
      url: "#",
      icon: SearchCheck,
    },
    {
      name: "Geolocation Verification",
      url: "#",
      icon: MapPin,
    },
    {
      name: "Timeline Verification",
      url: "#",
      icon: CalendarClock,
    },
    {
      name: "Text Extraction (OCR)",
      url: "#",
      icon: FileText,
    },
    {
      name: "Fact Checking",
      url: "#",
      icon: BookCheck,
    },
    {
      name: "Social Media Source Tracing",
      url: "#",
      icon: Share2,
    },
  ],

  reporting: [
    {
      name: "Reports Generation",
      url: "/dashboard/reporting",
      icon: FileBarChart,
    },
    {
      name: "Team Collaboration",
      url: "#",
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props} collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-lg font-medium">
                    Safeguard Media
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavOverview projects={data.overview} />
        <NavDetectionTools projects={data.detection} />
        <NavVerificationTools projects={data.verification} />
        <NavReporting projects={data.reporting} />
      </SidebarContent>
    </Sidebar>
  );
}
