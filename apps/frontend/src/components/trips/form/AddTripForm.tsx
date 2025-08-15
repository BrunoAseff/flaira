import { useState, useCallback, useEffect } from 'react';
import FormHeader from './FormHeader';
import Travelers from './steps/Travelers';
import Details from './steps/Details';
import Review from './steps/Review';
import Route from './steps/Route/Route';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

export default function AddTripForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [api, setApi] = useState<CarouselApi>();
  const totalSteps = 4;

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      api?.scrollNext();
    }
  }, [api, currentStep, totalSteps]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      api?.scrollPrev();
    }
  }, [api, currentStep]);

  useEffect(() => {
    if (!api) return;
    const update = () => setCurrentStep(api.selectedScrollSnap() + 1);
    update();
    api.on('select', update);
    api.on('reInit', update);
    return () => {
      api.off('select', update);
      api.off('reInit', update);
    };
  }, [api]);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex flex-col h-full overflow-auto max-h-full">
      <div className="flex-shrink-0">
        <FormHeader currentStep={currentStep} />
      </div>

      <div className="flex-1 min-h-0">
        <Carousel
          setApi={setApi}
          opts={{ watchDrag: false }}
          className="h-full"
        >
          <CarouselContent className="h-full">
            <CarouselItem className="h-full overflow-auto">
              <Details />
            </CarouselItem>
            <CarouselItem className="h-full overflow-auto">
              <Route />
            </CarouselItem>
            <CarouselItem className="h-full overflow-auto">
              <Travelers />
            </CarouselItem>
            <CarouselItem className="h-full overflow-auto">
              <Review />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>

      <div className="flex justify-end mr-10 gap-4 flex-shrink-0 pt-4 pb-2">
        <Button
          onClick={handlePrevious}
          variant="outline"
          size="sm"
          disabled={isFirstStep}
        >
          Previous
        </Button>
        <Button onClick={handleNext} size="sm" disabled={isLastStep}>
          {isLastStep ? 'Complete' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
