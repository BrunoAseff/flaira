import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function SidebarTrigger() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <Button
      className="absolute left-2 top-2 z-50 size-9 p-2 hover:bg-sidebar-accent"
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
    >
      {open ? <PanelLeftClose /> : <PanelLeftOpen />}
    </Button>
  );
}
