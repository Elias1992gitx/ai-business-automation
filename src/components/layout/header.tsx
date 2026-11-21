"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/hooks";
import { useTheme } from "@/src/components/theme/theme-provider";

export function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fullName = user?.user_metadata?.full_name || "Elias Chane";
  const email = user?.email || "elias@acme-operations.com";
  const role = user?.user_metadata?.role || "Operations Manager";
  const workspaceName = user?.user_metadata?.workspace_name || "Acme Operations";

  // Derive initials
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0].toUpperCase())
    .slice(0, 2)
    .join("") || "EC";

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate dynamic breadcrumb segments
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbItems = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = seg.charAt(0).toUpperCase() + seg.slice(1);
    return { href, label };
  });

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20 transition-colors duration-200">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span className="text-slate-700 dark:text-slate-300">{workspaceName}</span>
        {breadcrumbItems.length > 0 &&
          breadcrumbItems.map((item, index) => (
            <span key={item.href} className="flex items-center gap-2">
              <span className="text-slate-300 dark:text-slate-600">›</span>
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-slate-900 dark:text-white font-semibold">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                  {item.label}
                </Link>
              )}
            </span>
          ))}
      </nav>

      {/* Top right actions: Search, Theme Switcher, Notifications, Avatar */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative">
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search processes"
            className="pl-9 pr-12 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white dark:focus:bg-slate-800 w-56 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500 font-mono bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
            ⌘K
          </kbd>
        </div>

        {/* Quick Theme Switcher Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? (
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Notifications Icon */}
        <button
          type="button"
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          aria-label="Notifications"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white absolute top-2 right-2" />
        </button>

        {/* User Profile & Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 text-white font-medium text-xs flex items-center justify-center shrink-0 cursor-pointer shadow-xs hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600 transition-all"
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            {initials}
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                  {fullName}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {email}
                </div>
                <div className="text-[10px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full inline-block font-medium mt-1.5">
                  {role}
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Overview Dashboard
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                >
                  Settings & Preferences
                </Link>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-medium"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
