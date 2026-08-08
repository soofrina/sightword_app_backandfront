import { CheckIcon } from "@heroicons/react/20/solid";
import { JourneyStep, StepStatus } from "@base/type/lessonJourney";

interface BigStepProps {
  step: JourneyStep;
  idx: number;
  isLast?: boolean;
}

const ProgressStep = ({ step, idx, isLast = false }: BigStepProps) => {
  return (
    <li
      onClick={step.onClick}
      key={`step-${idx}`}
      className='relative pr-8 sm:pr-10'
    >
      {!isLast && (
        <div className='absolute inset-0 flex items-center' aria-hidden='true'>
          <div
            className={`h-0.5 w-full ${
              step.status !== StepStatus.NOT_COMPLETED
                ? "bg-primaryMain"
                : "bg-gray-300"
            }`}
          />
        </div>
      )}
      <div
        className={`relative flex items-center justify-center rounded-full ${
          step.status === StepStatus.NOT_COMPLETED
            ? "bg-gray-300"
            : "bg-primaryMain"
        } whitespace-nowrap
                      ${step.isLarge ? "h-9 w-9" : "h-6 w-6"}`}
      >
        {step.status === StepStatus.COMPLETED && (
          <CheckIcon className='h-3 w-3 text-white' aria-hidden='true' />
        )}
        {step.status !== StepStatus.COMPLETED && (
          <span className='font-semibold text-white'>{step.innerText}</span>
        )}
        <span
          className={`absolute ${
            step.status === StepStatus.NOT_COMPLETED
              ? "text-gray-400"
              : "text-primaryMain"
          } ${
            step.isLarge
              ? "font-semibold text-base -bottom-6"
              : "text-xs -bottom-5"
          } whitespace-nowrap`}
        >
          {step.label}
        </span>
      </div>
    </li>
  );
};

export default ProgressStep;
