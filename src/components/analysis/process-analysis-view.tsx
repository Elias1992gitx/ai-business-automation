"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProcessAnalysisViewProps {
  processId: string;
}

export function ProcessAnalysisView({ processId }: ProcessAnalysisViewProps) {
  const router = useRouter();
  const [selectedOpportunity, setSelectedOpportunity] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [processStatus, setProcessStatus] = useState<string>("analyzed");
  const [existingWorkflowId, setExistingWorkflowId] = useState<string | null>(null);
  const [processTitle, setProcessTitle] = useState(
    "Service request coordination",
  );
  const [processDescription, setProcessDescription] = useState(
    "Our operations team receives service requests, manually categorizes them, assigns tasks to employees, and sends follow-up messages to check completion.",
  );

  useEffect(() => {
    Promise.all([
      fetch(`/api/processes/${processId}`)
        .then((res) => res.json())
        .catch(() => ({})),
      fetch("/api/workflows")
        .then((res) => res.json())
        .catch(() => ({ workflows: [] })),
    ]).then(([procData, wfData]) => {
      if (procData?.process) {
        if (procData.process.title) setProcessTitle(procData.process.title);
        if (procData.process.description)
          setProcessDescription(procData.process.description);
        if (procData.process.status)
          setProcessStatus(procData.process.status);
      }

      if (wfData?.workflows && Array.isArray(wfData.workflows)) {
        const matchWf = wfData.workflows.find(
          (w: any) => w.process_id === processId || w.id === processId
        );
        if (matchWf) {
          setExistingWorkflowId(matchWf.id);
          if (matchWf.status === "executed" || matchWf.status === "completed") {
            setProcessStatus("completed");
          } else if (matchWf.status === "awaiting_approval" || matchWf.status === "approved") {
            setProcessStatus("awaiting_approval");
          }
        }
      }
    });
  }, [processId]);

  const stages = [
    {
      number: 1,
      name: "Receive request",
      type: "Intake",
      team: "Operations team",
    },
    {
      number: 2,
      name: "Categorize request",
      type: "Manual",
      team: "Operations team",
    },
    {
      number: 3,
      name: "Assign owner",
      type: "Manual",
      team: "Operations team",
    },
    { number: 4, name: "Follow up", type: "Manual", team: "Operations team" },
  ];

  const bottlenecks = [
    {
      title: "Manual categorization slows triage",
      description: "Requests wait for an operator to classify them",
      severity: "High",
      severityColor: "bg-red-50 text-red-700 border-red-200",
    },
    {
      title: "Follow-up depends on memory",
      description: "No consistent reminder or completion signal",
      severity: "Medium",
      severityColor: "bg-slate-100 text-slate-700 border-slate-200",
    },
    {
      title: "Assignment context gets lost",
      description: "Details are re-entered across tools",
      severity: "Medium",
      severityColor: "bg-slate-100 text-slate-700 border-slate-200",
    },
  ];

  const opportunities = [
    {
      title: `Automate ${processTitle}`,
      impact: "High impact",
      impactColor: "bg-blue-900 text-white",
      description:
        "Create a task and notify the operations chat as soon as a request is submitted",
      integrations: ["Trello", "Telegram"],
      metric: "Indicative impact: 2–3 hrs/week saved",
    },
    {
      title: "Standardize request categorization",
      impact: "Medium impact",
      impactColor: "bg-slate-100 text-slate-700 border border-slate-200",
      description:
        "Auto-tag category using AI pattern matching while keeping owner assignment manual",
      integrations: ["Gemini AI"],
      metric: "Indicative impact: 1 hr/week saved",
    },
    {
      title: "Add completion reminders",
      impact: "Medium impact",
      impactColor: "bg-slate-100 text-slate-700 border border-slate-200",
      description:
        "Automate reminder notifications when tasks approach due dates without resolution",
      integrations: ["Telegram"],
      metric: "Indicative impact: 1–2 hrs/week saved",
    },
  ];

  const handleGenerateWorkflow = async () => {
    if (selectedOpportunity === null && opportunities.length > 0) return;
    setIsGenerating(true);
    try {
      const oppIdx = selectedOpportunity ?? 0;
      const res = await fetch(`/api/processes/${processId}/workflows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityIndex: oppIdx,
          opportunity: opportunities[oppIdx],
        }),
      });

      const data = await res.json();
      const nextId = data.workflowId || data.workflow?.id || processId;
      router.push(`/workflows/${nextId}`);
    } catch {
      router.push(`/workflows/${processId}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/processes"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to processes
        </Link>
      </div>

      {/* Stepper Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Process journey
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            Step 2 of 4
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs flex items-center justify-center shrink-0">
              ✓
            </div>
            <div>
              <span className="text-xs font-medium text-slate-700 block leading-tight">
                Describe
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-900 block leading-tight">
                Analyze
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-semibold text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 block leading-tight">
                Review
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-semibold text-xs flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 block leading-tight">
                Execute
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Title & Status */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {processTitle}
            </h1>
            {processStatus === "completed" ? (
              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                ✓ Execution completed
              </span>
            ) : processStatus === "awaiting_approval" ? (
              <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Awaiting approval
              </span>
            ) : (
              <span className="bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Analysis complete
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1.5">
            Reviewed today ·{" "}
            <span className="italic font-medium">
              Indicative estimates, not measured facts
            </span>
          </p>
        </div>
      </div>

      {/* Current Process Summary Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Current process
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              {processDescription}
            </p>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-2.5">
              <span className="bg-slate-100 px-2 py-0.5 rounded">4 stages</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">3 actors</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">
                2 handoffs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Process Map + Bottlenecks (Left) & Automation Opportunities (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Process Map */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Process map</h3>

            <div className="grid grid-cols-4 gap-2 pt-2 text-center">
              {stages.map((stage) => (
                <div
                  key={stage.number}
                  className="space-y-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center mx-auto">
                    {stage.number}
                  </div>
                  <span className="text-xs font-semibold text-slate-900 block leading-tight">
                    {stage.name}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {stage.type}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {stage.team}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900">
              Bottlenecks identified
            </h3>

            <div className="space-y-3">
              {bottlenecks.map((b) => (
                <div
                  key={b.title}
                  className="flex items-start justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-800 block">
                      {b.title}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {b.description}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${b.severityColor}`}
                  >
                    {b.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Automation Opportunities (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Automation opportunities
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select an opportunity to draft an executable workflow.
              </p>
            </div>

            <div className="space-y-3">
              {opportunities.map((opp, idx) => {
                const isSelected = selectedOpportunity === idx;
                return (
                  <div
                    key={opp.title}
                    onClick={() => setSelectedOpportunity(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/30 ring-1 ring-blue-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => setSelectedOpportunity(idx)}
                        className="mt-1 text-blue-600"
                      />
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">
                            {opp.title}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${opp.impactColor}`}
                          >
                            {opp.impact}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {opp.description}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          {opp.integrations.map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="text-[11px] font-medium text-slate-500 pt-1 border-t border-slate-100/80">
                          {opp.metric}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 space-y-2 border-t border-slate-100 dark:border-slate-800">
            {processStatus === "completed" ? (
              <>
                <button
                  type="button"
                  disabled={true}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 text-xs font-semibold py-2.5 rounded-lg cursor-not-allowed shadow-none"
                >
                  Execution completed (Workflow already executed)
                </button>
                <Link
                  href="/executions"
                  className="w-full text-center block bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold py-2.5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs"
                >
                  View Execution History →
                </Link>
              </>
            ) : processStatus === "awaiting_approval" ? (
              <>
                <Link
                  href={`/workflows/${existingWorkflowId || processId}`}
                  className="w-full text-center block bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold py-2.5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs"
                >
                  Review & Approve Workflow →
                </Link>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleGenerateWorkflow}
                  disabled={selectedOpportunity === null || isGenerating}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold py-2.5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isGenerating
                    ? "Drafting workflow..."
                    : selectedOpportunity === null
                    ? "Select an opportunity above to generate workflow"
                    : "Generate workflow"}
                </button>
                <button
                  type="button"
                  className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-medium py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Save recommendation
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-white border border-slate-200/80 text-xs text-slate-600">
        <svg
          className="w-4 h-4 text-slate-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <span>
          <span className="font-semibold text-slate-700">Safety gate:</span>{" "}
          Human approval required before any external action.
        </span>
      </div>
    </div>
  );
}
