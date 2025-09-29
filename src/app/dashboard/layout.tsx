import type React from 'react';
import AppNavbar from '@/components/app-navbar';
import { AppSidebar } from '@/components/app-sidebar';
import Protected from '@/components/Protected';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Protected>
      <div className="min-h-screen flex">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <AppNavbar />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </div>
    </Protected>
  );
};

export default DashboardLayout;
