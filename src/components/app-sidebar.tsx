'use client';

import { Command, Frame, Map, PieChart } from 'lucide-react';
import type * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavDetectionTools } from './nav-detection';
import { NavOverview } from './nav-overview';
import { NavReporting } from './nav-reporting';
import { NavVerificationTools } from './nav-verification';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
  overview: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: Frame,
    },
    {
      name: 'Library',
      url: '/dashboard/library',
      icon: PieChart,
    },
  ],
  detection: [
    {
      name: 'Deepfake Detection',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Cheapfake Detection',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Visual Forensics',
      url: '#',
      icon: Map,
    },
    {
      name: 'Tamper Detection',
      url: '#',
      icon: Map,
    },
    {
      name: 'Keyframe Extraction',
      url: '#',
      icon: Map,
    },
  ],
  verification: [
    {
      name: 'Reverse Lookup',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Geolocation Verification',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Timeline Verification',
      url: '#',
      icon: Map,
    },
    {
      name: 'Text Extraction (OCR)',
      url: '#',
      icon: Map,
    },
    {
      name: 'Fact Checking',
      url: '#',
      icon: Map,
    },
    {
      name: 'Social Media Source Tracing',
      url: '#',
      icon: Map,
    },
  ],
  reporting: [
    {
      name: 'Reports Generation',
      url: '/dashboard/reporting',
      icon: Frame,
    },
    {
      name: 'Team Collaboration',
      url: '#',
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
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

        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
    </Sidebar>
  );
}
