import { Checkbox } from '@/components/ui/checkbox';
import FileInput from '@/components/ui/file-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RangeDatePicker from '@/components/ui/RangeDatePicker';
import { Textarea } from '@/components/ui/textarea';
import { useDetails, useImages, useTripActions } from '@/stores/trip-store';
import { Tag01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useMemo } from 'react';
import { DateRange } from 'react-day-picker';

export default function Details() {
  const details = useDetails();
  const images = useImages();
  const actions = useTripActions();

  const isCurrentTrip = useMemo(
    () => !details.hasTripFinished,
    [details.hasTripFinished]
  );

  const dateRange = useMemo<DateRange | undefined>(() => {
    const from = details.startDate ?? undefined;
    const to = details.endDate ?? undefined;
    return from || to ? { from, to } : undefined;
  }, [details.startDate, details.endDate]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    const from = range?.from ?? null;
    const to = range?.to ?? null;
    if (details.startDate !== from) actions.setStartDate(from);
    if (details.endDate !== to) actions.setEndDate(to);
  };

  const handleTripStatusChange = (checked: boolean) => {
    actions.setHasTripFinished(!checked);
  };

  return (
    <div className="flex flex-col md:flex-row mx-6 md:mx-10 gap-8 h-[95%] py-2">
      <div className="flex flex-col w-full md:w-[40%] gap-4 h-full md:min-h-0 md:overflow-y-auto p-1">
        <div className="flex flex-col gap-1 px-1 flex-shrink-0">
          <Label className="text-base">Title</Label>
          <Input
            className="w-full max-w-none"
            value={details.title}
            onChange={(e) => actions.setTitle(e.target.value)}
            iconLeft={<HugeiconsIcon icon={Tag01Icon} color="currentColor" />}
            type="text"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-base flex-shrink-0">Description</Label>
          <Textarea
            value={details.description}
            onChange={(e) => actions.setDescription(e.target.value)}
            className="h-48 resize-none"
          />
        </div>
        <div className="flex flex-col gap-1 flex-shrink-0">
          <Label className="text-base">Dates</Label>
          <RangeDatePicker
            value={dateRange}
            onValueChange={handleDateRangeChange}
            placeholder="Select trip dates"
          />
        </div>

        <div className="flex flex-col gap-1 w-full px-1 flex-shrink-0">
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="current-trip"
              checked={isCurrentTrip}
              onCheckedChange={handleTripStatusChange}
            />
            <Label htmlFor="current-trip">I am still on this trip.</Label>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-[60%] gap-1 md:h-full">
        <Label className="text-base flex-shrink-0">Memories</Label>
        <div className="md:flex-1 md:min-h-0 min-h-[400px]">
          <FileInput
            files={images}
            onFilesChange={actions.setImages}
            acceptedTypes="media"
          />
        </div>
      </div>
    </div>
  );
}
