"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ProcessItem {
  id: string;
  title: string;
  category: string;
  description: string;
  status: string;
  opportunities: number;
  updatedAt: string;
  owner: string;
}

export function ProcessesListView() {
  const [processes, setProcesses] = useState<ProcessItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/processes")
      .then((res) => res.json())
      .then((data) => {
        if (data.processes && Array.isArray(data.processes)) {
          const mapped: ProcessItem[] = data.processes.map((p: any) => ({
            id: p.id,
            title: p.title || "Untitled Process",
            category: p.category || "Operations",
            description: p.description || "Operational process intake.",
            status: p.status || "analyzed",
            opportunities: 3,
            updatedAt: p.created_at
              ? new Date(p.created_at).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })
              : "Recently",
            owner: p.created_by || p.user_email || "Operations User",
          }));
          setProcesses(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Business Processes</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Catalog of operational processes submitted for AI bottleneck diagnosis and automation.
          </p>
        </div>

        <Link
          href="/processes/new"
          className="inline-flex items-center gap-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm self-start sm:self-auto"
        >
          <span>+</span>
          <span>New Process Intake</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {processes.length > 0 ? (
          processes.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {p.category}
                  </span>
                  {p.status === "awaiting_approval" && (
                    <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Awaiting Approval
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
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{p.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{p.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{p.opportunities} opportunities identified</span>
                <Link
                  href={`/processes/${p.id}`}
                  className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white inline-flex items-center gap-1"
                >
                  <span>View Analysis</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-10 text-center text-slate-400 dark:text-slate-500 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            {isLoading ? "Loading processes from Supabase..." : "No processes submitted yet."}
          </div>
        )}
      </div>
    </div>
  );
}
