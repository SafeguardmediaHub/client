'use client';

import {
  BookCheck,
  BookOpen,
  CalendarClock,
  Command,
  FileBarChart,
  FileText,
  Film,
  LayoutDashboard,
  MapPin,
  Scissors,
  Search,
  SearchCheck,
  Share2,
  ShieldAlert,
  ShieldIcon,
  Users,
} from 'lucide-react';
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

  overview: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Library',
      url: '/dashboard/library',
      icon: BookOpen,
    },
  ],

  detection: [
    {
      name: 'Deepfake Detection',
      url: '#',
      icon: ShieldIcon,
      featureId: 'deepfake_detection',
    },
    {
      name: 'Cheapfake Detection',
      url: '#',
      icon: Film,
      featureId: 'cheapfake_detection',
    },
    {
      name: 'Visual Forensics',
      url: '#',
      icon: Search,
      featureId: 'visual_forensics',
    },
    {
      name: 'Tamper Detection',
      url: '#',
      icon: ShieldAlert,
      featureId: 'tamper_detection',
    },
    {
      name: 'Keyframe Extraction',
      url: '/dashboard/keyframe',
      icon: Scissors,
      featureId: 'keyframe_extraction',
    },
  ],

  verification: [
    {
      name: 'Reverse Lookup',
      url: '/dashboard/reverse',
      icon: SearchCheck,
      featureId: 'reverse_lookup',
    },
    {
      name: 'Geolocation Verification',
      url: '/dashboard/geolocation',
      icon: MapPin,
      featureId: 'geolocation_verification',
    },
    {
      name: 'Timeline Verification',
      url: '/dashboard/timeline',
      icon: CalendarClock,
      featureId: 'timeline_verification',
    },
    {
      name: 'Text Extraction (OCR)',
      url: '#',
      icon: FileText,
      featureId: 'ocr_extraction',
    },
    {
      name: 'Fact Checking',
      url: '/dashboard/fact-check',
      icon: BookCheck,
      featureId: 'fact_checking',
    },
    {
      name: 'Social Media Source Tracing',
      url: '/dashboard/trace',
      icon: Share2,
      featureId: 'social_media_tracing',
    },
  ],

  reporting: [
    {
      name: 'Reports Generation',
      url: '/dashboard/reporting',
      icon: FileBarChart,
      featureId: 'reports_generation',
    },
    {
      name: 'Team Collaboration',
      url: '#',
      icon: Users,
      featureId: 'team_collaboration',
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
