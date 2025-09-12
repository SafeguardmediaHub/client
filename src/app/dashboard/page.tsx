import { AppSidebar } from '@/components/app-sidebar';
import Dashboard from '@/components/dashboard';
import { SearchForm } from '@/components/search-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { BellIcon, ChevronDownIcon, SettingsIcon } from 'lucide-react';

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
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
                  <BreadcrumbLink href="#">Dashboaard </BreadcrumbLink>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className="hidden md:block" /> */}
                {/* <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem> */}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <SearchForm />

          <div className="inline-flex items-center justify-end gap-6 relative flex-[0_0_auto]">
            <BellIcon className="relative w-5 h-5 text-[#5c5c5c]" />

            <SettingsIcon className="relative w-5 h-5 text-[#5c5c5c]" />

            <div className="inline-flex items-center justify-end gap-2 relative flex-[0_0_auto]">
              <Avatar className="relative w-8 h-8">
                <AvatarImage src="/avatars.svg" alt="Jane Doe" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>

              <div className="relative w-fit font-paragraph-medium-medium font-[number:var(--paragraph-medium-medium-font-weight)] text-black text-[length:var(--paragraph-medium-medium-font-size)] text-center tracking-[var(--paragraph-medium-medium-letter-spacing)] leading-[var(--paragraph-medium-medium-line-height)] whitespace-nowrap [font-style:var(--paragraph-medium-medium-font-style)]">
                Jane Doe
              </div>

              <ChevronDownIcon className="relative w-[18px] h-[18px] text-muted-foreground" />
            </div>
          </div>
        </header>
        <Dashboard />
      </SidebarInset>
    </SidebarProvider>
  );
}
