import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 32, className }: LoadingSpinnerProps) {
  return (
    <LoaderCircle 
      className={cn("animate-spin text-foreground", className)} 
      size={size} 
    />
  );
}