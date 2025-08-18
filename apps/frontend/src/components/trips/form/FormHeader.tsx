import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Backpack03Icon,
  Route03Icon,
  SearchList01Icon,
  Tick01Icon,
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
        'flex items-center justify-center rounded-full border shrink-0 z-10 shadow-lg',
        'size-8 sm:size-10 md:size-11',
        isDone || isCurrent
          ? 'bg-foreground text-background border-foreground'
          : 'bg-background text-foreground/60 border-[1px] border-accent'
      )}
    >
      {isCurrent ? (
        <div className="size-2 sm:size-2.5 md:size-3 bg-white rounded-full" />
      ) : (
        <HugeiconsIcon
          className="size-4 sm:size-5 md:size-6"
          icon={isDone ? Tick01Icon : icon}
          color="currentColor"
          strokeWidth={1.5}
        />
      )}
    </div>
  );
}

export default function FormHeader({ currentStep }: { currentStep: number }) {
  const steps = [
    {
      title: 'Details',
      description:
        'Give your trip a name, write a short intro, and add some photos.',
      step: 1,
      icon: Backpack03Icon,
    },
    {
      title: 'Route',
      description:
        'Set the starting point, stops, destination, and how you got there.',
      step: 2,
      icon: Route03Icon,
    },
    {
      title: 'Travelers',
      description: 'Add people who joined you — it’s optional.',
      step: 3,
      icon: UserGroupIcon,
    },
    {
      title: 'Review',
      description:
        'Double-check everything before saving your trip. All information can be edited later.',
      step: 4,
      icon: SearchList01Icon,
    },
  ];
  const progressValue = ((currentStep - 1) / (steps.length - 1)) * 100;
  const activeStep = steps[currentStep - 1] || steps[0];

  return (
    <div className="flex mx-4 sm:mx-6 md:mx-10 flex-col">
      <h1 className="text-xl sm:text-2xl font-semibold">{activeStep.title}</h1>
      <div className="text-sm sm:text-base text-foreground/80 mb-2">
        {activeStep.description}
      </div>
      <div className="relative w-full py-3 sm:py-4">
        <Progress
          value={progressValue}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 sm:h-2 w-[calc(100%-3rem)] sm:w-[calc(100%-4rem)] md:w-[calc(100%-5rem)]"
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
