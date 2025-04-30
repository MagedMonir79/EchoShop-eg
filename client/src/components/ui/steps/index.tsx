import React, { ReactNode } from "react";
import { 
  CheckCircle2, 
  XCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  icon: ReactNode;
}

interface StepsProps {
  steps: Step[];
  currentStep: string;
  isRejected?: boolean;
  className?: string;
}

export function Steps({ 
  steps,
  currentStep,
  isRejected = false,
  className 
}: StepsProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        {/* Connected timeline */}
        <div 
          className="absolute left-5 top-0 h-full w-px bg-border"
          aria-hidden="true"
        />
        
        <ul className="space-y-2">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const isFuture = index > currentStepIndex;
            const isInvalid = isRejected && index >= currentStepIndex;
            
            return (
              <li key={step.id} className="relative">
                <div className="flex items-start gap-4 py-2">
                  <div className="flex flex-col items-center">
                    <div 
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors",
                        isActive && !isRejected && "border-primary bg-primary text-primary-foreground",
                        isCompleted && "border-primary bg-primary text-primary-foreground",
                        isFuture && "border-border bg-background text-foreground/60",
                        isInvalid && "border-destructive bg-destructive text-destructive-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isRejected && isActive ? (
                        <XCircle className="h-5 w-5" />
                      ) : (
                        <span className="h-5 w-5 flex items-center justify-center">
                          {step.icon}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-1.5">
                    <h3 
                      className={cn(
                        "text-sm font-medium",
                        isActive && !isRejected && "text-foreground",
                        isCompleted && "text-foreground",
                        isFuture && "text-muted-foreground",
                        isInvalid && "text-destructive"
                      )}
                    >
                      {step.title}
                    </h3>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}