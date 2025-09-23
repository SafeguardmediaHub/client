import type React from 'react';
import AppNavbar from '@/components/app-navbar';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppNavbar />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
