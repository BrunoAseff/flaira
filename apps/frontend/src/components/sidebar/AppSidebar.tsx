"use client";

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
} from "@/components/ui/sidebar";
import Logo from "../brand/Logo";
import UserButton from "../sidebar/UserButton";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { auth } from "@/auth/client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DiscoverCircleIcon,
  AirplaneTakeOff01Icon,
  Image02Icon,
  MapsGlobal01Icon,
  News01Icon,
  Settings05Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Overview",
    url: "/",
    icon: DiscoverCircleIcon,
  },
  {
    title: "Trips",
    url: "/trips",
    icon: AirplaneTakeOff01Icon,
  },
  {
    title: "Memories",
    url: "/memories",
    icon: Image02Icon,
  },
  {
    title: "Map",
    url: "/map",
    icon: MapsGlobal01Icon,
  },
  {
    title: "Logbook",
    url: "/logbook",
    icon: News01Icon,
  },
  {
    title: "Preferences",
    url: "/preferences",
    icon: Settings05Icon,
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { data: session, isPending } = auth.useSession();
  const pathname = usePathname();

  if (isPending || !session) return null;

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(url);
  };

  return (
    <TooltipProvider openDelay={0}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="group-data-[collapsible=icon]:hidden mx-auto py-3">
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:mt-16">
            <Tooltip side="right">
              <TooltipTrigger>
                <SidebarMenuButton
                  className="hover:text-background active:text-primary [&>svg]:text-background hover:[&>svg]:text-background gap-2 text-background h-13 rounded-xl text-lg font-medium data-[state=open]:hover:text-background  data-[state=open]:hover:bg-primary/90"
                  asChild
                >
                  <Button className="mt-3 mb-6">
                    <HugeiconsIcon
                      icon={PlusSignIcon}
                      color="currentColor"
                      strokeWidth={2}
                    />
                    <p className="group-data-[collapsible=icon]:hidden">
                      Add trip
                    </p>
                  </Button>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent>{!open ? "Add trip" : null}</TooltipContent>
            </Tooltip>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <Tooltip side="right" key={item.title}>
                      <TooltipTrigger>
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            asChild
                            isActive={active}
                            className={cn(
                              active &&
                                "bg-primary text-primary-foreground hover:bg-primary/90",
                            )}
                          >
                            <Link
                              href={item.url}
                              onClick={(e) => {
                                if (active) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              <HugeiconsIcon
                                icon={item.icon}
                                color="currentColor"
                                strokeWidth={2}
                                className="ml-0.5"
                              />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </TooltipTrigger>
                      <TooltipContent>
                        {!open ? item.title : null}
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
  );
}
