"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";

export function SignupView() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("Elias Chane");
  const [email, setEmail] = useState("elias@acme-operations.com");
  const [workspaceName, setWorkspaceName] = useState("Acme Operations");
  const [password, setPassword] = useState("password12345");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isConfirmationSent, setIsConfirmationSent] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg("Please enter your full name (at least 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg("Please enter a valid work email address.");
      return;
    }

    if (!workspaceName.trim()) {
      setErrorMsg("Please enter your workspace name.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (!agreeTerms) {
      setErrorMsg("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            workspace_name: workspaceName.trim(),
            role: "Operations Manager",
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // Check if user already exists (Supabase returns empty identities array)
      if (data?.user?.identities && data.user.identities.length === 0) {
        setErrorMsg("An account with this email address already exists. Please sign in instead.");
        return;
      }

      // If session is immediately established (email confirmation disabled or auto-confirmed)
      if (data?.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      // If user created but email confirmation is required
      if (data?.user) {
        setIsConfirmationSent(true);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create account. Please try again.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between p-6 sm:p-10 lg:p-14 font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Brand Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 text-[#0a2540]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a6 6 0 100 12 6 6 0 000-12z" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        </div>
        <div>
          <span className="font-bold text-sm tracking-tight text-slate-900 block leading-tight">
            AI-Business-Automation
          </span>
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Approval-first automation you can trust
          </span>
        </div>
      </div>

      {/* Main Grid: Left Value Prop & Right Sign Up Form */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto py-8">
        {/* Left Column (6 cols): Brand messaging */}
        <div className="lg:col-span-6 space-y-7">
          <div className="space-y-4">
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-slate-500">
              START WITH ONE PROCESS
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Build a workspace around the way work really happens.
            </h1>

            <p className="text-sm text-slate-600 max-w-lg leading-relaxed">
              Bring your operational context together, turn plain-language processes into reviewable workflows, and keep humans in control of every external action.
            </p>
          </div>

          {/* Value Props Bullet List */}
          <div className="space-y-3 pt-1 text-xs font-semibold text-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span>Process-first workspace</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span>Approval before execution</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span>Traceable outcomes</span>
            </div>
          </div>

          {/* Mint callout box */}
          <div className="p-3.5 rounded-xl bg-[#e6f4ea] border border-[#ceead6] text-[#137333] text-xs font-medium inline-block max-w-md">
            Synthetic demo data is welcome while you explore.
          </div>
        </div>

        {/* Right Column (6 cols): Sleek Workspace Registration Card */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-8 sm:p-9 shadow-sm space-y-5">
          {/* Card Top Brand */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#0a2540] mb-2">
              <div className="w-6 h-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
              <span className="font-bold text-xs tracking-tight text-slate-900">
                AI Business Automation
              </span>
            </div>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Approval-first automation you can trust
            </span>

            <h2 className="text-2xl font-bold text-slate-900 pt-2">Create your workspace</h2>
            <p className="text-xs text-slate-500">
              Set up a secure home for your operations team.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <svg className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {isConfirmationSent ? (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Check your email</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                We sent a confirmation link to <span className="font-semibold">{email}</span>. Please verify your email address to activate your account.
              </p>
              <div className="pt-2">
                <Link
                  href={`/login?email=${encodeURIComponent(email)}`}
                  className="inline-flex items-center justify-center w-full bg-[#0a2540] hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  Continue to Sign In →
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Elias Chane"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0a2540] focus:border-[#0a2540]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elias@acme-operations.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0a2540] focus:border-[#0a2540]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Workspace name
                </label>
                <input
                  type="text"
                  required
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Acme Operations"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0a2540] focus:border-[#0a2540]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0a2540] focus:border-[#0a2540]"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span>I agree to the Terms of Service and Privacy Policy</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#e2e8f0] hover:bg-[#cbd5e1] text-slate-900 text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 mt-1"
              >
                <span>{isLoading ? "Creating workspace..." : "Create workspace"}</span>
                <span>→</span>
              </button>
            </form>
          )}

          <div className="relative flex items-center justify-center pt-1">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 shrink-0 font-medium">
              Already have an account?
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          <Link
            href="/login"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 rounded-lg transition-colors block text-center"
          >
            Sign in instead
          </Link>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed pt-1">
            By creating an account, you agree to keep sensitive production data out of this demo workspace.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 pt-6 border-t border-slate-200/60 flex items-center justify-center gap-4">
        <span>© 2026 AI-Business-Automation</span>
        <span>•</span>
        <a href="#" className="hover:underline">Privacy</a>
        <span>•</span>
        <a href="#" className="hover:underline">Security</a>
      </footer>
    </div>
  );
}
