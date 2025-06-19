import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Backpack03Icon,
  Route03Icon,
  SearchList01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

function Step({
  icon,
  isDone,
  currentStep,
}: {
  icon: IconSvgElement;
  isDone: boolean;
  currentStep: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center size-12 rounded-full border-1 shrink-0 z-10",
        isDone
          ? "bg-foreground text-background border-foreground"
          : "bg-background text-foreground  border-muted",
        currentStep ? "bg-muted" : "",
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

export default function FormHeader() {
  const steps = [
    {
      title: "Prologue",
      description: "",
      step: 1,
      icon: Backpack03Icon,
      isDone: true,
    },
    {
      title: "Journey",
      description: "",
      step: 2,
      icon: Route03Icon,
      isDone: false,
    },
    {
      title: "Companions",
      description: "",
      step: 3,
      icon: UserGroupIcon,
      isDone: false,
    },
    {
      title: "Review",
      description: "",
      step: 4,
      icon: SearchList01Icon,
      isDone: false,
    },
  ];

  const completedStepsCount = steps.filter((step) => step.isDone).length;
  const totalSegments = steps.length > 1 ? steps.length - 1 : 0;
  const completedSegments = Math.max(0, completedStepsCount);
  const progressValue =
    totalSegments > 0 ? (completedSegments / totalSegments) * 100 : 0;

  return (
    <div className="flex mx-1 sm:mx-2 lg:mx-12 mb-12 flex-col">
      <h1 className="text-2xl sm:text-2xl lg:text-2xl font-semibold">
        {steps[completedStepsCount].title}
      </h1>
      <div> {steps[completedStepsCount].description}</div>
      <div className="relative w-full py-4">
        <Progress
          value={progressValue}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-[calc(100%-5rem)]"
        />
        <div className="flex justify-between items-center w-full">
          {steps.map((step, index) => (
            <Step
              key={step.step}
              icon={step.icon}
              isDone={step.isDone}
              currentStep={index + 1 === 2}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
