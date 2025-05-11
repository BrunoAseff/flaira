import { Compass, Images, Map as MapIcon, ScrollText } from "lucide-react";

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

const items = [
  {
    title: "Overview",
    url: "#",
    icon: Compass,
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
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="group-data-[collapsible=icon]:hidden mx-auto py-3">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="mt-22 group-data-[collapsible=icon]:mt-36">
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
