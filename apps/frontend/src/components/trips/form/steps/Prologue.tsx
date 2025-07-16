import FileInput from '@/components/file-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tag01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export default function Prologue() {
  return (
    <div className="flex flex-col md:flex-row mx-6 md:mx-10 gap-8 h-full py-2">
      <div className="flex flex-col w-full md:w-[40%] gap-4 h-full">
        <div className="flex flex-col gap-1 px-1 flex-shrink-0">
          <Label className="text-base">What's the name of this journey?</Label>
          <Input
            className="w-full max-w-none"
            iconLeft={<HugeiconsIcon icon={Tag01Icon} color="currentColor" />}
            type="text"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-h-0">
          <Label className="text-base flex-shrink-0">
            How would you describe this experience?
          </Label>
          <Textarea className="flex-1 min-h-[150px] resize-none" />
        </div>
      </div>
      <div className="flex flex-col w-full md:w-[60%] gap-1 h-full">
        <Label className="text-base flex-shrink-0">
          Add photos or videos that bring it to life
        </Label>
        <div className="flex-1 min-h-0">
          <FileInput />
        </div>
      </div>
    </div>
  );
}
