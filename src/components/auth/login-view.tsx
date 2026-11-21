"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const redirectedFrom = searchParams.get("redirectedFrom");
  const queryError = searchParams.get("error");
  const isDemoParam = searchParams.get("demo") === "true";
  const isVerified = searchParams.get("verified") === "true";
  const defaultEmail = searchParams.get("email") || (isVerified ? "" : "elias@acme-operations.com");

  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(isVerified ? "" : "password12345");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (queryError) {
      const decoded = decodeURIComponent(queryError);
      if (decoded.toLowerCase().includes("could not verify authentication code")) {
        setErrorMsg("Your verification link has already been processed or expired. If your email is confirmed, sign in below.");
      } else {
        setErrorMsg(decoded);
      }
    }
  }, [queryError]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both work email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setErrorMsg(
            "Please confirm your email address before signing in. Check your inbox for the confirmation link.",
          );
        } else if (
          error.message.toLowerCase().includes("invalid login credentials")
        ) {
          setErrorMsg(
            "Invalid email or password. Please verify your credentials and try again.",
          );
        } else {
          setErrorMsg(error.message);
        }
        return;
      }

      if (data?.session) {
        const destination = redirectedFrom || "/dashboard";
        router.push(destination);
        router.refresh();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Authentication failed. Please try again.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setEmail("elias@acme-operations.com");
    setPassword("password12345");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "elias@acme-operations.com",
        password: "password12345",
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data?.session) {
        const destination = redirectedFrom || "/dashboard";
        router.push(destination);
        router.refresh();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Demo sign in failed. Please try again.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto trigger demo login if ?demo=true was provided in URL
  useEffect(() => {
    if (isDemoParam) {
      handleDemoLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoParam]);

  const handleSSO = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            redirectedFrom || "/dashboard",
          )}`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to initiate single sign-on.";
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
          <span className="font-bold text-sm tracking-tight text-slate-900 block leading-tight">
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

      {/* Main Grid: Left Value Prop & Right Sign In Form */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto py-8">
        {/* Left Column (6 cols): Brand messaging & Stepper */}
        <div className="lg:col-span-6 space-y-7">
          <div className="space-y-4">
            <span className="inline-block px-2.5 py-1 rounded bg-slate-200/70 text-slate-700 text-xs font-semibold">
              AI Business Automation
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Make operational work easier to trust.
            </h1>

            <p className="text-sm text-slate-600 max-w-lg leading-relaxed">
              Your workspace keeps every process, recommendation, approval, and
              execution trace in one clear flow.
            </p>
          </div>

          {/* Stepper matching reference design */}
          <div className="space-y-3 pt-2 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <span>Describe</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <span>Analyze</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                3
              </span>
              <div className="flex items-center gap-2">
                <span>Review</span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Human approval
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                4
              </span>
              <span>Execute</span>
            </div>
          </div>

          {/* Footnote */}
          <div className="pt-6 border-t border-slate-200/80 flex items-center gap-2 text-xs text-slate-600 font-medium">
            <svg
              className="w-4 h-4 text-slate-500"
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
            <span>External actions never run without your approval.</span>
          </div>
        </div>

        {/* Right Column (6 cols): Sleek Sign In Card */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-8 sm:p-9 shadow-sm space-y-6">
          {/* Card Top Brand */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#0a2540] mb-2">
              <div className="w-6 h-6">
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
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
              <span className="font-bold text-xs tracking-tight text-slate-900">
                AI Business Automation
              </span>
            </div>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
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
            <h2 className="text-2xl font-bold text-slate-900 pt-2">
              Welcome back
            </h2>
            <p className="text-xs text-slate-500">
              Sign in to continue to Acme Operations or another workspace.
            </p>
          </div>

          {/* Quick Demo Login Action Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Demo Credentials: Elias Chane
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                Operations Manager
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-snug">
              Sign in instantly with pre-verified manager credentials:{" "}
              <code className="bg-emerald-100/60 px-1 py-0.5 rounded font-mono text-[10px]">
                elias@acme-operations.com
              </code>
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg
                className="w-4 h-4 text-emerald-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>{isLoading ? "Signing in..." : "Demo login"}</span>
            </button>
          </div>

          {isVerified && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 shadow-2xs">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                ✓
              </span>
              <div>
                <span className="font-bold block">Email confirmed successfully!</span>
                <span className="text-[11px] text-emerald-700">
                  Your isolated workspace has been provisioned. Enter your password to sign in.
                </span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <svg
                className="w-4 h-4 text-rose-600 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
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
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0a2540] focus:border-[#0a2540]"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span>Remember me</span>
              </label>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0a2540] hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>→]</span>
              <span>{isLoading ? "Signing in..." : "Sign in"}</span>
            </button>
          </form>

          <div className="relative flex items-center justify-center pt-1">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 shrink-0 font-medium">
              New to AI Business Automation?
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          <Link
            href="/signup"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 rounded-lg transition-colors block text-center"
          >
            Create an account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 pt-6 border-t border-slate-200/60 flex items-center justify-center gap-4">
        <span>© 2026 AI-Business-Automation</span>
        <span>•</span>
        <a href="#" className="hover:underline">
          Privacy
        </a>
      </footer>
    </div>
  );
}
