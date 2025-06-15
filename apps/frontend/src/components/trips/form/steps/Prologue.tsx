import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Prologue() {
  return (
    <>
      <div className="flex mx-12 flex-col gap-4">
        <Label className="text-xl">What is the title of your trip?</Label>
        <Input className="w-full rounded-xl" type="text" />
      </div>
      <div className="w-full flex justify-center gap-8 my-6">
        <Button variant="outline" size="icon">
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            color="currentColor"
            strokeWidth={2}
          />
        </Button>
        <Button variant="outline" size="icon">
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            color="currentColor"
            strokeWidth={2}
          />
        </Button>
      </div>
    </>
  );
}
