import { WizardStep } from '@/types/wizard';

interface ProgressIndicatorProps {
  steps: WizardStep[];
  currentStep: WizardStep;
  labels: Record<WizardStep, string>;
}

export default function ProgressIndicator({ steps, currentStep, labels }: ProgressIndicatorProps) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li
              key={step}
              className={`flex items-center ${index !== steps.length - 1 ? 'flex-1' : ''}`}
            >
              <div className="flex items-center">
                <span
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full
                    ${isComplete ? 'bg-indigo-600 text-white' : ''}
                    ${isCurrent ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : ''}
                    ${!isComplete && !isCurrent ? 'bg-gray-200 text-gray-600' : ''}
                  `}
                >
                  {isComplete ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </span>
                <span
                  className={`
                    ml-3 text-sm font-medium
                    ${isCurrent ? 'text-indigo-600' : 'text-gray-900'}
                  `}
                >
                  {labels[step]}
                </span>
              </div>
              {index !== steps.length - 1 && (
                <div className="flex-1 ml-6">
                  <div
                    className={`
                      h-0.5 w-full
                      ${isComplete ? 'bg-indigo-600' : 'bg-gray-200'}
                    `}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}