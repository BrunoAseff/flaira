'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import Logo from '../brand/Logo';
import UserButton from '../sidebar/UserButton';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { auth } from '@/auth/client';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  DiscoverCircleIcon,
  AirplaneTakeOff01Icon,
  Image02Icon,
  MapsGlobal01Icon,
  News01Icon,
  Settings05Icon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AddTripDialog } from '../trips/AddTripDialog';
import { routes, type AppRoute } from '@/constants/routes';

export function AppSidebar() {
  const { open } = useSidebar();
  const { data: session, isPending } = auth.useSession();
  const pathname = usePathname();
  const [isTripDialogOpen, setIsTripDialogOpen] = useState(false);

  if (isPending || !session) return null;

  const isActive = (url: AppRoute) => {
    if (url === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(url);
  };

  return (
    <>
      <TooltipProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader className="group-data-[collapsible=icon]:hidden mx-auto py-3">
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup className="group-data-[collapsible=icon]:mt-16">
              <Tooltip side="right">
                <TooltipTrigger>
                  <SidebarMenuButton
                    className="hover:bg-muted/90 active:text-primary [&>svg]:text-background hover:[&>svg]:text-background gap-2 text-background data-[state=open]:hover:text-background data-[state=open]:hover:bg-primary/90"
                    asChild
                  >
                    <Button
                      onClick={() => setIsTripDialogOpen(true)}
                      className="mt-3 mb-6"
                      size="sm"
                    >
                      <HugeiconsIcon
                        icon={PlusSignIcon}
                        color="currentColor"
                        strokeWidth={1.8}
                      />
                      <p className="group-data-[collapsible=icon]:hidden">
                        Add trip
                      </p>
                    </Button>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent>{!open ? 'Add trip' : null}</TooltipContent>
              </Tooltip>
              <SidebarGroupContent>
                <SidebarMenu>
                  {routes.map((route) => {
                    const active = isActive(route.url);
                    return (
                      <Tooltip side="right" key={route.url}>
                        <TooltipTrigger>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              asChild
                              isActive={active}
                              className={cn(
                                'border border-transparent',
                                active &&
                                  'text-primary-foreground border border-primary/10 bg-gradient-to-b from-primary-foreground to-primary-foreground/70'
                              )}
                            >
                              <Link
                                href={route.url}
                                onClick={(e) => {
                                  if (active) {
                                    e.preventDefault();
                                  }
                                }}
                              >
                                <HugeiconsIcon
                                  icon={route.icon}
                                  color="currentColor"
                                  strokeWidth={1.8}
                                  className="ml-0.5"
                                />
                                <span>{route.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          {!open ? route.title : null}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <UserButton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      </TooltipProvider>
      <AddTripDialog
        isOpen={isTripDialogOpen}
        setIsOpen={setIsTripDialogOpen}
      />
    </>
  );
}
