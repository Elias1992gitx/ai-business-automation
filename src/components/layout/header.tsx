"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  // Generate dynamic breadcrumb segments
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbItems = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = seg.charAt(0).toUpperCase() + seg.slice(1);
    return { href, label };
  });

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between shrink-0 sticky top-0 z-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="text-slate-700">Acme Operations</span>
        {breadcrumbItems.length > 0 &&
          breadcrumbItems.map((item, index) => (
            <span key={item.href} className="flex items-center gap-2">
              <span className="text-slate-300">›</span>
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-slate-900 font-semibold">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-slate-800 transition-colors">
                  {item.label}
                </Link>
              )}
            </span>
          ))}
      </nav>

      {/* Top right actions: Search, Notifications, Avatar */}
      <div className="flex items-center gap-4">
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
            className="pl-9 pr-12 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white w-64 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
            ⌘K
          </kbd>
        </div>

        {/* Notifications Icon */}
        <button
          type="button"
          className="text-slate-500 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors relative"
          aria-label="Notifications"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-medium text-xs flex items-center justify-center shrink-0 cursor-pointer shadow-sm">
          MC
        </div>
      </div>
    </header>
  );
}

