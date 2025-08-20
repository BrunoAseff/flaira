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
import { useState, useMemo, useCallback } from 'react';

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

  const handleCancelExit = useCallback(
    (event?: React.MouseEvent | React.TouchEvent) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      setShowExitWarning(false);
    },
    []
  );

  const handleAlertDialogChange = useCallback(
    (open: boolean) => {
      if (!open && showExitWarning) {
        setShowExitWarning(false);
      }
    },
    [showExitWarning]
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="w-full h-full min-w-full max-w-[1200px] md:min-w-[1000px] md:w-[65%] md:h-[95%] bg-background p-0 flex flex-col overflow-hidden">
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

      <AlertDialog
        open={showExitWarning}
        onOpenChange={handleAlertDialogChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost if you continue. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancelExit}
              onTouchEnd={(e: React.TouchEvent) => {
                e.preventDefault();
                e.stopPropagation();
                handleCancelExit(e);
              }}
            >
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
