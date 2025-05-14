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
} from "@/components/ui/sidebar";
import Logo from "../brand/Logo";
import UserButton from "../sidebar/UserButton";
import { Button } from "../ui/button";

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
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="group-data-[collapsible=icon]:hidden mx-auto py-3">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:mt-16">
          <SidebarMenuButton
            className="hover:text-background font-medium"
            asChild
          >
            <Button className="mt-3 mb-6">
              <Plus />
              <p className="group-data-[collapsible=icon]:hidden">Add trip</p>
            </Button>
          </SidebarMenuButton>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="ml-0.5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
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
  );
}
