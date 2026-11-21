"use client";

import React, { useState } from "react";
import Link from "next/link";

export type StepStatus = "pending" | "processing" | "completed" | "failed" | "skipped";

export interface WorkflowExecutionStep {
  id: string;
  number: number;
  title: string;
  description: string;
  status: StepStatus;
  duration?: string;
  details?: string;
  errorMessage?: string;
}

export interface AnimatedWorkflowExecutionProps {
  steps?: WorkflowExecutionStep[];
  currentStepIndex?: number;
  title?: string;
  processTitle?: string;
  overallStatus?: "idle" | "running" | "completed" | "failed";
  executionResult?: {
    id: string;
    duration?: string;
    trelloUrl?: string;
    trelloCardTitle?: string;
    telegramStatus?: string;
    completedAt?: string;
  } | null;
  onStepClick?: (step: WorkflowExecutionStep, index: number) => void;
  interactiveDemo?: boolean;
  className?: string;
}

const DEFAULT_STEPS: WorkflowExecutionStep[] = [
  {
    id: "step-1",
    number: 1,
    title: "Process Validation",
    description: "Validating the submitted business process input & parameters",
    status: "completed",
    duration: "180ms",
    details: "Verified title, scope constraints, and required operations fields.",
  },
  {
    id: "step-2",
    number: 2,
    title: "AI Analysis",
    description: "Analyzing the business process using Gemini 2.0 Flash",
    status: "completed",
    duration: "1.2s",
    details: "Extracted 4 operational stages and 3 friction bottlenecks.",
  },
  {
    id: "step-3",
    number: 3,
    title: "Recommendation Generation",
    description: "Generating automation recommendations & ROI estimations",
    status: "completed",
    duration: "420ms",
    details: "Calculated 2–3 hrs/week savings with high feasibility score.",
  },
  {
    id: "step-4",
    number: 4,
    title: "Workflow Generation",
    description: "Preparing the allowlisted automation workflow definition",
    status: "completed",
    duration: "310ms",
    details: "Structured steps locked strictly to allowlisted integrations.",
  },
  {
    id: "step-5",
    number: 5,
    title: "Approval",
    description: "Reviewing and approving the workflow (Elias Chane)",
    status: "pending",
    duration: "Awaiting review",
    details: "FR-05 Zero-Trust approval required by Operations Manager Elias Chane.",
  },
  {
    id: "step-6",
    number: 6,
    title: "Automation Execution",
    description: "Executing the approved actions (Trello & Telegram)",
    status: "pending",
    duration: "Pending",
    details: "Execution paused. External actions require explicit human authorization.",
  },
  {
    id: "step-7",
    number: 7,
    title: "Completion",
    description: "Displaying the final execution result and audit log",
    status: "pending",
    duration: "Pending",
    details: "Execution not complete. Awaiting human gate signoff and external dispatch.",
  },
];

export function AnimatedWorkflowExecution({
  steps: controlledSteps,
  title = "Workflow Execution Pipeline",
  processTitle = "Operational Process",
  overallStatus = "idle",
  executionResult,
  onStepClick,
  interactiveDemo = false,
  className = "",
}: AnimatedWorkflowExecutionProps) {
  const [internalSteps, setInternalSteps] = useState<WorkflowExecutionStep[]>(
    controlledSteps || DEFAULT_STEPS
  );
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  // Use controlled steps if provided, otherwise internal
  const steps = controlledSteps || internalSteps;

  // Calculate stats
  const completedCount = steps.filter((s) => s.status === "completed").length;
  const processingCount = steps.filter((s) => s.status === "processing").length;
  const failedCount = steps.filter((s) => s.status === "failed").length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  // Determine current active processing step
  const activeStep = steps.find((s) => s.status === "processing") || steps.find((s) => s.status === "failed");
  const selectedStep = steps.find((s) => s.id === selectedStepId) || activeStep || steps[steps.length - 1];

  // Helper icons for step states in light green theme
  const renderStatusIcon = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return (
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center transition-all duration-200 shadow-xs ring-4 ring-emerald-100 dark:ring-emerald-950/60">
            <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "processing":
        return (
          <div className="relative w-7 h-7 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full border-2 border-emerald-200 dark:border-emerald-800 border-t-emerald-500 dark:border-t-emerald-400 animate-spin bg-white dark:bg-slate-900 ring-4 ring-emerald-100/80 dark:ring-emerald-950/40" />
            <span className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        );
      case "failed":
        return (
          <div className="w-7 h-7 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-900 ring-4 ring-rose-50 dark:ring-rose-950/20">
            <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case "skipped":
        return (
          <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-medium">—</span>
          </div>
        );
      default: // pending
        return (
          <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          </div>
        );
    }
  };

  // Step specific domain icon
  const getStepDomainIcon = (num: number) => {
    switch (num) {
      case 1: // Validation
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 2: // AI Analysis
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 3: // Recommendations
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 4: // Workflow Generation
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 5: // Approval
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 6: // Execution
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default: // Completion
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // State simulator for interactive demo testing
  const advanceDemoStep = () => {
    setInternalSteps((prev) => {
      const next = [...prev];
      const processingIdx = next.findIndex((s) => s.status === "processing");
      if (processingIdx !== -1) {
        next[processingIdx].status = "completed";
        if (processingIdx + 1 < next.length) {
          next[processingIdx + 1].status = "processing";
        }
      } else {
        // Reset all to pending except first
        next.forEach((s, idx) => {
          s.status = idx === 0 ? "processing" : "pending";
        });
      }
      return next;
    });
  };

  return (
    <div className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors ${className}`}>
      {/* Top Header & Execution Bar */}
      <div className="p-5 sm:p-6 border-b border-emerald-100/70 dark:border-emerald-950/50 bg-emerald-50/20 dark:bg-emerald-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 dark:bg-emerald-500 text-white px-2 py-0.5 rounded shadow-2xs">
                Live Automation Engine
              </span>
              {overallStatus === "completed" || progressPercent === 100 ? (
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300/80 dark:border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <span className="font-bold">✓</span> All Steps Completed
                </span>
              ) : failedCount > 0 ? (
                <span className="text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span>✕</span> Execution Blocked
                </span>
              ) : (
                <span className="text-xs font-medium text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Running Automation
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Process: <span className="font-semibold text-slate-700 dark:text-slate-300">{processTitle}</span> · Managed by Elias Chane
            </p>
          </div>

          {/* Right Metrics / Quick Actions */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                {completedCount} of {steps.length} steps completed
              </div>
              <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                {progressPercent}% completed
              </div>
            </div>

            {interactiveDemo && (
              <button
                type="button"
                onClick={advanceDemoStep}
                className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg shadow-sm transition-colors"
              >
                Advance Step →
              </button>
            )}
          </div>
        </div>

        {/* Global Progress Bar - Light green theme */}
        <div className="w-full bg-emerald-100/70 dark:bg-emerald-950/40 h-2 rounded-full mt-4 overflow-hidden border border-emerald-200/60 dark:border-emerald-900/50">
          <div
            className={`h-full transition-all duration-300 ease-out rounded-full ${
              failedCount > 0
                ? "bg-rose-500"
                : "bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-500 shadow-xs"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Execution Canvas Pipeline */}
      <div className="p-5 sm:p-6 overflow-x-auto">
        <div className="min-w-[840px] flex items-start justify-between relative py-2">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            const isSelected = selectedStep?.id === step.id;
            const isProcessing = step.status === "processing";
            const isCompleted = step.status === "completed";
            const isFailed = step.status === "failed";

            return (
              <React.Fragment key={step.id}>
                {/* Node Box */}
                <div
                  onClick={() => {
                    setSelectedStepId(step.id);
                    onStepClick?.(step, idx);
                  }}
                  className={`flex flex-col items-center text-center cursor-pointer transition-all duration-200 group w-32 shrink-0 ${
                    isSelected ? "scale-102" : "hover:opacity-90"
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div className="relative mb-2">
                    {renderStatusIcon(step.status)}
                    <div
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] font-bold shadow-2xs ${
                        isCompleted
                          ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : isProcessing
                          ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {step.number}
                    </div>
                  </div>

                  {/* Title & Domain Icon */}
                  <div className="space-y-1 w-full px-1">
                    <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                      <span
                        className={
                          isCompleted || isProcessing
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-400 dark:text-slate-500"
                        }
                      >
                        {getStepDomainIcon(step.number)}
                      </span>
                      <span className="truncate">{step.title}</span>
                    </div>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-2">
                      {step.description}
                    </p>

                    {/* Step State Badge - Light green theme */}
                    <div className="pt-1">
                      {isProcessing ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Processing
                        </span>
                      ) : isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
                          <span className="font-bold">✓</span> Done
                        </span>
                      ) : isFailed ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                          Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] text-slate-400 dark:text-slate-500">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Connecting Directional Arrow between Nodes - Light green flow lines */}
                {!isLast && (
                  <div className="flex-1 flex items-center justify-center pt-2.5 px-1 relative">
                    <div className="w-full flex items-center">
                      {/* Connection Line */}
                      <div
                        className={`h-0.5 w-full transition-colors duration-300 ${
                          isCompleted
                            ? "bg-emerald-500 dark:bg-emerald-400 shadow-2xs"
                            : isProcessing
                            ? "bg-emerald-300 dark:bg-emerald-600 animate-pulse"
                            : "bg-slate-200 dark:bg-slate-800"
                        }`}
                      />
                      {/* Directional Arrow Head */}
                      <svg
                        className={`w-3.5 h-3.5 -ml-1.5 shrink-0 transition-colors duration-300 ${
                          isCompleted
                            ? "text-emerald-500 dark:text-emerald-400"
                            : isProcessing
                            ? "text-emerald-400 dark:text-emerald-500"
                            : "text-slate-200 dark:text-slate-800"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Step Inspector Card - Light green tinted background */}
      {selectedStep && (
        <div className="p-4 sm:p-5 bg-emerald-50/25 dark:bg-emerald-950/15 border-t border-emerald-100/70 dark:border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{renderStatusIcon(selectedStep.status)}</div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Step {selectedStep.number}: {selectedStep.title}
                </h4>
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded font-mono font-medium">
                  {selectedStep.duration || "Active"}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {selectedStep.details || selectedStep.description}
              </p>
            </div>
          </div>

          {/* Quick link if Trello or Telegram generated */}
          {executionResult?.trelloUrl && (
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={executionResult.trelloUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
              >
                <span>View Trello Card</span>
                <span>↗</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Final Success or Failure Banner - Light green themed banner */}
      {progressPercent === 100 && (
        <div className="p-4 bg-emerald-50/90 dark:bg-emerald-950/40 border-t border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-2xs">
              ✓
            </span>
            <span>Workflow successfully executed across Trello, Telegram & Supabase</span>
          </div>

          <div className="flex items-center gap-3">
            {executionResult?.id && (
              <Link
                href={`/executions/${executionResult.id}`}
                className="font-semibold text-emerald-800 dark:text-emerald-300 underline hover:text-emerald-950 dark:hover:text-emerald-100 transition-colors"
              >
                Inspect Audit Record →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnimatedWorkflowExecution;
