import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Backpack03Icon,
  Route03Icon,
  SearchList01Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';

function Step({
  icon,
  isDone,
  isCurrent,
}: {
  icon: IconSvgElement;
  isDone: boolean;
  isCurrent: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center size-12 rounded-full border shrink-0 z-10 shadow-lg',
        isDone || isCurrent
          ? 'bg-foreground text-background border-foreground'
          : 'bg-background text-foreground/60 border-[1px] border-accent'
      )}
    >
      <HugeiconsIcon
        className="size-6"
        icon={icon}
        color="currentColor"
        strokeWidth={1.5}
      />
    </div>
  );
}

export default function FormHeader({ currentStep }: { currentStep: number }) {
  const steps = [
    {
      title: 'Prologue',
      description:
        'Name your adventure and set the scene with photos and words.',
      step: 1,
      icon: Backpack03Icon,
    },
    {
      title: 'Journey',
      description:
        'Plot your route, choose transport, and mark the key moments.',
      step: 2,
      icon: Route03Icon,
    },
    {
      title: 'Companions',
      description: 'Decide who joins the story — privately or out in the open.',
      step: 3,
      icon: UserGroupIcon,
    },
    {
      title: 'Review',
      description:
        'Take one last look. Map it out, feel the vibe, and save it all.',
      step: 4,
      icon: SearchList01Icon,
    },
  ];

  const progressValue = ((currentStep - 1) / (steps.length - 1)) * 100;
  const activeStep = steps[currentStep - 1] || steps[0];

  return (
    <div className="flex mx-6 md:mx-10 flex-col">
      <h1 className="text-2xl sm:text-2xl lg:text-2xl font-semibold">
        {activeStep.title}
      </h1>
      <div> {activeStep.description}</div>
      <div className="relative w-full py-4">
        <Progress
          value={progressValue}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-[calc(100%-5rem)]"
        />
        <div className="flex justify-between items-center w-full">
          {steps.map((stepInfo) => (
            <Step
              key={stepInfo.step}
              icon={stepInfo.icon}
              isDone={currentStep > stepInfo.step}
              isCurrent={currentStep === stepInfo.step}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
