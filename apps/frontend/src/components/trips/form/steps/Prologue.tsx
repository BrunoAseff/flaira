import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Prologue() {
  return (
    <>
      <div className="flex mx-12 flex-col gap-4">
        <Label className="text-xl">What is the title of your trip?</Label>
        <Input className="w-full rounded-xl" type="text" />
      </div>
    </>
  );
}
