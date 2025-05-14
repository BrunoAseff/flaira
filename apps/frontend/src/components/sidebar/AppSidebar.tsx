"use client";

import {
  Compass,
  Images,
  Map as MapIcon,
  PlaneTakeoff,
  Plus,
  ScrollText,
  Settings2,
} from "lucide-react";

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

const items = [
  {
    title: "Overview",
    url: "#",
    icon: Compass,
  },
  {
    title: "Trips",
    url: "#",
    icon: PlaneTakeoff,
  },
  {
    title: "Memories",
    url: "#",
    icon: Images,
  },
  {
    title: "Map",
    url: "#",
    icon: MapIcon,
  },
  {
    title: "Logbook",
    url: "#",
    icon: ScrollText,
  },
  {
    title: "Preferences",
    url: "#",
    icon: Settings2,
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { data: session, isPending } = auth.useSession();
  if (isPending || !session) return null;

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
                  className="hover:text-background active:text-foreground gap-2 text-background h-13 rounded-xl text-lg font-medium data-[state=open]:hover:text-background data-[state=open]:hover:bg-primary/90"
                  asChild
                >
                  <Button className="mt-3 mb-6">
                    <Plus />
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
                {items.map((item) => (
                  <Tooltip side="right" key={item.title}>
                    <TooltipTrigger>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <a href={item.url}>
                            <item.icon className="ml-0.5" />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </TooltipTrigger>
                    <TooltipContent>{!open ? item.title : null}</TooltipContent>
                  </Tooltip>
                ))}
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
