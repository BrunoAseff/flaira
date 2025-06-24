import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Location09Icon, StatusIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

export default function Journey() {
  const [hasTripFinished, setHasTripFinished] = useState(false);

  const handleTripStatusChange = (checked: boolean) => {
    setHasTripFinished(!checked);
  };

  return (
    <div className="flex flex-col md:flex-row mx-6 md:mx-10 gap-8 h-full py-2">
      <div className="flex flex-col gap-2 items-center justify-center">
        <div className="flex flex-col gap-1 flex-shrink-0">
          <Label className="text-base">From</Label>
          <Input
            disabled={hasTripFinished}
            iconLeft={<HugeiconsIcon icon={StatusIcon} color="currentColor" />}
            type="text"
          />
        </div>
        <div className="flex flex-col gap-1 flex-shrink-0">
          <Label className="text-base">To</Label>
          <Input
            iconLeft={
              <HugeiconsIcon icon={Location09Icon} color="currentColor" />
            }
            type="text"
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="current-trip"
              checked={!hasTripFinished}
              onCheckedChange={handleTripStatusChange}
            />
            <Label htmlFor="current-trip">I am still in this trip.</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
