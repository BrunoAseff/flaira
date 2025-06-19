import FileInput from "@/components/file-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Prologue() {
  return (
    <>
      <div className="flex flex-col w-full mx-6 md:mx-10 gap-10">
        <div className="flex flex-col md:flex-row w-full justify-between gap-4">
          <div className="flex flex-col w-full gap-1">
            <Label className="text-base">
              What’s the name of this journey?
            </Label>
            <Input className=" rounded-xl" type="text" />
          </div>
          <div className="flex flex-col w-full gap-1">
            <Label className="text-base">
              How would you describe this experience?
            </Label>
            <Textarea className="rounded-xl max-w-[32rem]" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-base">
            Add photos or videos that bring it to life
          </Label>
          <FileInput />
        </div>
      </div>
    </>
  );
}
