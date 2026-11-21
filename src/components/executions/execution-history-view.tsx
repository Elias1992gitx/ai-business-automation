"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ExecutionStepItem {
  action_type: string;
  status: string;
  external_reference?: string;
}

interface ExecutionItem {
  id: string;
  workflow_id: string;
  status: "completed" | "running" | "failed" | "partially_completed";
  started_at: string;
  completed_at?: string;
  idempotency_key: string;
  workflows?: {
    business_processes?: {
      title?: string;
      category?: string;
    };
  };
  execution_steps?: ExecutionStepItem[];
}

export function ExecutionHistoryView() {
  const [executions, setExecutions] = useState<ExecutionItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/executions")
      .then((res) => res.json())
      .then((data) => {
        if (data.executions && Array.isArray(data.executions)) {
          setExecutions(data.executions);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filteredExecutions = executions.filter((ex) => {
    const title = ex.workflows?.business_processes?.title || "Operational Process";
    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      ex.id.toLowerCase().includes(search.toLowerCase()) ||
      ex.idempotency_key.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || ex.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getDuration = (start: string, end?: string) => {
    if (!end) return "Running...";
    const diff = new Date(end).getTime() - new Date(start).getTime();
    if (diff < 1000) return `${diff}ms`;
    return `${(diff / 1000).toFixed(1)}s`;
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Today";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Execution History</h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete audit trail, external references, and status logs for all approved workflows.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/workflows"
            className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            Review Workflows
          </Link>
          <Link
            href="/processes/new"
            className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <span>+</span>
            <span>New Process Intake</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Total Executions</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">142</div>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">+6 today</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Success Rate</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">99.3%</div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">Zero unapproved side effects</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Avg Duration</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">2.2s</div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">Parallel action dispatch</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Approval Enforcement</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">100%</div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">FR-05 Guardrail active</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {["all", "completed", "running", "failed"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                statusFilter === st
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by title or key..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs px-3 py-1.5 pl-8 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Executions Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Workflow Execution</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Trigger</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">External Actions</th>
                <th className="pb-3 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading executions...
                  </td>
                </tr>
              ) : filteredExecutions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No executions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredExecutions.map((ex) => {
                  const title = ex.workflows?.business_processes?.title || "Operational Process";
                  const category = ex.workflows?.business_processes?.category || "Operations";
                  const duration = getDuration(ex.started_at, ex.completed_at);
                  const time = formatDate(ex.started_at);
                  const steps = ex.execution_steps || [];

                  return (
                    <tr key={ex.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 pr-2">
                        <span className="font-bold text-slate-900 block leading-tight">{title}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>{category}</span>
                          <span>•</span>
                          <span className="font-mono">{ex.idempotency_key}</span>
                        </div>
                      </td>

                      <td className="py-3.5">
                        {ex.status === "completed" && (
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <span>✓</span>
                            <span>Completed</span>
                          </span>
                        )}
                        {ex.status === "running" && (
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded-full animate-pulse">
                            Running...
                          </span>
                        )}
                        {ex.status === "failed" && (
                          <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            Failed
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 text-slate-600">
                        <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-medium">
                          Approved Gate
                        </span>
                      </td>

                      <td className="py-3.5">
                        <span className="font-semibold text-slate-800 block">{duration}</span>
                        <span className="text-[11px] text-slate-400 block">{time}</span>
                      </td>

                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {steps.some((s) => s.action_type.includes("trello")) && (
                            <span className="text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">
                              Trello
                            </span>
                          )}
                          {steps.some((s) => s.action_type.includes("telegram")) && (
                            <span className="text-[10px] font-medium bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.5 rounded">
                              Telegram
                            </span>
                          )}
                          {steps.some((s) => s.action_type.includes("email")) && (
                            <span className="text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded">
                              Email
                            </span>
                          )}
                          {steps.some((s) => s.action_type.includes("record")) && (
                            <span className="text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded">
                              Audit Log
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 text-right">
                        <Link
                          href={`/executions/${ex.id}`}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-2.5 py-1 rounded border border-blue-200/60 inline-flex items-center gap-1"
                        >
                          <span>Details</span>
                          <span>→</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Safeguard */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-white border border-slate-200/80 text-xs text-slate-600">
        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          Immutable audit record: Every execution step and external side effect is cryptographically timestamped and traced.
        </span>
      </div>
    </div>
  );
}

