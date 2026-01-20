'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import GoogleTranslate from './GoogleTranslate';
import { NavDropdown } from './nav-dropdown';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';

const AppNavbar = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  // Enhanced route name mapping
  const routeNameMap: Record<string, string> = {
    dashboard: 'Dashboard',
    library: 'Library',
    reporting: 'Reports',
    batches: 'Batch Processing',
    'fact-check': 'Fact Checking',
    timeline: 'Timeline Verification',
    geolocation: 'Geolocation',
    reverse: 'Reverse Lookup',
    'tamper-detection': 'Tamper Detection',
    'claim-research': 'Claim Research',
    keyframe: 'Keyframe Extraction',
    authenticity: 'Authenticity',
    verify: 'Verify',
    badges: 'Badges',
    admin: 'Admin',
    waitlist: 'Waitlist Management',
    feedback: 'Feedback',
    support: 'Support',
  };

  const getBreadcrumbItems = () => {
    const items = [];
    const pathSegments = pathname.split('/').filter(Boolean);

    // Always add Dashboard as first item
    items.push(
      <BreadcrumbItem key="dashboard" className="hidden md:block">
        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
      </BreadcrumbItem>,
    );

    // Skip if we're on the dashboard root
    if (pathSegments.length === 1 && pathSegments[0] === 'dashboard') {
      return items;
    }

    // Build breadcrumbs from path segments (skip 'dashboard' as it's already added)
    const segments = pathSegments.slice(1);
    let currentPath = '/dashboard';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Skip dynamic route segments (like [id])
      if (segment.startsWith('[') && segment.endsWith(']')) {
        return;
      }

      // Get display name from map or format the segment
      const displayName =
        routeNameMap[segment] ||
        segment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

      items.push(
        <BreadcrumbSeparator
          key={`separator-${segment}`}
          className="hidden md:block"
        />,
      );

      if (isLast) {
        items.push(
          <BreadcrumbItem key={segment}>
            <BreadcrumbPage>{displayName}</BreadcrumbPage>
          </BreadcrumbItem>,
        );
      } else {
        items.push(
          <BreadcrumbItem key={segment} className="hidden md:block">
            <BreadcrumbLink href={currentPath}>{displayName}</BreadcrumbLink>
          </BreadcrumbItem>,
        );
      }
    });

    return items;
  };

  return (
    <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex justify-center items-center">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>{getBreadcrumbItems()}</BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* <div className="hidden md:block flex-1 max-w-md">
        <SearchForm />
      </div> */}

      <div className="hidden sm:inline-flex items-center justify-end gap-6 relative flex-[0_0_auto]">
        {/* <BellIcon className="relative w-5 h-5 text-[#5c5c5c]" /> */}

        <div className="inline-flex items-center justify-end gap-2 relative flex-[0_0_auto]">
          <GoogleTranslate />
          <NavDropdown name={user?.firstName} />
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
