"use client";

import {
  Award,
  BookCheck,
  BookOpen,
  CalendarClock,
  FileBarChart,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  MapPin,
  Scissors,
  SearchCheck,
  Send,
  Shield,
  ShieldCheck,
  ShieldIcon,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";
import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useSubscriptionUsage } from "@/hooks/useSubscriptionUsage";
import {
  getCombinedFeatureState,
  getFeatureStateShortLabel,
  type ProductFeatureKey,
} from "@/lib/subscription-access";
import { NavAdmin } from "./nav-admin";
import { NavDetectionTools } from "./nav-detection";
import { NavOverview } from "./nav-overview";
import { NavReporting } from "./nav-reporting";
import { NavUser } from "./nav-user";
import { NavVerificationTools } from "./nav-verification";

const data = {
  user: {
    name: "John Doe",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  overview: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    // {
    //   name: 'Authenticity Check',
    //   url: '/dashboard/authenticity-check',
    //   icon: ShieldCheck,
    //   featureId: 'authenticity_check',
    // },
    {
      name: "Library",
      url: "/dashboard/library",
      icon: BookOpen,
    },
    {
      name: "Batch Processing",
      url: "/dashboard/batches",
      icon: Layers,
      accessFeatures: ["batchUpload"] as ProductFeatureKey[],
    },
  ],

  detection: [
    {
      name: "AI Media Detection",
      url: "/dashboard/ai-media-detection",
      icon: ShieldIcon,
      featureId: "ai_generated_media_detection",
      accessFeatures: [
        "deepfakeImage",
        "deepfakeVideo",
        "deepfakeAudio",
      ] as ProductFeatureKey[],
    },
    {
      name: "Forensics",
      url: "/dashboard/forensics",
      icon: Shield,
      featureId: "forensics",
      accessFeatures: [
        "forensicsImage",
        "forensicsAudio",
      ] as ProductFeatureKey[],
    },
    // {
    //   name: 'Cheapfake Detection',
    //   url: '#',
    //   icon: Film,
    //   featureId: 'cheapfake_detection',
    // },
    {
      name: "Keyframe Extraction",
      url: "/dashboard/keyframe",
      icon: Scissors,
      featureId: "keyframe_extraction",
    },
  ],

  verification: [
    {
      name: "Reverse Lookup",
      url: "/dashboard/reverse",
      icon: SearchCheck,
      featureId: "reverse_lookup",
      accessFeatures: ["reverseLookup"] as ProductFeatureKey[],
    },
    {
      name: "Geolocation Verification",
      url: "/dashboard/geolocation",
      icon: MapPin,
      featureId: "geolocation_verification",
      accessFeatures: ["geolocationVerification"] as ProductFeatureKey[],
    },
    {
      name: "Timeline Verification",
      url: "/dashboard/timeline",
      icon: CalendarClock,
      featureId: "timeline_verification",
      accessFeatures: ["timelineVerification"] as ProductFeatureKey[],
    },
    {
      name: "Tamper Detection",
      url: "/dashboard/tamper-detection",
      icon: Shield,
      featureId: "tamper_detection",
    },
    {
      name: "Fact Checking",
      url: "/dashboard/fact-check",
      icon: BookCheck,
      featureId: "fact_checking",
      accessFeatures: ["factCheck"] as ProductFeatureKey[],
    },
    // {
    //   name: 'SM Source Tracing',
    //   url:'/dashboard/trace',
    //   icon: Share2,
    //   featureId: 'social_media_tracing',
    // },
    {
      name: "Claim Research",
      url: "/dashboard/claim-research",
      icon: Sparkles,
      featureId: "claim_research",
      accessFeatures: ["claimResearch"] as ProductFeatureKey[],
    },
  ],

  reporting: [
    {
      name: "Reports",
      url: "/dashboard/reporting",
      icon: FileBarChart,
      featureId: "reports_generation",
    },
    {
      name: "Team Collaboration",
      url: "#",
      icon: Users,
      featureId: "team_collaboration",
    },
  ],

  authenticity: [
    {
      name: "Overview",
      url: "/dashboard/authenticity",
      icon: ShieldCheck,
      featureId: "c2pa_overview",
      accessFeatures: ["c2pa"] as ProductFeatureKey[],
    },
    {
      name: "Verify",
      url: "/dashboard/authenticity/verify",
      icon: Upload,
      featureId: "c2pa_verify",
      accessFeatures: ["c2pa"] as ProductFeatureKey[],
    },
    {
      name: "Badges",
      url: "/dashboard/authenticity/badges",
      icon: Award,
      featureId: "c2pa_badges",
      accessFeatures: ["c2pa"] as ProductFeatureKey[],
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
      name: "Feedback",
      url: "/dashboard/feedback",
      icon: Send,
    },
    {
      name: "Support",
      url: "/dashboard/support",
      icon: LifeBuoy,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const subscriptionUsageQuery = useSubscriptionUsage();

  const gatedOverview = data.overview.map((item) => {
    if (!("accessFeatures" in item) || !item.accessFeatures) {
      return item;
    }

    const state = getCombinedFeatureState(
      subscriptionUsageQuery.data,
      item.accessFeatures,
    );

    return {
      ...item,
      disabled: !state.available,
      disabledReason: !state.available
        ? getFeatureStateShortLabel(state)
        : undefined,
    };
  });

  const gatedDetection = data.detection.map((item) => {
    if (!("accessFeatures" in item) || !item.accessFeatures) {
      return item;
    }

    const state = getCombinedFeatureState(
      subscriptionUsageQuery.data,
      item.accessFeatures,
    );

    return {
      ...item,
      disabled: !state.available,
      disabledReason: !state.available
        ? getFeatureStateShortLabel(state)
        : undefined,
    };
  });

  const gatedVerification = data.verification.map((item) => {
    if (!("accessFeatures" in item) || !item.accessFeatures) {
      return item;
    }

    const state = getCombinedFeatureState(
      subscriptionUsageQuery.data,
      item.accessFeatures,
    );

    return {
      ...item,
      disabled: !state.available,
      disabledReason: !state.available
        ? getFeatureStateShortLabel(state)
        : undefined,
    };
  });

  return (
    <Sidebar variant="inset" {...props} collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="relative flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                  <Shield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-lg font-medium">
                    Safeguardmedia
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pb-4">
        <NavOverview projects={gatedOverview} />
        <NavDetectionTools projects={gatedDetection} />
        <NavVerificationTools projects={gatedVerification} />
        {/* <NavAuthenticity items={data.authenticity} /> */}
        <NavReporting projects={data.reporting} />
        {user?.role === "admin" && <NavAdmin />}
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
                  avatar: "/avatars/shadcn.jpg",
                }
              : data.user
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}
