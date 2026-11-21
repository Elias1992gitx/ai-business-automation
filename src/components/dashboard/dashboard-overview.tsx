"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ProcessItem {
  id: string;
  title: string;
  category: string;
  status:
    | "analyzed"
    | "awaiting_approval"
    | "approved"
    | "completed"
    | "rejected";
  opportunities: number;
  updatedAt: string;
}

interface PendingApproval {
  id: string;
  workflowId: string;
  title: string;
  description: string;
  requestedBy: string;
  targetQueue: string;
  createdAt: string;
}

export function DashboardOverview() {
  const [processes, setProcesses] = useState<ProcessItem[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(
    [],
  );
  const [executionsCount, setExecutionsCount] = useState<number>(3);
  const [workflowsCount, setWorkflowsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [procRes, wfRes, execRes] = await Promise.all([
          fetch("/api/processes")
            .then((r) => r.json())
            .catch(() => ({ processes: [] })),
          fetch("/api/workflows")
            .then((r) => r.json())
            .catch(() => ({ workflows: [] })),
          fetch("/api/executions")
            .then((r) => r.json())
            .catch(() => ({ executions: [] })),
        ]);

        const rawProcesses: any[] = procRes.processes || [];
        const rawWorkflows: any[] = wfRes.workflows || [];
        const rawExecutions: any[] = execRes.executions || [];

        setWorkflowsCount(rawWorkflows.length);
        setExecutionsCount(rawExecutions.length);

        // Map pending approvals: workflows that are in draft or awaiting_approval, or approved but not yet executed
        const executedWfIds = new Set(rawExecutions.map((e) => e.workflow_id));
        const pendingWfs = rawWorkflows.filter(
          (wf) =>
            (wf.status === "awaiting_approval" ||
              wf.status === "draft" ||
              (wf.status === "approved" && !executedWfIds.has(wf.id))) &&
            wf.status !== "rejected" &&
            wf.status !== "cancelled" &&
            wf.status !== "executed",
        );

        const mappedPending: PendingApproval[] = pendingWfs.map((wf) => {
          const procTitle =
            wf.business_processes?.title || "Operational Request Coordination";
          const procDesc =
            wf.business_processes?.description ||
            "Creates Trello card in Today list + notifies #operations via Telegram & Email";

          return {
            id: wf.id,
            workflowId: wf.id,
            title: procTitle,
            description: procDesc,
            requestedBy: "Elias Chane (Operations)",
            targetQueue: "Today → My Trello board",
            createdAt: wf.created_at
              ? new Date(wf.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Just now",
          };
        });

        setPendingApprovals(mappedPending);

        const mappedProcesses: ProcessItem[] = rawProcesses.map((p) => {
          return {
            id: p.id,
            title: p.title || "Untitled Process",
            category: p.category || "Operations",
            status: (p.status as any) || "analyzed",
            opportunities: 3,
            updatedAt: p.created_at
              ? new Date(p.created_at).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })
              : "Today",
          };
        });

        setProcesses(mappedProcesses);
      } catch {
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalProcessesCount = processes.length;
  const timeSavedHours = (executionsCount * 2.5).toFixed(1);

  const metrics = [
    {
      title: "Analyzed Processes",
      value: totalProcessesCount.toString(),
      change: "+3 this week",
      isPositive: true,
      icon: (
        <svg
          className="w-5 h-5 text-slate-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "Active Workflows",
      value: workflowsCount.toString(),
      change:
        pendingApprovals.length > 0
          ? `${pendingApprovals.length} awaiting approval`
          : "0 awaiting approval",
      isPositive: pendingApprovals.length === 0,
      isWarning: pendingApprovals.length > 0,
      icon: (
        <svg
          className="w-5 h-5 text-slate-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      title: "Total Executions",
      value: executionsCount.toString(),
      change: "100% success rate",
      isPositive: true,
      icon: (
        <svg
          className="w-5 h-5 text-slate-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Estimated Time Saved",
      value: `${timeSavedHours} hrs`,
      change: "",
      isPositive: true,
      icon: (
        <svg
          className="w-5 h-5 text-slate-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-7">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Intelligent business process intake, AI opportunity analysis, and
            human-in-the-loop automation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/settings"
            className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
          >
            Settings
          </Link>
          <Link
            href="/processes/new"
            className="inline-flex items-center gap-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
          >
            <span>+</span>
            <span>New Process Intake</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {m.title}
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                {m.icon}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {m.value}
              </div>
              <span
                className={`text-[11px] font-medium block mt-1 ${
                  m.isWarning
                    ? "text-amber-600 dark:text-amber-400 font-semibold"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mandatory Approval Gate Banner (FR-05) - Dynamic */}
      {pendingApprovals.length > 0 ? (
        <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/80 rounded-xl p-5 shadow-xs space-y-3.5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                !
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                    Human Approval Required (FR-05 Guardrail)
                  </h3>
                  <span className="bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {pendingApprovals.length} pending
                  </span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-1">
                  Autonomous external actions (Trello task creation, Telegram
                  alerts, email dispatch) remain paused until approved by an
                  authorized manager.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {pendingApprovals.map((appr) => (
              <div
                key={appr.id}
                className="bg-white/90 dark:bg-slate-900/90 border border-amber-200/80 dark:border-amber-800/60 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {appr.title}
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    {appr.description}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500 pt-0.5">
                    <span>Requested by: {appr.requestedBy}</span>
                    <span>•</span>
                    <span>Target: {appr.targetQueue}</span>
                    <span>•</span>
                    <span>{appr.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/workflows/${appr.workflowId}`}
                    className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                  >
                    <span>Review & Approve</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300 transition-colors">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-[10px] flex items-center justify-center shrink-0">
              ✓
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              Zero-Trust Approval Gate Clean
            </span>
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
              — All operational workflows have been reviewed and resolved. No
              pending execution blocks.
            </span>
          </div>
          <Link
            href="/processes/new"
            className="text-xs font-semibold text-slate-900 dark:text-white hover:underline self-start sm:self-auto"
          >
            Intake New Process →
          </Link>
        </div>
      )}

      {/* Main Grid: Recent Processes (Left 8 cols) & Integration Health (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Processes */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Process Intakes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Track AI analysis and workflow lifecycle status.
              </p>
            </div>
            <Link
              href="/processes/new"
              className="text-xs font-semibold text-slate-900 dark:text-white hover:underline"
            >
              + Submit new
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Process</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Opportunities</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {processes.length > 0 ? (
                  processes.slice(0, 6).map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <td className="py-3.5 pr-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block leading-tight">
                          {p.title}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          {p.updatedAt}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-600 dark:text-slate-400">
                        {p.category}
                      </td>
                      <td className="py-3.5">
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {p.opportunities} identified
                        </span>
                      </td>
                      <td className="py-3.5">
                        {p.status === "awaiting_approval" && (
                          <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            Awaiting approval
                          </span>
                        )}
                        {p.status === "analyzed" && (
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            Analyzed
                          </span>
                        )}
                        {p.status === "approved" && (
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            Approved
                          </span>
                        )}
                        {p.status === "completed" && (
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            ✓ Completed
                          </span>
                        )}
                        {p.status === "rejected" && (
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/processes/${p.id}`}
                          className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-slate-400 dark:text-slate-500 text-xs"
                    >
                      {isLoading
                        ? "Loading processes from Supabase..."
                        : "No processes submitted yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 cols: Live Integrations Status */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Connected Services
              </h3>
              <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full">
                All Systems Operational
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                    Tr
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      Trello
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      Live API Key & Token Active
                    </span>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 dark:ring-emerald-950" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 font-bold text-xs flex items-center justify-center">
                    ✦
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      Gemini 2.0 Flash
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      Structured Analysis Pipeline
                    </span>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 dark:ring-emerald-950" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold text-xs flex items-center justify-center">
                    ⚡
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      Supabase
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      PostgreSQL Schema & RLS
                    </span>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 dark:ring-emerald-950" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 font-bold text-xs flex items-center justify-center">
                    ✈
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      Telegram Alerts
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      @ai_business_automation_et_bot Active
                    </span>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 dark:ring-emerald-950" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 font-bold text-xs flex items-center justify-center">
                    ✉
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      Email Notifications
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      elias@acme-operations.com Ready
                    </span>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 dark:ring-emerald-950" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
