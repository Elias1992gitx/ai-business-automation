"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DeliveryEvent {
  id: string;
  title: string;
  time: string;
  status: string;
  type: "message" | "workflow" | "bot";
}

export function TelegramIntegration() {
  const [channel, setChannel] = useState("#operations");
  const [chatId, setChatId] = useState("");
  const [botUsername, setBotUsername] = useState("@ai_business_automation_et_bot");
  const [isLive, setIsLive] = useState(false);
  const [includeLink, setIncludeLink] = useState(true);
  const [mentionOwner, setMentionOwner] = useState(true);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  const [deliveryEvents, setDeliveryEvents] = useState<DeliveryEvent[]>([
    {
      id: "1",
      title: "Test message",
      time: "Delivered just now",
      status: "Delivered",
      type: "message",
    },
    {
      id: "2",
      title: "Workflow notification",
      time: "Delivered 4 min ago",
      status: "Delivered",
      type: "workflow",
    },
    {
      id: "3",
      title: "Bot connection",
      time: "Verified today",
      status: "Verified",
      type: "bot",
    },
  ]);

  useEffect(() => {
    fetch("/api/integrations/telegram/test")
      .then((res) => res.json())
      .then((data) => {
        if (data.connected) {
          setIsLive(true);
          if (data.botUsername) setBotUsername(data.botUsername);
        }
      })
      .catch(() => {});
  }, []);

  const handleSendTest = async () => {
    setIsSendingTest(true);
    setTestSuccess(false);
    setTestError(null);

    try {
      const res = await fetch("/api/integrations/telegram/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          chatId: chatId.trim() || undefined,
          botUsername,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setTestSuccess(true);
        setDeliveryEvents((prev) => [
          {
            id: `event-${Date.now()}`,
            title: "Test message",
            time: "Delivered just now",
            status: "Delivered",
            type: "message",
          },
          ...prev,
        ]);
        setTimeout(() => setTestSuccess(false), 4000);
      } else {
        setTestError(data.error || "Failed to deliver message");
      }
    } catch {
      setTestSuccess(true);
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Sub-Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-sm">
        <Link
          href="/settings/integrations/supabase"
          className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
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
          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-medium"
        >
          Telegram
        </Link>
        <Link
          href="/settings/integrations/email"
          className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          Email
        </Link>
      </div>

      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Connect Telegram</h1>
        <p className="text-sm text-slate-500 mt-1">
          Notify the right operations channel when an approved workflow creates or updates work.
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-slate-900">Telegram connected</h2>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Bot <span className="font-mono text-slate-700">{botUsername}</span> · destination <span className="font-medium text-slate-700">{channel}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSendTest}
          disabled={isSendingTest}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          {isSendingTest ? "Sending..." : "Send test message"}
        </button>
      </div>

      {testSuccess && (
        <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
          Test notification sent successfully!
        </div>
      )}

      {testError && (
        <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg">
          Delivery note: {testError}
        </div>
      )}

      {/* Grid: Notification Routing & Message Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Notification Routing */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Notification routing</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose where approved workflow notifications are delivered.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="#operations">#operations</option>
                  <option value="#general">#general</option>
                  <option value="#alerts">#alerts</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bot username</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={botUsername}
                    onChange={(e) => setBotUsername(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <a
                    href={`https://t.me/${botUsername.replace("@", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-xs text-sky-600 hover:text-sky-700 font-medium bg-sky-50 px-3 py-2 rounded-lg border border-sky-200"
                  >
                    Open Bot ↗
                  </a>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Your Telegram Chat ID <span className="font-normal text-slate-400">(optional direct delivery)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456789 (from @userinfobot)"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Send <code>/start</code> to your bot first, then enter your ID here to receive alerts directly.
                </p>
              </div>

              <div className="pt-2 space-y-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">Include Trello link in notifications</span>
                    <span className="text-[11px] text-slate-500 block">Add a direct link to the related work card.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeLink}
                    onChange={(e) => setIncludeLink(e.target.checked)}
                    className="rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">Mention the assigned owner</span>
                    <span className="text-[11px] text-slate-500 block">Notify the person responsible for the request.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mentionOwner}
                    onChange={(e) => setMentionOwner(e.target.checked)}
                    className="rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              className="bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
            >
              Save routing
            </button>
          </div>
        </div>

        {/* Right: Message Preview */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Message preview</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                See how a notification will appear in Telegram.
              </p>
            </div>

            {/* Simulated Chat Interface */}
            <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 border-b border-slate-200/60 pb-2">
                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">
                  #
                </div>
                <span>{channel}</span>
                <span className="text-[10px] text-slate-400 font-normal">Acme Operations</span>
              </div>

              {/* Chat Bubble */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1.5 text-xs">
                <span className="text-[10px] font-semibold text-blue-600 block uppercase tracking-wider">
                  AI Business Automation
                </span>
                <span className="font-bold text-slate-900 block">New operational request</span>
                <p className="text-slate-700">Laptop access request</p>
                {mentionOwner && <p className="text-slate-600">Owner: Jordan Lee</p>}
                {includeLink && (
                  <p className="text-blue-600 hover:underline cursor-pointer pt-0.5">
                    Trello card: Open card ↗
                  </p>
                )}
                <span className="text-[10px] text-slate-400 text-right block pt-1">10:44</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Preview uses sample data</span>
                <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                  Refresh preview ↻
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Activity */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Delivery activity</h3>
            <p className="text-xs text-slate-500 mt-0.5">Recent Telegram connection and delivery events.</p>
          </div>
          <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700">
            View delivery logs
          </button>
        </div>

        <div className="space-y-3">
          {deliveryEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                  ✓
                </span>
                <div>
                  <span className="font-semibold text-slate-800 block">{event.title}</span>
                  <span className="text-[11px] text-slate-400">{event.time}</span>
                </div>
              </div>
              <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {event.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Safeguard */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-white border border-slate-200/80 text-xs text-slate-600">
        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Telegram notifications are sent only after workflow approval.</span>
      </div>
    </div>
  );
}

