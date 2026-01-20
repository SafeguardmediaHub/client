'use client';

import {
  Award,
  BookCheck,
  BookOpen,
  CalendarClock,
  Command,
  FileBarChart,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  MapPin,
  Scissors,
  Search,
  SearchCheck,
  Send,
  Shield,
  ShieldCheck,
  ShieldIcon,
  Sparkles,
  Upload,
  Users,
} from 'lucide-react';
import type * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { NavAdmin } from './nav-admin';
import { NavDetectionTools } from './nav-detection';
import { NavOverview } from './nav-overview';
import { NavReporting } from './nav-reporting';
import { NavUser } from './nav-user';
import { NavVerificationTools } from './nav-verification';

const data = {
  user: {
    name: 'John Doe',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },

  overview: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    // {
    //   name: 'Authenticity Check',
    //   url: '/dashboard/authenticity-check',
    //   icon: ShieldCheck,
    //   featureId: 'authenticity_check',
    // },
    {
      name: 'Library',
      url: '/dashboard/library',
      icon: BookOpen,
    },
    {
      name: 'Batch Processing',
      url: '/dashboard/batches',
      icon: Layers,
    },
  ],

  detection: [
    {
      name: 'AI-Generated Media Detection',
      url: '#',
      icon: ShieldIcon,
      featureId: 'ai_generated_media_detection',
    },
    // {
    //   name: 'Cheapfake Detection',
    //   url: '#',
    //   icon: Film,
    //   featureId: 'cheapfake_detection',
    // },
    {
      name: 'Visual Forensics',
      url: '#', //'/dashboard/visual',
      icon: Search,
      featureId: 'visual_forensics',
    },
    {
      name: 'Audio Forensics',
      url: '#', //'/dashboard/audio',
      icon: Search,
      featureId: 'audio_forensics',
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
      name: 'Tamper Detection',
      url: '/dashboard/tamper-detection',
      icon: Shield,
      featureId: 'tamper_detection',
    },
    {
      name: 'Fact Checking',
      url: '/dashboard/fact-check',
      icon: BookCheck,
      featureId: 'fact_checking',
    },
    // {
    //   name: 'SM Source Tracing',
    //   url:'/dashboard/trace',
    //   icon: Share2,
    //   featureId: 'social_media_tracing',
    // },
    {
      name: 'Claim Research',
      url: '/dashboard/claim-research',
      icon: Sparkles,
      featureId: 'claim_research',
    },
  ],

  reporting: [
    {
      name: 'Reports',
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

  authenticity: [
    {
      name: 'Overview',
      url: '/dashboard/authenticity',
      icon: ShieldCheck,
      featureId: 'c2pa_overview',
    },
    {
      name: 'Verify',
      url: '/dashboard/authenticity/verify',
      icon: Upload,
      featureId: 'c2pa_verify',
    },
    {
      name: 'Badges',
      url: '/dashboard/authenticity/badges',
      icon: Award,
      featureId: 'c2pa_badges',
    },
    // {
    //   name: 'Admin Panel',
    //   url: '/dashboard/authenticity/admin',
    //   icon: Settings,
    //   featureId: 'c2pa_admin',
    //   adminOnly: true,
    // },
  ],
  navSecondary: [
    {
      name: 'Feedback',
      url: '/dashboard/feedback',
      icon: Send,
    },
    {
      name: 'Support',
      url: '/dashboard/support',
      icon: LifeBuoy,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

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
      <SidebarContent className="pb-4">
        <NavOverview projects={data.overview} />
        <NavDetectionTools projects={data.detection} />
        <NavVerificationTools projects={data.verification} />
        {/* <NavAuthenticity items={data.authenticity} /> */}
        <NavReporting projects={data.reporting} />
        {user?.role === 'admin' && <NavAdmin />}
        <NavOverview projects={data.navSecondary} />
      </SidebarContent>
      {/* <SidebarFooter className="sm:hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <User2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="truncate text-xs text-gray-600">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <User2 className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="truncate text-xs text-gray-600">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="size-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
      <SidebarFooter>
        <NavUser
          user={
            user
              ? {
                  name: user.firstName,
                  email: user.email,
                  avatar: '/avatars/shadcn.jpg',
                }
              : data.user
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}
