"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export function AddTripDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-full sm:min-w-96 md:min-w-96 w-full md:w-[75%] lg:w-[50%] h-full md:h-[90%] bg-background p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-muted">
          <DialogTitle className="text-foreground text-xl font-semibold">
            Add trip
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 w-full overflow-hidden px-6 pt-4" />
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
