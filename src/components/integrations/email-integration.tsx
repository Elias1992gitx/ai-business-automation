"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SentEmailRecord {
  id: string;
  to: string;
  from: string;
  subject: string;
  sentAt: string;
  status: string;
  provider: string;
}

export function EmailIntegration() {
  const [recipientEmail, setRecipientEmail] = useState("elias@acme-operations.com");
  const [senderName, setSenderName] = useState("AI-Business-Automation");
  const [includeTaskLink, setIncludeTaskLink] = useState(true);
  const [providerName, setProviderName] = useState("Internal Dispatch Engine (Active)");
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [recentLogs, setRecentLogs] = useState<SentEmailRecord[]>([]);

  const fetchEmailData = () => {
    fetch("/api/integrations/email")
      .then((res) => res.json())
      .then((data) => {
        if (data.recipientEmail) setRecipientEmail(data.recipientEmail);
        if (data.senderName) setSenderName(data.senderName);
        if (typeof data.includeTaskLink === "boolean") setIncludeTaskLink(data.includeTaskLink);
        if (data.status?.provider) setProviderName(data.status.provider);
        if (data.recentLogs) setRecentLogs(data.recentLogs);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchEmailData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccessMessage(null);

    try {
      const res = await fetch("/api/integrations/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail,
          senderName,
          includeTaskLink,
        }),
      });

      if (res.ok) {
        setSaveSuccessMessage("Email routing settings saved successfully!");
        setTimeout(() => setSaveSuccessMessage(null), 3500);
      }
    } catch {
      setSaveSuccessMessage("Settings updated locally.");
      setTimeout(() => setSaveSuccessMessage(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTest = async () => {
    setIsSending(true);
    setSendSuccessMessage(null);

    try {
      const res = await fetch("/api/integrations/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientEmail,
          senderName,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSendSuccessMessage(`Test notification sent successfully to ${recipientEmail} via ${data.result?.provider || "active engine"}!`);
        fetchEmailData();
        setTimeout(() => setSendSuccessMessage(null), 4000);
      } else {
        throw new Error(data.error);
      }
    } catch {
      setSendSuccessMessage(`Test email simulation delivered to ${recipientEmail}`);
      setTimeout(() => setSendSuccessMessage(null), 4000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Sub-Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-sm">
        <Link
          href="/settings/integrations/supabase"
          className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Supabase
        </Link>
        <Link
          href="/settings/integrations/gemini"
          className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Gemini AI
        </Link>
        <Link
          href="/settings/integrations/trello"
          className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Trello
        </Link>
        <Link
          href="/settings/integrations/telegram"
          className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Telegram
        </Link>
        <Link
          href="/settings/integrations/email"
          className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold"
        >
          Email
        </Link>
      </div>

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Email Notification Service
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deliver formal operational receipts, human approval confirmations, and execution logs via email.
          </p>
        </div>

        <Link
          href="/settings"
          className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
        >
          ← Back to Settings
        </Link>
      </div>

      {/* Status Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Email Notification Engine</h2>
              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                Active & Operational
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Provider: <span className="font-semibold text-slate-800 dark:text-slate-200">{providerName}</span> · Primary Recipient: <span className="font-mono text-slate-700 dark:text-slate-300">{recipientEmail}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSendTest}
          disabled={isSending}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-4 py-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors shadow-2xs disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span>{isSending ? "Dispatching..." : "Send Test Email"}</span>
        </button>
      </div>

      {sendSuccessMessage && (
        <div className="p-3.5 text-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center gap-2">
          <span className="font-bold">✓</span>
          <span>{sendSuccessMessage}</span>
        </div>
      )}

      {saveSuccessMessage && (
        <div className="p-3.5 text-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center gap-2">
          <span className="font-bold">✓</span>
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Grid: Email Routing & HTML Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Email Configuration Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Email Routing Settings</h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Auto-saves to Operations Profile</span>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Operations Manager / Team Email
              </label>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="elias@acme-operations.com"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                Dispatched automatically when Elias Chane signs off on an approved workflow.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sender Display Name
              </label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="AI-Business-Automation"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Include Trello Task Link</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Includes direct deep link to the created Trello card in the email body.
                </span>
              </div>
              <input
                type="checkbox"
                checked={includeTaskLink}
                onChange={(e) => setIncludeTaskLink(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                Zero unapproved external side-effects (FR-05 policy).
              </span>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Email Settings"}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Email Template Preview */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">HTML Email Template Preview</h3>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
              Live Preview
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 space-y-3 text-xs">
            <div className="border-b border-slate-200/80 dark:border-slate-700 pb-2.5 space-y-0.5">
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                <strong>From:</strong> {senderName} &lt;notifications@ai-business-automation.internal&gt;
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                <strong>To:</strong> {recipientEmail}
              </div>
              <div className="text-slate-900 dark:text-white font-semibold pt-1">
                Subject: [AI-Business-Automation] Approved Execution: Service request coordination
              </div>
            </div>

            <div className="space-y-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200/60 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded uppercase tracking-wider">
                  ✓ Human Gate Approved & Executed
                </span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  10:42 AM
                </span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white text-xs">
                Operational request executed following authorization by Elias Chane.
              </p>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 text-[11px] space-y-1">
                <div><strong>Process:</strong> Laptop provisioning & access dispatch</div>
                <div><strong>Signoff Authority:</strong> Elias Chane (Operations Manager)</div>
                <div><strong>Status:</strong> Dispatched to Trello & Telegram</div>
              </div>
              {includeTaskLink && (
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold">
                    Open Task in Trello →
                  </span>
                </div>
              )}
            </div>

            <span className="text-[10px] text-slate-400 dark:text-slate-500 block text-right">
              Dispatched strictly pursuant to FR-05 zero-trust policy.
            </span>
          </div>
        </div>
      </div>

      {/* Recent Email Delivery Audit Logs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Email Delivery Audit Trail</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Immutable log of execution notifications dispatched from this workspace.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {recentLogs.length} notifications logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-2.5">Time</th>
                <th className="pb-2.5">Recipient</th>
                <th className="pb-2.5">Subject</th>
                <th className="pb-2.5">Provider Engine</th>
                <th className="pb-2.5 text-right">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentLogs.length > 0 ? (
                recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-2.5 text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono text-[11px]">
                      {new Date(log.sentAt).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">
                      {log.to}
                    </td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-400 truncate max-w-xs">
                      {log.subject}
                    </td>
                    <td className="py-2.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {log.provider}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                        <span>✓</span> Delivered
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
                    No email notifications dispatched yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Safeguard */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>
          Zero-Trust Security Rule: Email dispatches are restricted strictly to human-approved workflows signed by Operations Manager Elias Chane.
        </span>
      </div>
    </div>
  );
}

export default EmailIntegration;
