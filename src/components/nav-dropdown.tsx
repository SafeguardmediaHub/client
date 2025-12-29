import { UserCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLogout } from '@/hooks/useAuth';

import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function NavDropdown({ name }: { name?: string }) {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        window.location.href = '/auth/login';
        toast.success('Logout successful');
      },
      onError: (_error) => {
        toast.error('Logout failed. Please try again.');
      },
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <UserCircle2 />{' '}
          {name?.trim()?.length
            ? name[0].toUpperCase() + name.slice(1)
            : 'Account'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup> */}

        {/* <DropdownMenuSeparator /> */}

        <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
