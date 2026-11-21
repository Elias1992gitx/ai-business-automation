import Link from "next/link";
import { BusinessAutomationWorkflowCanvas } from "@/src/components/ai-elements/workflow-canvas";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between font-sans selection:bg-slate-900 selection:text-white scroll-smooth">
      <header className="w-full bg-[#f8fafc]/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 px-6 sm:px-12 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 text-[#0a2540]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6a6 6 0 100 12 6 6 0 000-12z"
                />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 block leading-tight">
                AI-Business-Automation
              </span>
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <svg
                  className="w-3 h-3 text-slate-400"
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
                Approval-first automation you can trust
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
              <a
                href="#product"
                className="hover:text-slate-900 transition-colors"
              >
                Product
              </a>
              <a
                href="#how-it-works"
                className="hover:text-slate-900 transition-colors"
              >
                How it works
              </a>
            </nav>

            <div className="hidden md:block w-px h-4 bg-slate-300" />

            <div className="flex items-center gap-2.5 sm:gap-3">
              <Link
                href="/login?demo=true"
                className="text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                title="1-Click sign in as Elias Chane (Operations Manager)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Demo login
              </Link>
              <Link
                href="/login"
                className="text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors px-2 py-1.5"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-xs sm:text-sm font-semibold bg-[#0a2540] hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
        <div
          id="product"
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          {/* Left Column (Hero Content) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800 tracking-wider uppercase">
              AI-POWERED OPERATIONS
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Turn Business Processes Into Intelligent Automation
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md">
              Describe the work. AI finds opportunities and builds a workflow
              your team can review and approve.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-[#0a2540] hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                Get Started →
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shadow-2xs"
              >
                <svg
                  className="w-3.5 h-3.5 text-slate-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Explore How It Works
              </a>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
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
              <span>Human approval required before execution</span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                    THE AUTOMATION PATH
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1.5">
                    How AI-Business-Automation works
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-700">
                  <svg
                    className="w-3.5 h-3.5 text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Approval-first
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-11 items-center gap-1 sm:gap-2">
                  <div className="col-span-3 bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
                    <div className="w-6 h-6 text-slate-600 mb-1.5">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">
                      Process input
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Describe the work
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center justify-center text-slate-400 text-xs">
                    <span className="text-slate-400 font-bold">• →</span>
                  </div>

                  <div className="col-span-3 bg-slate-100 border border-slate-300 rounded-xl p-3 shadow-2xs">
                    <div className="w-6 h-6 text-blue-600 mb-1.5">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">
                      AI analysis
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Find friction
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center justify-center text-slate-400 text-xs">
                    <span className="text-slate-400 font-bold">• →</span>
                  </div>

                  <div className="col-span-3 bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
                    <div className="w-6 h-6 text-amber-500 mb-1.5">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">
                      Recommendations
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Choose opportunities
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-11">
                  <div className="col-span-3" />
                  <div className="col-span-1" />
                  <div className="col-span-3 flex justify-center py-1">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                  <div className="col-span-1" />
                  <div className="col-span-3" />
                </div>

                <div className="grid grid-cols-11 items-center gap-1 sm:gap-2">
                  <div className="col-span-3 bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
                    <div className="w-6 h-6 text-indigo-600 mb-1.5">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">
                      Build workflow
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Structure the steps
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center justify-center text-slate-400 text-xs">
                    <span className="text-slate-400 font-bold">→</span>
                  </div>

                  <div className="col-span-3 bg-[#0a2540] text-white rounded-xl p-3 shadow-md border border-[#0f3459]">
                    <div className="flex items-center justify-between mb-1">
                      <div className="w-5 h-5 text-blue-400">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <span className="text-[9px] font-bold bg-blue-600/50 text-blue-100 px-1.5 py-0.5 rounded uppercase">
                        Required
                      </span>
                    </div>
                    <div className="font-bold text-white text-xs">Approval</div>
                    <div className="text-[10px] text-slate-300 mt-0.5">
                      Review actions
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center justify-center text-slate-400 text-xs">
                    <span className="text-slate-400 font-bold">→</span>
                  </div>

                  <div className="col-span-3 bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 text-emerald-600">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <div className="font-bold text-slate-900 text-xs">
                        Execute
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Run approved actions
                    </div>
                    <div className="grid grid-cols-2 gap-1 pt-1">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-[9px] text-slate-700">
                        ✉ Gmail
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-[9px] text-slate-700">
                        ⊞ Trello
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-[9px] text-slate-700">
                        ✈ Telegram
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-11">
                  <div className="col-span-3" />
                  <div className="col-span-1" />
                  <div className="col-span-3 flex justify-center py-1">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                  <div className="col-span-1" />
                  <div className="col-span-3" />
                </div>

                {/* Row 3: Step 7: Monitor */}
                <div className="flex justify-center">
                  <div className="w-56 bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        Monitor
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Track results
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Note */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
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
                <span>External actions wait for approval.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Item Metric Strip */}
        <div className="bg-slate-100/70 border border-slate-200/90 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
              <svg
                className="w-5 h-5 text-slate-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 leading-tight">
                7 steps
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                one clear path
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
              <svg
                className="w-5 h-5 text-slate-700"
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
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 leading-tight">
                1 approval gate
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                before execution
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
              <svg
                className="w-5 h-5 text-slate-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 leading-tight">
                Every run
              </div>
              <div className="text-xs text-slate-500 mt-0.5">tracked</div>
            </div>
          </div>
        </div>

        {/* Interactive AI-Elements Workflow Canvas Section */}
        <section id="how-it-works" className="space-y-4 pt-4">
          <div className="space-y-1">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-800 tracking-wider uppercase">
              INTERACTIVE WORKFLOW CANVAS
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Live Flow Architecture & Decision Routing
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Explore the entire automation lifecycle powered by AI-Elements.
              Pan, zoom, and inspect each stage: from plain-language intake and
              Gemini diagnosis to Elias Chane&apos;s human gate and
              multi-channel dispatch.
            </p>
          </div>

          <BusinessAutomationWorkflowCanvas />
        </section>

        {/* Feature Cards: One clear path from work to outcome */}
        <div id="security" className="space-y-6 pt-4">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            One clear path from work to outcome
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Understand the process
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Map stages, owners, and handoffs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Recommend what is safe
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Surface practical automation opportunities.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Keep control</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review, approve, and trace every run.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner (Navy Blue) */}
        <div className="bg-[#0a2540] rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md text-white">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Make your next process easier to trust.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Start with one operational workflow.
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
            <Link
              href="/signup"
              className="bg-white hover:bg-slate-100 text-slate-900 font-semibold px-6 py-2.5 rounded-lg text-sm transition shadow-sm text-center"
            >
              Create your workspace
            </Link>
            <Link
              href="/login"
              className="text-xs text-slate-300 hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Sign in to existing workspace
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-[#f8fafc] py-6 px-6 sm:px-12 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            © 2026 AI-Business-Automation · Managed by Elias Chane (Operations
            Manager)
          </span>
          <div className="flex items-center gap-4">
            <a
              href="#security"
              className="hover:text-slate-800 transition-colors"
            >
              Privacy
            </a>
            <Link
              href="/login"
              className="hover:text-slate-800 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
