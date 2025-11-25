'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
  featureId?: string;
  adminOnly?: boolean;
}

export function NavAuthenticity({
  items,
  defaultOpen = false,
}: {
  items: NavItem[];
  defaultOpen?: boolean;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Check if we're on any authenticity page
  const isAuthenticityActive = pathname.startsWith('/dashboard/authenticity');

  // Filter items based on admin status
  const filteredItems = items.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  // Get the main icon (first item's icon or default)
  const MainIcon = items[0]?.icon;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden" suppressHydrationWarning>
      <SidebarGroupLabel>Authenticity</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible
          asChild
          defaultOpen={defaultOpen || isAuthenticityActive}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip="Authenticity"
                className={cn(
                  isAuthenticityActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                )}
              >
                {MainIcon && <MainIcon className="text-primary" />}
                <span>C2PA Verification</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {filteredItems.map((item) => (
                  <SidebarMenuSubItem key={item.name}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === item.url}
                    >
                      <a href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.name}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
