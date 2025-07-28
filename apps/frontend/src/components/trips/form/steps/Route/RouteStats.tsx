'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Clock01Icon, RouteIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Route } from '@/types/route';
import { formatDistance, formatTravelDuration } from '@/utils/formatters';

interface RouteStatsProps {
  route?: Route | null;
}

export default function RouteStats({ route }: RouteStatsProps) {
  if (!route) return null;

  return (
    <div className="flex justify-center items-center gap-8 py-2">
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-2 text-sm text-foreground/80 cursor-default">
            <HugeiconsIcon icon={RouteIcon} size={20} />
            <span>{formatDistance(route.totalDistance)}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Total estimated trip distance</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-2 text-sm text-foreground/80 cursor-default">
            <HugeiconsIcon icon={Clock01Icon} size={20} />
            <span>{formatTravelDuration(route.totalDuration)}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Total estimated trip duration</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
