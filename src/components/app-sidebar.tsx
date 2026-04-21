"use client";

import {
  BookOpen,
  FileBarChart,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  Scissors,
  SearchCheck,
  Send,
  Shield,
  ShieldCheck,
  ShieldIcon,
  Users,
} from "lucide-react";
import type * as React from "react";
import { Suspense } from "react";
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
  type FeatureAccessState,
  getCombinedFeatureState,
  getFeatureStateShortLabel,
  type ProductFeatureKey,
} from "@/lib/subscription-access";
import { NavAdmin } from "./nav-admin";
import { NavFeatureSections } from "./nav-feature-sections";
import { NavOverview } from "./nav-overview";
import { NavReporting } from "./nav-reporting";
import { NavUser } from "./nav-user";

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
      name: "Keyframe Extraction",
      url: "/dashboard/keyframe",
      icon: Scissors,
    },
    {
      name: "Batch Processing",
      url: "/dashboard/batches",
      icon: Layers,
      accessFeatures: ["batchUpload"] as ProductFeatureKey[],
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
      disabledMessage: "Team collaboration is not available yet.",
    },
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

function getDisabledMessage(label: string, state: FeatureAccessState) {
  if (state.reason === "plan") {
    return `${label} is not available on your current plan.`;
  }

  if (state.reason === "disabled") {
    return `${label} is currently unavailable.`;
  }

  return `${label} is unavailable right now.`;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const subscriptionUsageQuery = useSubscriptionUsage();
  const isFreePlan =
    subscriptionUsageQuery.data?.tier?.toLowerCase() === "free";

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
      disabledMessage: !state.available
        ? getDisabledMessage(item.name, state)
        : undefined,
    };
  });

  const getGatedItem = (item: {
    title: string;
    url: string;
    featureId?: string;
    accessFeatures?: ProductFeatureKey[];
    activePrefixes?: string[];
  }) => {
    if (!item.accessFeatures?.length) {
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
      disabledMessage: !state.available
        ? getDisabledMessage(item.title, state)
        : undefined,
    };
  };
  const forensicsSectionState = getCombinedFeatureState(
    subscriptionUsageQuery.data,
    ["forensicsImage", "forensicsAudio", "forensicsVideo", "forensicsFrames"],
  );

  const featureSections = [
    {
      title: "AI Media Detection",
      icon: ShieldIcon,
      activePrefixes: ["/dashboard/ai-media-detection"],
      items: [
        getGatedItem({
          title: "Images",
          url: "/dashboard/ai-media-detection?media=image",
          accessFeatures: ["deepfakeImage"],
        }),
        getGatedItem({
          title: "Videos",
          url: "/dashboard/ai-media-detection?media=video",
          accessFeatures: ["deepfakeVideo"],
        }),
        getGatedItem({
          title: "Audio",
          url: "/dashboard/ai-media-detection?media=audio",
          accessFeatures: ["deepfakeAudio"],
        }),
      ],
    },
    {
      title: "Forensics",
      icon: Shield,
      activePrefixes: ["/dashboard/forensics"],
      disabled: !forensicsSectionState.available,
      disabledReason: !forensicsSectionState.available
        ? getFeatureStateShortLabel(forensicsSectionState)
        : undefined,
      disabledMessage: !forensicsSectionState.available
        ? getDisabledMessage("Forensics", forensicsSectionState)
        : undefined,
      items: [
        getGatedItem({
          title: "Images",
          url: "/dashboard/forensics?media=image",
          accessFeatures: ["forensicsImage"],
        }),
        getGatedItem({
          title: "Videos",
          url: "/dashboard/forensics?media=video",
          accessFeatures: ["forensicsVideo"],
        }),
        getGatedItem({
          title: "Audio",
          url: "/dashboard/forensics?media=audio",
          accessFeatures: ["forensicsAudio"],
        }),
        getGatedItem({
          title: "Frames",
          url: "/dashboard/forensics?media=frames",
          accessFeatures: ["forensicsFrames"],
        }),
      ],
    },
    {
      title: "Authenticity",
      icon: ShieldCheck,
      activePrefixes: [
        "/dashboard/authenticity",
        "/dashboard/geolocation",
        "/dashboard/timeline",
        "/dashboard/tamper-detection",
      ],
      items: [
        // getGatedItem({
        //   title: "Overview",
        //   url: "/dashboard/authenticity",
        //   accessFeatures: ["c2pa"],
        // }),
        // getGatedItem({
        //   title: "Verify",
        //   url: "/dashboard/authenticity/verify",
        //   accessFeatures: ["c2pa"],
        // }),
        // getGatedItem({
        //   title: "Badges",
        //   url: "/dashboard/authenticity/badges",
        //   accessFeatures: ["c2pa"],
        // }),
        getGatedItem({
          title: "Geolocation Verify",
          url: "/dashboard/geolocation",
          accessFeatures: ["geolocationVerification"],
          activePrefixes: ["/dashboard/geolocation"],
        }),
        getGatedItem({
          title: "Timeline",
          url: "/dashboard/timeline",
          accessFeatures: ["timelineVerification"],
          activePrefixes: ["/dashboard/timeline"],
        }),
        {
          title: "Tamper Detection",
          url: "/dashboard/tamper-detection",
          activePrefixes: ["/dashboard/tamper-detection"],
        },
      ],
    },
    {
      title: "Content Verification",
      icon: SearchCheck,
      activePrefixes: [
        "/dashboard/reverse",
        "/dashboard/fact-check",
        "/dashboard/claim-research",
        "/dashboard/keyframe",
      ],
      items: [
        getGatedItem({
          title: "Reverse Image Search",
          url: "/dashboard/reverse",
          accessFeatures: ["reverseLookup"],
          activePrefixes: ["/dashboard/reverse"],
        }),
        getGatedItem({
          title: "Fact Check",
          url: "/dashboard/fact-check",
          accessFeatures: ["factCheck"],
          activePrefixes: ["/dashboard/fact-check"],
        }),
        getGatedItem({
          title: "Claim Research",
          url: "/dashboard/claim-research",
          accessFeatures: ["claimResearch"],
          activePrefixes: ["/dashboard/claim-research"],
        }),
      ],
    },
  ];

  const reportingItems = data.reporting.map((item) => {
    if (item.name !== "Reports" || !isFreePlan) {
      return item;
    }

    return {
      ...item,
      disabled: true,
      disabledReason: "Plan",
      disabledMessage: "Reports are not available on the free plan.",
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
        <Suspense>
          <NavFeatureSections sections={featureSections} />
        </Suspense>
        <NavReporting projects={reportingItems} />
        {user?.role === "admin" && <NavAdmin />}
        <NavOverview label="Support" projects={data.navSecondary} />
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
