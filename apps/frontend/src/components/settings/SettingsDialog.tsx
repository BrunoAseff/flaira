import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockKeyIcon, UserSquareIcon } from "@hugeicons/core-free-icons";
import { auth } from "@/auth/client";
import { useEffect } from "react";
import SecurityTab from "./SecurityTab";

export function SettingsDialog({
  isOpen,
  setIsOpen,
}: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  useEffect(() => {
    async function getSessionsList() {
      const sessionsList = await auth.listSessions();
      console.log(sessionsList);
    }

    getSessionsList();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[55%] h-[85%] bg-background p-4">
        <DialogHeader>
          <DialogTitle className=" ml-5 text-foreground text-2xl font-semibold">
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="my-18 w-full">
          <Tabs
            className="flex w-full"
            defaultValue="profile"
            orientation="vertical"
          >
            <TabsList className="flex flex-col bg-transparent gap-2 w-fit">
              <TabsTrigger value="profile">
                <HugeiconsIcon
                  icon={UserSquareIcon}
                  color="currentColor"
                  strokeWidth={2}
                  size={28}
                />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security">
                <HugeiconsIcon
                  icon={LockKeyIcon}
                  color="currentColor"
                  strokeWidth={2}
                  size={28}
                />
                Security
              </TabsTrigger>
            </TabsList>
            <TabsContent className="w-full" value="profile">
              Content 1
            </TabsContent>
            <TabsContent className="w-full" value="security">
              <SecurityTab />
            </TabsContent>
          </Tabs>{" "}
        </div>

        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
