"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProcessIntakeForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleTitle = "Service request coordination";
  const sampleDescription =
    "Our operations team receives service requests, manually categorizes them, assigns tasks to employees, and sends follow-up messages to check completion.";

  const handleUseExample = () => {
    setTitle(sampleTitle);
    setDescription(sampleDescription);
    setError(null);
  };

  const handleSubmit = async (action: "analyze" | "draft") => {
    if (!title.trim() || !description.trim()) {
      setError("Please fill in both the process title and workflow description.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/processes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          action,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save process. Please try again.");
      }

      const data = await response.json();
      const processId = data.process?.id || "demo-process";

      if (action === "analyze") {
        router.push(`/processes/${processId}`);
      } else {
        router.push("/processes");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Describe a process</h1>
        <p className="text-sm text-slate-500 mt-1">
          Start with how work happens today. AI Business Automation will identify bottlenecks and safe opportunities for automation.
        </p>
      </div>

      {/* Stepper Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Process journey</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            You are defining the starting point for a safe, reviewable automation.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 pt-1">
          {/* Step 1 */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-900 block leading-tight">Describe</span>
              <span className="text-[11px] text-slate-400 block">Current screen</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-semibold text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 block leading-tight">Analyze</span>
              <span className="text-[11px] text-slate-400 block">AI maps the work</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-semibold text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 block leading-tight">Review</span>
              <span className="text-[11px] text-slate-400 block">Human approval</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-semibold text-xs flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 block leading-tight">Execute</span>
              <span className="text-[11px] text-slate-400 block">Trace the result</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form (Left) & Info Guides (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Process details</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Give us enough context to understand the work and its handoffs.
            </p>
          </div>

          {error && (
            <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Process Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Process title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Service request coordination"
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>

            {/* Workflow Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                How does this process work today? <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Describe each step, who is involved, where information comes from, and where it goes..."
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-400 leading-relaxed resize-none"
              />
            </div>

            {/* Privacy / Synthetic Data Notice */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Use synthetic or non-confidential data for this demo.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSubmit("analyze")}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              {isSubmitting ? "Processing..." : "Analyze process"}
            </button>

            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              disabled={isSubmitting}
              className="text-xs font-medium text-slate-700 bg-white border border-slate-200 px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            >
              Save as draft
            </button>
          </div>
        </div>

        {/* Right Column: Guides & Example (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* What AI will do */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              What AI Business Automation will do
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <span className="font-semibold text-slate-800 block">Map the current process</span>
                  <span className="text-slate-500 text-[11px] leading-relaxed">
                    Identify stages, handoffs, inputs, and outcomes.
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <span className="font-semibold text-slate-800 block">Spot manual bottlenecks</span>
                  <span className="text-slate-500 text-[11px] leading-relaxed">
                    Find repetitive, delayed, or error-prone activities.
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <span className="font-semibold text-slate-800 block">Recommend safe automation</span>
                  <span className="text-slate-500 text-[11px] leading-relaxed">
                    Prioritize practical opportunities with clear rationale.
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <span className="font-semibold text-slate-800 block">Prepare a reviewable workflow</span>
                  <span className="text-slate-500 text-[11px] leading-relaxed">
                    Show proposed actions before anything is executed.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Example Process Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-semibold text-slate-900">Example process</h4>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;Our operations team receives service requests, manually categorizes them, assigns tasks to employees, and sends follow-up messages to check completion.&quot;
            </p>
            <button
              type="button"
              onClick={handleUseExample}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Use this example →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

