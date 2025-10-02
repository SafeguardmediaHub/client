'use client';

import { BellIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

import { NavDropdown } from './nav-dropdown';
import { SearchForm } from './search-form';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from './ui/breadcrumb';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';

const AppNavbar = () => {
  const { user } = useAuth();

  return (
    <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex justify-center items-center">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Dashboard </BreadcrumbLink>
            </BreadcrumbItem>
            {/* <BreadcrumbSeparator className="hidden md:block" /> */}
            {/* <BreadcrumbItem>
          <BreadcrumbPage>Data Fetching</BreadcrumbPage>
        </BreadcrumbItem> */}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <SearchForm />

      <div className="hidden sm:inline-flex items-center justify-end gap-6 relative flex-[0_0_auto]">
        <BellIcon className="relative w-5 h-5 text-[#5c5c5c]" />

        <div className="inline-flex items-center justify-end gap-2 relative flex-[0_0_auto]">
          <NavDropdown name={user?.firstName} />
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
