"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { auth } from "@/auth/client";

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
      {open ? <PanelLeftClose /> : <PanelLeftOpen />}
    </Button>
  );
}
