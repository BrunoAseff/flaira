'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import AddTripForm from './form/AddTripForm';

export function AddTripDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full h-full min-w-full max-w-[1200px] md:min-w-[1000px] md:w-[65%] md:h-[95%] bg-background p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-accent">
          <DialogTitle className="text-foreground text-xl font-semibold">
            New trip
          </DialogTitle>
        </DialogHeader>
        <AddTripForm />
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
