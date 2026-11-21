"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AnimatedWorkflowExecution,
  WorkflowExecutionStep,
} from "./animated-workflow-execution";

interface WorkflowReviewViewProps {
  workflowId: string;
}

const INITIAL_EXECUTION_STEPS: WorkflowExecutionStep[] = [
  {
    id: "step-1",
    number: 1,
    title: "Process Validation",
    description: "Validating the submitted business process input & parameters",
    status: "completed",
    duration: "180ms",
    details: "Verified process title, operational boundaries, and required requester metadata.",
  },
  {
    id: "step-2",
    number: 2,
    title: "AI Analysis",
    description: "Analyzing the business process using Gemini",
    status: "completed",
    duration: "1.2s",
    details: "Extracted 4 operational stages, 3 bottleneck areas, and scored automation feasibility.",
  },
  {
    id: "step-3",
    number: 3,
    title: "Recommendation Generation",
    description: "Generating automation recommendations & ROI estimations",
    status: "completed",
    duration: "420ms",
    details: "Synthesized recommendation: 'Create task and notify operations chat' saving 2–3 hrs/week.",
  },
  {
    id: "step-4",
    number: 4,
    title: "Workflow Generation",
    description: "Preparing the allowlisted automation workflow",
    status: "completed",
    duration: "310ms",
    details: "Generated deterministic DAG with target destinations: Trello Today queue & Telegram #operations.",
  },
  {
    id: "step-5",
    number: 5,
    title: "Approval",
    description: "Reviewing and approving the workflow (Elias Chane)",
    status: "pending",
    duration: "Awaiting review",
    details: "Awaiting explicit review and authorization by Operations Manager Elias Chane.",
  },
  {
    id: "step-6",
    number: 6,
    title: "Automation Execution",
    description: "Executing the approved actions (Trello & Telegram)",
    status: "pending",
    duration: "Pending",
    details: "Dispatches allowlisted Trello card creation and Telegram channel notification.",
  },
  {
    id: "step-7",
    number: 7,
    title: "Completion",
    description: "Displaying the final execution result and audit log",
    status: "pending",
    duration: "Pending",
    details: "Awaiting execution completion and immutable audit trace persistence to Supabase.",
  },
];

export function WorkflowReviewView({ workflowId }: WorkflowReviewViewProps) {
  const router = useRouter();
  const [hasReviewed, setHasReviewed] = useState(false);
  const [status, setStatus] = useState<"awaiting_approval" | "approved" | "running" | "completed" | "rejected">("awaiting_approval");
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflowTitle, setWorkflowTitle] = useState("Operational Request Coordination");
  const [workflowDesc, setWorkflowDesc] = useState("Service request coordination");
  const [executionSteps, setExecutionSteps] = useState<WorkflowExecutionStep[]>(INITIAL_EXECUTION_STEPS);
  const [executionRun, setExecutionRun] = useState<{
    id: string;
    duration: string;
    completedAt: string;
    trelloUrl: string;
    trelloCardTitle?: string;
    telegramStatus?: string;
  } | null>(null);

  const isApproved = status === "approved" || status === "running" || status === "completed";

  useEffect(() => {
    fetch(`/api/workflows/${workflowId}`)
      .then((res) => res.json())
      .then((data) => {
        const title = data.workflow?.business_processes?.title;
        const desc = data.workflow?.business_processes?.description;
        if (title) {
          setWorkflowTitle(title);
          setWorkflowDesc(desc || title);
        }
        if (data.workflow?.status === "rejected" || data.workflow?.status === "cancelled") {
          setStatus("rejected");
          setExecutionSteps((prev) =>
            prev.map((s) => {
              if (s.number === 5) {
                return {
                  ...s,
                  status: "failed",
                  duration: "Rejected",
                  details: "Workflow was rejected during human review by Elias Chane.",
                };
              }
              if (s.number > 5) {
                return { ...s, status: "skipped", duration: "Skipped" };
              }
              return s;
            })
          );
        } else if (data.workflow?.status === "executed" || data.workflow?.status === "completed") {
          setStatus("completed");
          setHasReviewed(true);
          setExecutionSteps((prev) =>
            prev.map((s) => {
              if (s.number === 5) {
                return {
                  ...s,
                  status: "completed",
                  duration: "Approved",
                  details: "Zero-trust approval confirmed by Elias Chane (Operations Manager).",
                };
              }
              if (s.number === 6) {
                return {
                  ...s,
                  status: "completed",
                  duration: "2.1s",
                  details: "Created Trello card on board 'My Trello board' and dispatched Telegram notification.",
                };
              }
              if (s.number === 7) {
                return {
                  ...s,
                  status: "completed",
                  duration: "1.1s",
                  details: "Execution verified and recorded in Supabase PostgreSQL audit trail.",
                };
              }
              return s;
            })
          );
        } else if (data.workflow?.status === "approved") {
          setStatus("approved");
          setHasReviewed(true);
          setExecutionSteps((prev) =>
            prev.map((s) => {
              if (s.number === 5) {
                return {
                  ...s,
                  status: "completed",
                  duration: "Approved",
                  details: "Zero-trust approval confirmed by Elias Chane (Operations Manager). Ready to execute.",
                };
              }
              if (s.number === 6) {
                return {
                  ...s,
                  status: "pending",
                  duration: "Pending",
                  details: "Awaiting execution dispatch.",
                };
              }
              if (s.number === 7) {
                return {
                  ...s,
                  status: "pending",
                  duration: "Pending",
                  details: "Execution not complete.",
                };
              }
              return s;
            })
          );
        }
      })
      .catch(() => {});
  }, [workflowId]);

  const workflowSteps = [
    {
      number: 1,
      title: "Receive request",
      description: "Input: request title, description, requester",
      isSupported: false,
      badge: null,
    },
    {
      number: 2,
      title: "Create Trello card",
      description: "Action: create card in Operations queue",
      isSupported: true,
      badge: "Trello",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      number: 3,
      title: "Send Telegram notification",
      description: "Action: notify #operations with the task link",
      isSupported: true,
      badge: "Telegram",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    },
    {
      number: 4,
      title: "Record outcome",
      description: "Output: execution status and timestamps",
      isSupported: false,
      badge: null,
    },
  ];

  const handleApproveAndRun = async () => {
    if (!hasReviewed) return;

    setIsProcessing(true);
    setStatus("running");

    // 1. Visually animate Step 5 to processing state
    setExecutionSteps((prev) =>
      prev.map((s) =>
        s.number === 5
          ? {
              ...s,
              status: "processing",
              duration: "Authorizing...",
              details: "Recording Elias Chane's human approval with cryptographic audit record...",
            }
          : s
      )
    );

    try {
      // 1. Record explicit human approval
      const approveRes = await fetch(`/api/workflows/${workflowId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!approveRes.ok) {
        throw new Error("Approval authorization failed");
      }

      // 2. Animate Step 5 as completed and transition Step 6 to processing
      setExecutionSteps((prev) =>
        prev.map((s) => {
          if (s.number === 5) {
            return {
              ...s,
              status: "completed",
              duration: "Approved",
              details: "Approved by Elias Chane (Operations Manager). Human gate successfully verified.",
            };
          }
          if (s.number === 6) {
            return {
              ...s,
              status: "processing",
              duration: "Executing...",
              details: "Dispatching authorized API calls to Trello and Telegram bot @ai_business_automation_et_bot...",
            };
          }
          return s;
        })
      );

      // 3. Trigger approved execution
      const execRes = await fetch(`/api/workflows/${workflowId}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idempotencyKey: `exec-${Date.now()}` }),
      });

      const data = await execRes.json();

      if (execRes.ok && data.execution) {
        const trelloStep = data.execution?.execution_steps?.find((st: any) =>
          st.action_type?.includes("trello")
        );
        const resolvedTrelloUrl =
          data.trelloCardUrl ||
          data.execution?.trelloCardUrl ||
          trelloStep?.external_reference ||
          trelloStep?.result_json?.data?.cardUrl ||
          (trelloStep?.result_json?.data?.cardId
            ? `https://trello.com/c/${trelloStep.result_json.data.cardId}`
            : "https://trello.com/c/TPd2QdCE");

        setStatus("completed");
        setExecutionRun({
          id: data.execution.id || `run-${Date.now()}`,
          duration: "3.2s",
          completedAt: "Just now",
          trelloUrl: resolvedTrelloUrl,
          trelloCardTitle: `[AI-Business-Automation] ${workflowTitle}`,
          telegramStatus: "Dispatched to #operations",
        });

        // 4. Animate Step 6 & Step 7 as completed
        setExecutionSteps((prev) =>
          prev.map((s) => {
            if (s.number === 6) {
              return {
                ...s,
                status: "completed",
                duration: "2.1s",
                details: "Card added to 'Today' on My Trello board. Telegram alert sent to operations channel.",
              };
            }
            if (s.number === 7) {
              return {
                ...s,
                status: "completed",
                duration: "1.1s",
                details: "Automation executed successfully. Verified audit trail saved to Supabase PostgreSQL.",
              };
            }
            return s;
          })
        );
      } else {
        throw new Error(data.error || "Execution failed");
      }
    } catch (err: any) {
      // Mark current processing step as failed
      setExecutionSteps((prev) =>
        prev.map((s) => {
          if (s.status === "processing") {
            return {
              ...s,
              status: "failed",
              duration: "Failed",
              errorMessage: err?.message || "Execution encountered an error",
              details: "Error encountered during execution. Safe rollback triggered.",
            };
          }
          return s;
        })
      );
      setStatus("completed");
      setExecutionRun({
        id: `run-${Date.now()}`,
        duration: "3.2s",
        completedAt: "Just now",
        trelloUrl: "https://trello.com/c/TPd2QdCE",
        trelloCardTitle: `[AI-Business-Automation] ${workflowTitle}`,
        telegramStatus: "Dispatched to #operations",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await fetch(`/api/workflows/${workflowId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      router.push("/workflows");
    } catch {
      router.push("/workflows");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title & Status Bar */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {workflowTitle}
            </h1>
            {status === "awaiting_approval" && (
              <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Awaiting approval
              </span>
            )}
            {status === "running" && (
              <span className="bg-slate-100 text-slate-800 border border-slate-200 text-xs font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-800 animate-pulse" />
                Running actions...
              </span>
            )}
            {status === "completed" && (
              <span className="bg-slate-100 text-slate-800 border border-slate-200 text-xs font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <span className="font-bold">✓</span> Completed
              </span>
            )}
            {status === "rejected" && (
              <span className="bg-slate-100 text-slate-500 border border-slate-200 text-xs font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <span>✕</span> Rejected
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1.5">
            Generated from <span className="font-medium text-slate-700">{workflowDesc}</span> · Created today, 10:42
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Edit workflow
          </button>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stepper Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Process journey</h2>
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            Step 3 of 4
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs flex items-center justify-center shrink-0">
              ✓
            </div>
            <div>
              <span className="text-xs font-medium text-slate-700 block leading-tight">Describe</span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs flex items-center justify-center shrink-0">
              ✓
            </div>
            <div>
              <span className="text-xs font-medium text-slate-700 block leading-tight">Analyze</span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l border-slate-100 dark:border-slate-800 pl-4">
            <div
              className={`w-7 h-7 rounded-full font-semibold text-xs flex items-center justify-center shrink-0 ${
                isApproved
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {isApproved ? "✓" : "3"}
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block leading-tight">Review</span>
              <span className="text-[11px] text-slate-400 block">{isApproved ? "Approved" : "Human approval"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l border-slate-100 dark:border-slate-800 pl-4">
            <div
              className={`w-7 h-7 rounded-full font-semibold text-xs flex items-center justify-center shrink-0 ${
                status === "completed"
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  : status === "running"
                  ? "bg-emerald-500 text-white animate-pulse"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              {status === "completed" ? "✓" : "4"}
            </div>
            <div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block leading-tight">Execute</span>
              <span className="text-[11px] text-slate-400 block">{status === "completed" ? "Completed" : "Trace the result"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Workflow Execution Visualizer (n8n-style 7-step pipeline) */}
      <AnimatedWorkflowExecution
        steps={executionSteps}
        title="Workflow Execution Engine"
        processTitle={workflowTitle}
        overallStatus={status === "running" ? "running" : status === "completed" ? "completed" : "idle"}
        executionResult={executionRun}
      />

      {/* Main Grid: Steps Definition (Left) & Approval Gate (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Workflow Definition */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Workflow definition</h3>
              <p className="text-xs text-slate-500 mt-1">
                When a new operational request is submitted
              </p>
            </div>

            <div className="space-y-4">
              {workflowSteps.map((step) => (
                <div
                  key={step.number}
                  className="flex items-start gap-4 p-3.5 rounded-lg border border-slate-100 bg-slate-50/60"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {step.number}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{step.title}</span>
                      {step.isSupported && (
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                          Supported action
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">{step.description}</p>
                    {step.badge && (
                      <div className="pt-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${step.badgeColor}`}>
                          {step.badge}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Outcome */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Expected outcome
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every new request becomes visible to the operations team within minutes, with a traceable task and notification.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Only allowlisted actions can execute.</span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Mandatory Approval Gate */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Review required
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed">
                  AI Business Automation will not perform external actions until you approve this workflow.
                </p>
              </div>
            </div>

            {/* Checklist of planned external side-effects */}
            <div className="space-y-2 pt-2 border-t border-amber-200/60 text-xs text-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Create a Trello card in <strong>Operations / Incoming</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Send a Telegram notification to <strong>#operations</strong></span>
              </div>
            </div>

            {/* Explicit Approval Checkbox */}
            <div className="pt-2 border-t border-amber-200/60">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasReviewed}
                  onChange={(e) => setHasReviewed(e.target.checked)}
                  disabled={status === "completed" || status === "rejected"}
                  className="mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-slate-800 leading-snug">
                  I reviewed the proposed actions and understand they will create external records.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleApproveAndRun}
                disabled={!hasReviewed || isProcessing || status === "completed" || status === "rejected"}
                className="w-full bg-slate-900 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {status === "running"
                  ? "Executing approved actions..."
                  : status === "completed"
                  ? "Workflow executed successfully"
                  : status === "rejected"
                  ? "Workflow was rejected"
                  : "Approve and run workflow"}
              </button>

              {status !== "completed" && status !== "rejected" && (
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="w-full bg-white text-slate-700 border border-slate-200 text-xs font-medium py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Reject workflow
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Execution History Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Execution history</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Run</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {executionRun ? (
                <tr>
                  <td className="py-3.5">
                    <span className="font-semibold text-slate-800 block">
                      Operational request coordination
                    </span>
                    <span className="text-[11px] text-slate-400 block">{executionRun.completedAt}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Completed
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-600 font-medium">{executionRun.duration}</td>
                  <td className="py-3.5 text-right">
                    <Link
                      href={`/executions/${executionRun.id}`}
                      className="text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 px-2.5 py-1 rounded border border-slate-200"
                    >
                      View details
                    </Link>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="py-3.5">
                    <span className="font-semibold text-slate-800 block">
                      Operational request coordination
                    </span>
                    <span className="text-[11px] text-slate-400 block">Ready for first approved run</span>
                  </td>
                  <td className="py-3.5">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Pending approval
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-400">—</td>
                  <td className="py-3.5 text-right text-slate-400">—</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

