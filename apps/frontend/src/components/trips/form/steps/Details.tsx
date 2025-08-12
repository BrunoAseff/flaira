import { Checkbox } from '@/components/ui/checkbox';
import FileInput from '@/components/ui/file-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RangeDatePicker from '@/components/ui/RangeDatePicker';
import { Textarea } from '@/components/ui/textarea';
import { useDetails, useTripActions } from '@/stores/trip-store';
import { Tag01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { DateRange } from 'react-day-picker';

export default function Details() {
  const details = useDetails();
  const actions = useTripActions();

  const dateRange: DateRange | undefined = {
    from: details.startDate || undefined,
    to: details.endDate || undefined,
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    actions.setStartDate(range?.from || null);
    actions.setEndDate(range?.to || null);
  };

  const handleTripStatusChange = (checked: boolean) => {
    actions.setHasTripFinished(!checked);
  };

  return (
    <div className="flex flex-col md:flex-row mx-6 md:mx-10 gap-8 h-[95%] py-2">
      <div className="flex flex-col w-full md:w-[40%] gap-4 h-full">
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
        <div className="flex flex-col gap-1 flex-1 min-h-0">
          <Label className="text-base flex-shrink-0">Description</Label>
          <Textarea
            value={details.description}
            onChange={(e) => actions.setDescription(e.target.value)}
            className="flex-1 min-h-[150px] resize-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-base">Dates</Label>
          <RangeDatePicker
            value={dateRange}
            onValueChange={handleDateRangeChange}
            placeholder="Select trip dates"
          />
        </div>

        <div className="flex flex-col gap-1 w-full px-1">
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="current-trip"
              checked={!details.hasTripFinished}
              onCheckedChange={handleTripStatusChange}
            />
            <Label htmlFor="current-trip">I am still on this trip.</Label>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full md:w-[60%] gap-1 h-full">
        <Label className="text-base flex-shrink-0">Memories</Label>
        <div className="flex-1 min-h-0">
          <FileInput />
        </div>
      </div>
    </div>
  );
}
