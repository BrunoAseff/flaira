'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TripConfetti } from './TripConfetti';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface TripCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTrip: () => Promise<{ tripId: string } | null>;
  onSuccess?: () => void;
}

type DialogState = 'loading' | 'success' | 'error';

const LoadingState = () => (
  <div className="text-center space-y-4">
    <div className="flex items-center justify-center py-4">
      <LoadingSpinner />
    </div>
    <p className="text-sm text-foreground/60">Setting up your adventure...</p>
  </div>
);

const SuccessState = ({
  onClose,
  onSeeTrip,
}: {
  onClose: () => void;
  onSeeTrip: () => void;
}) => (
  <div className="text-center space-y-4">
    <div className="mx-auto rounded-full flex items-center justify-center">
      <HugeiconsIcon icon={Tick02Icon} size={38} className="text-foreground" />
    </div>
    <p className="text-foreground/60 px-12">
      Your trip has been created and is ready for your next adventure!
    </p>
    <div className="flex gap-3 pt-4">
      <Button size="sm" variant="outline" onClick={onClose} className="flex-1">
        Close
      </Button>
      <Button size="sm" onClick={onSeeTrip} className="flex-1">
        See Trip
      </Button>
    </div>
  </div>
);

const ErrorState = ({ onClose }: { onClose: () => void }) => (
  <div className="text-center space-y-4">
    <div className="mx-auto rounded-full flex items-center justify-center">
      <HugeiconsIcon icon={Cancel01Icon} size={38} className="text-error" />
    </div>
    <p className="text-foreground/60 px-12">
      Something went wrong while creating your trip. Please try again.
    </p>
    <Button size="sm" onClick={onClose} className="w-full">
      Close
    </Button>
  </div>
);

export function TripCreationDialog({
  open,
  onOpenChange,
  onCreateTrip,
  onSuccess,
}: TripCreationDialogProps) {
  const [state, setState] = useState<DialogState>('loading');
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!open) {
      setState('loading');
      setShowConfetti(false);
      cancelledRef.current = false;
      return;
    }

    cancelledRef.current = false;

    const createTrip = async () => {
      try {
        const result = await onCreateTrip();
        if (cancelledRef.current) return;

        if (result) {
          setState('success');
          setShowConfetti(true);
        } else {
          setState('error');
        }
      } catch (error) {
        if (cancelledRef.current) return;
        console.error('Trip creation failed:', error);
        setState('error');
      }
    };

    createTrip();

    return () => {
      cancelledRef.current = true;
    };
  }, [open]);

  const handleSuccessClose = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  const handleErrorClose = () => {
    onOpenChange(false);
  };

  const handleSeeTrip = () => {
    onSuccess?.();
    router.push('/trips');
    onOpenChange(false);
  };

  const getTitle = () => {
    switch (state) {
      case 'loading':
        return 'Creating your trip...';
      case 'success':
        return 'Trip created successfully!';
      case 'error':
        return 'Failed to create trip';
    }
  };

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return <LoadingState />;
      case 'success':
        return (
          <SuccessState
            onClose={handleSuccessClose}
            onSeeTrip={handleSeeTrip}
          />
        );
      case 'error':
        return <ErrorState onClose={handleErrorClose} />;
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!open && state === 'success') {
      handleSuccessClose();
    } else {
      onOpenChange(open);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-md sm:h-auto max-w-none w-full h-dvh max-h-dvh overflow-y-auto rounded-none p-0 sm:rounded-lg sm:p-6">
          <DialogHeader>
            <DialogTitle>{getTitle()}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">{renderContent()}</div>
        </DialogContent>
      </Dialog>

      <TripConfetti trigger={showConfetti} />
    </>
  );
}
