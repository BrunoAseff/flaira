import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: number | string;
  className?: string;
  ariaLabel?: string;
}

export function LoadingSpinner({
  size = 32,
  className,
  ariaLabel = 'Loading…',
}: LoadingSpinnerProps) {
  return (
    <LoaderCircle
      className={cn('animate-spin text-foreground', className)}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      aria-busy="true"
    />
  );
}
