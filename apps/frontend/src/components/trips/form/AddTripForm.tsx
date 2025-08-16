import { useState, useCallback, useEffect, useMemo } from 'react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  useDetails,
  useRoute,
  useTravelers,
} from '@/stores/trip-store';
import {
  tripDetailsSchema,
  tripRouteSchema,
  emailSchema,
} from '@/schemas/trip';

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

  const details = useDetails();
  const route = useRoute();
  const travelers = useTravelers();

  const detailsValidation = useMemo(() => {
    const result = tripDetailsSchema.safeParse(details);
    return {
      isValid: result.success,
      errors: result.success
        ? []
        : result.error.issues.map((issue) => issue.message),
    };
  }, [details]);

  const routeValidation = useMemo(() => {
    const result = tripRouteSchema.safeParse(route);
    return {
      isValid: result.success,
      errors: result.success
        ? []
        : result.error.issues.map((issue) => issue.message),
    };
  }, [route]);

  const travelersValidation = useMemo(() => {
    if (travelers.users.length === 0) {
      return { isValid: true, errors: [] };
    }

    const missingEmails = travelers.users.filter(
      (user) => !user.email.trim()
    );
    if (missingEmails.length > 0) {
      return {
        isValid: false,
        errors: ['All travelers must have an email address'],
      };
    }

    const hasInvalidEmails = travelers.users.some((user) => {
      return user.email.trim() && !emailSchema.safeParse(user.email).success;
    });

    if (hasInvalidEmails) {
      return { isValid: false, errors: [] };
    }

    return { isValid: true, errors: [] };
  }, [travelers]);

  const currentStepValidation = useMemo(() => {
    switch (currentStep) {
      case 1:
        return detailsValidation;
      case 2:
        return routeValidation;
      case 3:
        return travelersValidation;
      case 4:
        return { isValid: true, errors: [] };
      default:
        return { isValid: false, errors: [] };
    }
  }, [currentStep, detailsValidation, routeValidation, travelersValidation]);

  const { isValid, errors } = currentStepValidation;

  const tooltipContent = useMemo(() => {
    if (isValid || isLastStep || errors.length === 0) {
      return null;
    }

    return (
      <div className="space-y-1">
        <p className="font-medium">Required fields missing:</p>
        <ul className="list-disc list-inside space-y-0.5">
          {errors.map((error: string, index: number) => (
            <li key={index} className="text-sm">
              {error}
            </li>
          ))}
        </ul>
      </div>
    );
  }, [isValid, isLastStep, errors]);

  return (
    <TooltipProvider>
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

          {tooltipContent ? (
            <Tooltip>
              <TooltipTrigger>
                <span>
                  <Button
                    onClick={handleNext}
                    size="sm"
                    disabled={isLastStep || (!isValid && !isLastStep)}
                  >
                    {isLastStep ? 'Complete' : 'Next'}
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>{tooltipContent}</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              onClick={handleNext}
              size="sm"
              disabled={isLastStep || (!isValid && !isLastStep)}
            >
              {isLastStep ? 'Complete' : 'Next'}
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
