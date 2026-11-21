"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/src/components/theme/theme-provider";

export function SettingsView() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Notification and integration toggles
  const [trelloEnabled, setTrelloEnabled] = useState(true);
  const [telegramEnabled, setTelegramEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [recipientEmail, setRecipientEmail] = useState("elias@acme-operations.com");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Load current settings from API and localStorage
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setTrelloEnabled(data.settings.trelloEnabled ?? true);
          setTelegramEnabled(data.settings.telegramEnabled ?? true);
          setEmailEnabled(data.settings.emailEnabled ?? true);
          if (data.settings.recipientEmail) setRecipientEmail(data.settings.recipientEmail);
        }
      })
      .catch(() => {
        // Fallback to localStorage
        try {
          const local = localStorage.getItem("ai_automation_channels");
          if (local) {
            const parsed = JSON.parse(local);
            if (typeof parsed.trelloEnabled === "boolean") setTrelloEnabled(parsed.trelloEnabled);
            if (typeof parsed.telegramEnabled === "boolean") setTelegramEnabled(parsed.telegramEnabled);
            if (typeof parsed.emailEnabled === "boolean") setEmailEnabled(parsed.emailEnabled);
            if (parsed.recipientEmail) setRecipientEmail(parsed.recipientEmail);
          }
        } catch {}
      });
  }, []);

  const handleSaveNotificationSettings = async () => {
    setIsSaving(true);
    setSavedSuccess(false);

    const payload = {
      trelloEnabled,
      telegramEnabled,
      emailEnabled,
      recipientEmail,
    };

    try {
      localStorage.setItem("ai_automation_channels", JSON.stringify(payload));
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage automation notification channels, integration side-effects, and portal appearance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/settings/integrations"
            className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
          >
            Connection Diagnostics →
          </Link>
        </div>
      </div>

      {/* Section 1: Notification & Channel Toggles */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6 transition-colors duration-200">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Notification & Action Channels
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enable or disable external side-effects when workflows are approved by Elias Chane.
              </p>
            </div>
            {savedSuccess && (
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                <span>✓</span> Preferences saved
              </span>
            )}
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {/* Trello Channel */}
          <div className="py-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-blue-100 dark:border-blue-900">
                Tr
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Trello Task Creation
                  </h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      trelloEnabled
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {trelloEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                  Automatically create operational cards in the &quot;Today&quot; list on My Trello board upon workflow approval.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTrelloEnabled(!trelloEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                trelloEnabled ? "bg-emerald-600 dark:bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
              }`}
              role="switch"
              aria-checked={trelloEnabled}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-sm ring-0 transition duration-200 ease-in-out ${
                  trelloEnabled
                    ? "translate-x-5 bg-white"
                    : "translate-x-0 bg-white dark:bg-slate-400"
                }`}
              />
            </button>
          </div>

          {/* Telegram Channel */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-sky-100 dark:border-sky-900">
                ✈
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Telegram Notifications
                  </h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      telegramEnabled
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {telegramEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                  Dispatch real-time execution alerts and deep-links via bot @ai_business_automation_et_bot to the #operations chat.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTelegramEnabled(!telegramEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                telegramEnabled ? "bg-emerald-600 dark:bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
              }`}
              role="switch"
              aria-checked={telegramEnabled}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-sm ring-0 transition duration-200 ease-in-out ${
                  telegramEnabled
                    ? "translate-x-5 bg-white"
                    : "translate-x-0 bg-white dark:bg-slate-400"
                }`}
              />
            </button>
          </div>

          {/* Email Notifications */}
          <div className="py-4 last:pb-0 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-purple-100 dark:border-purple-900">
                  ✉
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      Email Execution Notices
                    </h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        emailEnabled
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                          : "bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      {emailEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                    Send HTML digests and formal audit execution receipts to the operations team mailing list.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEmailEnabled(!emailEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  emailEnabled ? "bg-emerald-600 dark:bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
                }`}
                role="switch"
                aria-checked={emailEnabled}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-sm ring-0 transition duration-200 ease-in-out ${
                    emailEnabled
                      ? "translate-x-5 bg-white"
                      : "translate-x-0 bg-white dark:bg-slate-400"
                  }`}
                />
              </button>
            </div>

            {/* Recipient Email Config Row */}
            <div className="pl-12 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="flex-1 max-w-md">
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Operations Email:
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="elias@acme-operations.com"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="sm:self-end">
                <Link
                  href="/settings/integrations/email"
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 underline inline-flex items-center gap-1"
                >
                  <span>Templates & Audit Logs</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Changes take effect immediately on next approved workflow run.
          </span>
          <button
            type="button"
            onClick={handleSaveNotificationSettings}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Channel Preferences"}
          </button>
        </div>
      </div>

      {/* Section 2: Appearance & Theme Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-5 transition-colors duration-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Appearance & Theme
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select your preferred color theme for the AI-Business-Automation portal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Light Theme Card */}
          <div
            onClick={() => setTheme("light")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              theme === "light"
                ? "border-emerald-600 dark:border-emerald-400 ring-2 ring-emerald-600/20 dark:ring-emerald-400/20 bg-slate-50/70 dark:bg-slate-800"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
            }`}
          >
            <div className="h-20 rounded-lg bg-slate-100 border border-slate-200 p-2.5 space-y-2 flex flex-col justify-between mb-3 overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-12 h-2 rounded bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-400" />
              </div>
              <div className="space-y-1">
                <div className="w-full h-2 rounded bg-white" />
                <div className="w-2/3 h-2 rounded bg-white" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Light Mode
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  High-clarity day aesthetic
                </span>
              </div>
              {theme === "light" && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                  ✓
                </span>
              )}
            </div>
          </div>

          {/* Dark Theme Card */}
          <div
            onClick={() => setTheme("dark")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              theme === "dark"
                ? "border-emerald-600 dark:border-emerald-400 ring-2 ring-emerald-600/20 dark:ring-emerald-400/20 bg-slate-50/70 dark:bg-slate-800"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
            }`}
          >
            <div className="h-20 rounded-lg bg-slate-950 border border-slate-800 p-2.5 space-y-2 flex flex-col justify-between mb-3 overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-12 h-2 rounded bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-600" />
              </div>
              <div className="space-y-1">
                <div className="w-full h-2 rounded bg-slate-900" />
                <div className="w-2/3 h-2 rounded bg-slate-900" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Dark Mode
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Low-contrast evening aesthetic
                </span>
              </div>
              {theme === "dark" && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                  ✓
                </span>
              )}
            </div>
          </div>

          {/* System Theme Card */}
          <div
            onClick={() => setTheme("system")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              theme === "system"
                ? "border-emerald-600 dark:border-emerald-400 ring-2 ring-emerald-600/20 dark:ring-emerald-400/20 bg-slate-50/70 dark:bg-slate-800"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
            }`}
          >
            <div className="h-20 rounded-lg bg-gradient-to-r from-slate-100 to-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 flex items-center justify-center mb-3">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                Auto System
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  System Default
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Matches device preferences
                </span>
              </div>
              {theme === "system" && (
                <span className="w-4 h-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-[10px]">
                  ✓
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Profile & Guardrail Identity */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 transition-colors duration-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Operations Officer & Guardrail Identity
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Default credentials authorized to approve autonomous workflow executions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Operations Approver</span>
            <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">Elias Chane</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">elias@acme-operations.com</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Workspace</span>
            <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">Acme Operations</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Operations Management Hub</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Human Gate Policy</span>
            <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">FR-05 Zero-Trust</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Explicit human approval required</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsView;
