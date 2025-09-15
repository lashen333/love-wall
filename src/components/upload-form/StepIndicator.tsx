// src\components\upload-form\StepIndicator.tsx
'use client';

import { CheckCircle } from 'lucide-react';
import type { Step } from './types';

type StepDef = { id: Step; title: string; icon: React.ComponentType<{ className?: string }> };

export default function StepIndicator({
  steps,
  currentStep,
}: {
  steps: readonly StepDef[];
  currentStep: Step;
}) {
  return (
    <div className="mb-8">
      <div className="mx-auto max-w-2xl px-6">
        <div className="flex items-center">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = steps.findIndex((s) => s.id === currentStep) > index;

            return (
              <div key={step.id} className="flex items-center min-w-0">
                <div className="flex flex-col items-center w-24">
                  <div
                    className={[
                      'rounded-full flex items-center justify-center border-2 leading-none select-none',
                      'w-9 h-9 md:w-10 md:h-10 xl:w-9 xl:h-9',
                      isActive
                        ? 'border-pink-600 bg-pink-50'
                        : isCompleted
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-300 bg-gray-50',
                    ].join(' ')}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 xl:w-4 xl:h-4" />
                    ) : (
                      <Icon className="w-4 h-4 md:w-5 md:h-5 xl:w-4 xl:h-4" />
                    )}
                  </div>
                  <span className="mt-2 text-center font-medium truncate text-[10px] md:text-xs xl:text-[10px]">
                    {step.title}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={[
                      'hidden sm:block h-0.5 mx-2 md:mx-4 flex-1',
                      isCompleted ? 'bg-green-600' : 'bg-gray-300',
                    ].join(' ')}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
