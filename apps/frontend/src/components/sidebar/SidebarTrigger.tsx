'use client';

import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { auth } from '@/auth/client';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SidebarRight01Icon,
  SidebarLeft01Icon,
} from '@hugeicons/core-free-icons';

export function SidebarTrigger() {
  const { toggleSidebar, open } = useSidebar();
  const { data: session, isPending } = auth.useSession();
  if (isPending || !session) return null;
  return (
    <Button
      className="absolute left-2 top-2 z-50 size-10 p-2 hover:bg-sidebar-accent"
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
    >
      <HugeiconsIcon
        icon={open ? SidebarLeft01Icon : SidebarRight01Icon}
        color="currentColor"
        strokeWidth={2}
      />
    </Button>
  );
}
