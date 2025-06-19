import { useState } from "react";
import FormHeader from "./FormHeader";
import Companions from "./steps/Companions";
import Journey from "./steps/Journey";
import Prologue from "./steps/Prologue";
import Review from "./steps/Review";

import { Button } from "@/components/ui/button";

export default function AddTripForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Prologue />;
      case 2:
        return <Journey />;
      case 3:
        return <Companions />;
      case 4:
        return <Review />;
      default:
        return <Prologue />;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex flex-col max-h-full h-full overflow-auto">
      <FormHeader currentStep={currentStep} />

      <div className="flex items-center justify-center w-full">
        {renderStep()}
      </div>

      <div className="flex justify-end mr-10 mb-2 gap-4 mt-auto">
        <Button
          onClick={handlePrevious}
          variant="outline"
          size="sm"
          disabled={isFirstStep}
        >
          Previous
        </Button>
        <Button onClick={handleNext} size="sm" disabled={isLastStep}>
          {isLastStep ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  );
}
