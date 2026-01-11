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

  const navigationMap = {
    '/dashboard': { name: 'Dashboard', category: 'Overview' },
    '/dashboard/library': { name: 'Library', category: 'Overview' },
    '/dashboard/reporting': {
      name: 'Reports Generation',
      category: 'Reporting & Collaboration',
    },
  };

  const currentPage = navigationMap[pathname as keyof typeof navigationMap];

  const getBreadcrumbItems = () => {
    const items = [];

    items.push(
      <BreadcrumbItem key="dashboard" className="hidden md:block">
        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
      </BreadcrumbItem>
    );

    if (currentPage && pathname !== '/dashboard') {
      items.push(
        <BreadcrumbSeparator key="separator" className="hidden md:block" />
      );
      items.push(
        <BreadcrumbItem key="current">
          <BreadcrumbPage>{currentPage.name}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }

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
