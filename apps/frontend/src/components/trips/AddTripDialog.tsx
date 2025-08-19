'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AddTripForm from './form/AddTripForm';
import {
  useDetails,
  useRoute,
  useTravelers,
  useImages,
  useTripActions,
} from '@/stores/trip-store';
import { useState, useMemo } from 'react';

export function AddTripDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [showExitWarning, setShowExitWarning] = useState(false);
  const details = useDetails();
  const route = useRoute();
  const travelers = useTravelers();
  const images = useImages();
  const actions = useTripActions();

  const hasUnsavedChanges = useMemo(() => {
    return (
      details.title.trim() !== '' ||
      details.description.trim() !== '' ||
      details.startDate !== null ||
      details.endDate !== null ||
      details.hasTripFinished !== false ||
      route.transportMode !== 'car' ||
      route.locations.length > 0 ||
      route.stops.length > 0 ||
      travelers.users.length > 0 ||
      images.length > 0
    );
  }, [details, route, travelers, images]);

  const handleOpenChange = (open: boolean) => {
    if (!open && hasUnsavedChanges) {
      setShowExitWarning(true);
    } else {
      setIsOpen(open);
    }
  };

  const handleConfirmExit = () => {
    actions.resetForm();
    setShowExitWarning(false);
    setTimeout(() => setIsOpen(false), 0);
  };

  const handleCancelExit = () => {
    setShowExitWarning(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="fixed inset-0 z-50 w-full h-full translate-x-0 translate-y-0 min-[1400px]:left-[50%] min-[1400px]:top-[50%] min-[1400px]:translate-x-[-50%] min-[1400px]:translate-y-[-50%] min-[1400px]:max-w-[1200px] min-[1400px]:min-w-[1000px] min-[1400px]:w-[65%] min-[1400px]:h-[95%] min-[1400px]:rounded-lg bg-background p-0 flex flex-col overflow-hidden border shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <DialogHeader className="px-6 py-4 border-b border-accent">
            <DialogTitle className="text-foreground text-xl font-semibold">
              New trip
            </DialogTitle>
            <DialogDescription className="sr-only">
              Add a new trip to your library.
            </DialogDescription>
          </DialogHeader>
          <AddTripForm />
          <DialogClose />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showExitWarning} onOpenChange={setShowExitWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost if you continue. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelExit}>
              Stay here
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmExit}
              className="bg-error text-white shadow-xs hover:bg-error/90 focus-visible:ring-error/20 dark:focus-visible:ring-error/40 dark:bg-error/60"
            >
              Leave and discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
