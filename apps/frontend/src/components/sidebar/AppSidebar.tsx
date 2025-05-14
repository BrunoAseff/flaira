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
} from "../ui/tooltip";

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

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="group-data-[collapsible=icon]:hidden mx-auto py-3">
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:mt-16">
            <Tooltip>
              <TooltipTrigger>
                {" "}
                <SidebarMenuButton
                  className="hover:text-background gap-2 text-background hover:bg-primary/90 h-13 rounded-xl text-lg font-medium"
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
              {!open && <TooltipContent side="right">Add trip</TooltipContent>}
            </Tooltip>

            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <a href={item.url}>
                            <item.icon className="ml-0.5" />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {!open && (
                        <TooltipContent side="right">
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </SidebarMenuItem>
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
