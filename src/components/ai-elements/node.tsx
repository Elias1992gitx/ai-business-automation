"use client";

import React from "react";

interface NodeProps extends React.HTMLAttributes<HTMLDivElement> {
  handles?: {
    source?: boolean;
    target?: boolean;
  };
  highlighted?: boolean;
  variant?: "default" | "dark" | "approval" | "success" | "warning";
  children: React.ReactNode;
}

export function Node({
  handles = { source: true, target: true },
  highlighted = false,
  variant = "default",
  className = "",
  children,
  ...props
}: NodeProps) {
  let variantClasses = "bg-white border-slate-200 text-slate-800 shadow-sm";
  if (variant === "dark" || variant === "approval") {
    variantClasses = "bg-[#0a2540] border-[#133e66] text-white shadow-md";
  } else if (variant === "success") {
    variantClasses = "bg-emerald-50/50 border-emerald-200 text-slate-800 shadow-sm";
  } else if (variant === "warning") {
    variantClasses = "bg-amber-50/50 border-amber-200 text-slate-800 shadow-sm";
  }

  return (
    <div
      className={`relative rounded-xl border p-4 min-w-[260px] max-w-[320px] transition-all hover:shadow-md ${variantClasses} ${
        highlighted ? "ring-2 ring-blue-500 shadow-lg" : ""
      } ${className}`}
      {...props}
    >
      {/* Target Handle (Left/Incoming) */}
      {handles?.target && (
        <div
          data-handle="target"
          className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-xs flex items-center justify-center z-10"
          title="Input connection"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
      )}

      {/* Node Body */}
      <div className="space-y-3">{children}</div>

      {/* Source Handle (Right/Outgoing) */}
      {handles?.source && (
        <div
          data-handle="source"
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-xs flex items-center justify-center z-10"
          title="Output connection"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
      )}
    </div>
  );
}

export function NodeHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`space-y-1 border-b border-slate-100/80 pb-2.5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function NodeTitle({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4 className={`font-bold text-xs sm:text-sm tracking-tight flex items-center justify-between gap-2 ${className}`} {...props}>
      {children}
    </h4>
  );
}

export function NodeDescription({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-[11px] text-slate-500 leading-snug ${className}`} {...props}>
      {children}
    </p>
  );
}

export function NodeContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-xs space-y-2 py-1 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function NodeFooter({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`pt-2 border-t border-slate-100/80 text-[10px] text-slate-400 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}

