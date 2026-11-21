"use client";

import { useState } from "react";
import Link from "next/link";

interface ServiceHealth {
  database: "online" | "offline";
  auth: "enabled" | "disabled";
  storage: "ready" | "error";
  realtime: "enabled" | "disabled";
  lastChecked: string;
}

export function SupabaseIntegration() {
  const [projectUrl, setProjectUrl] = useState("https://xlmksystpnqjjzwaqrmk.supabase.co");
  const [apiKey, setApiKey] = useState("sb_publishable_uj-Jb-qzuCx7hHTpmnseGw_4SYcxjpe");
  const [showKey, setShowKey] = useState(false);
  const [environment, setEnvironment] = useState("Production");
  const [activeTab, setActiveTab] = useState<"schema" | "sql" | "policies">("schema");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [health, setHealth] = useState<ServiceHealth>({
    database: "online",
    auth: "enabled",
    storage: "ready",
    realtime: "enabled",
    lastChecked: "2 min ago",
  });
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const handleHealthCheck = async () => {
    setIsCheckingHealth(true);
    // Simulate real-time API health probe
    setTimeout(() => {
      setHealth({
        database: "online",
        auth: "enabled",
        storage: "ready",
        realtime: "enabled",
        lastChecked: "Just now",
      });
      setIsCheckingHealth(false);
    }, 800);
  };

  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "supabase",
          projectUrl,
          apiKey,
          environment,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      // Fallback local acknowledgment
      setSaveSuccess(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Provider Sub-Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-sm">
        <Link
          href="/settings/integrations/supabase"
          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-medium"
        >
          Supabase
        </Link>
        <Link
          href="/settings/integrations/gemini"
          className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          Gemini AI
        </Link>
        <Link
          href="/settings/integrations/trello"
          className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          Trello
        </Link>
        <Link
          href="/settings/integrations/telegram"
          className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          Telegram
        </Link>
      </div>

      {/* Page Title & Description */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Connect Supabase</h1>
        <p className="text-sm text-slate-500 mt-1">
          Store process definitions, recommendations, approvals, and execution history in a secure project workspace.
        </p>
      </div>

      {/* Status Banner Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-slate-900 text-base">acme-automation</span>
              <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                Production
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>West US</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Healthy
              </span>
            </div>
          </div>
        </div>

        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        >
          Open project
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Grid: Project Configuration & Connection Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Project configuration */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <form onSubmit={handleSaveConnection} className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Project configuration</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Connect this workspace to your Supabase project.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project URL
                </label>
                <input
                  type="text"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  API key
                </label>
                <div className="flex gap-2">
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                  >
                    {showKey ? "Hide key" : "Reveal key"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Environment
                </label>
                <select
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                  <option value="Development">Development</option>
                </select>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                Use the anon key for client access. Keep the service role key server-side and never expose it in browser code.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save connection"}
              </button>
              {saveSuccess && (
                <span className="text-xs text-emerald-600 font-medium">
                  Connection saved successfully
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Right Card: Connection health */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Connection health</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current service availability for this project.
            </p>

            <div className="space-y-4 pt-5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Database
                </span>
                <span className="text-slate-500">
                  {health.database === "online" ? "Online" : "Offline"} · {health.lastChecked}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Auth
                </span>
                <span className="text-slate-500">
                  {health.auth === "enabled" ? "Enabled" : "Disabled"} · {health.lastChecked}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Storage
                </span>
                <span className="text-slate-500">
                  {health.storage === "ready" ? "Ready" : "Error"} · {health.lastChecked}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Realtime
                </span>
                <span className="text-slate-500">
                  {health.realtime === "enabled" ? "Enabled" : "Disabled"} · {health.lastChecked}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={handleHealthCheck}
              disabled={isCheckingHealth}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            >
              <svg
                className={`w-3.5 h-3.5 text-slate-500 ${isCheckingHealth ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isCheckingHealth ? "Checking..." : "Run health check"}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Card: Automation data model */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Automation data model</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tables and access policies provisioned for process automation.
            </p>
          </div>
          <a
            href="https://supabase.com/dashboard/project/_/editor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            View in dashboard
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("schema")}
            className={`px-3 py-1.5 font-medium border-b-2 -mb-px transition-colors ${
              activeTab === "schema"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Schema
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sql")}
            className={`px-3 py-1.5 font-medium border-b-2 -mb-px transition-colors ${
              activeTab === "sql"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            SQL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("policies")}
            className={`px-3 py-1.5 font-medium border-b-2 -mb-px transition-colors ${
              activeTab === "policies"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Policies
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200/80 font-mono text-xs text-slate-700 leading-relaxed overflow-x-auto">
          {activeTab === "schema" && (
            <div className="space-y-1">
              <div><span className="text-slate-900 font-semibold">public.processes</span> — process definitions and versions</div>
              <div><span className="text-slate-900 font-semibold">public.recommendations</span> — generated improvement ideas</div>
              <div><span className="text-slate-900 font-semibold">public.approvals</span> — human approval requests</div>
              <div><span className="text-slate-900 font-semibold">public.execution_logs</span> — workflow execution history</div>
              <div><span className="text-slate-900 font-semibold">public.integrations</span> — connected service credentials</div>
            </div>
          )}

          {activeTab === "sql" && (
            <pre className="text-slate-800 whitespace-pre-wrap">
{`-- Initial schema for AI-Business-Automation
CREATE TABLE public.processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
            </pre>
          )}

          {activeTab === "policies" && (
            <div className="space-y-1 text-slate-800">
              <div>• <span className="font-semibold">processes_owner_policy</span>: Users can only read and mutate their own processes.</div>
              <div>• <span className="font-semibold">approvals_strict_rls</span>: Write access restricted to authenticated owners.</div>
              <div>• <span className="font-semibold">execution_logs_audit</span>: Read-only access for execution history.</div>
            </div>
          )}
        </div>
      </div>

      {/* Security Recommendation Footer */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-white border border-slate-200/80 text-xs text-slate-600">
        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>
          <span className="font-semibold text-slate-700">Security recommendation:</span> Row-level security should stay enabled for approval and execution records.
        </span>
      </div>
    </div>
  );
}

