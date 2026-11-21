"use client";

import React from "react";

export interface EdgeProps {
  id?: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  label?: string;
  style?: React.CSSProperties;
  className?: string;
}

function getBezierPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
) {
  const dx = targetX - sourceX;
  const controlPointOffset = Math.max(Math.abs(dx) * 0.45, 40);

  return `M ${sourceX} ${sourceY} C ${sourceX + controlPointOffset} ${sourceY}, ${
    targetX - controlPointOffset
  } ${targetY}, ${targetX} ${targetY}`;
}

export function AnimatedEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  label,
  className = "",
}: EdgeProps) {
  const pathData = getBezierPath(sourceX, sourceY, targetX, targetY);
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  return (
    <g className={`edge-animated group ${className}`}>
      {/* Background shadow stroke */}
      <path
        d={pathData}
        fill="none"
        stroke="#cbd5e1"
        strokeWidth={2}
        className="transition-colors group-hover:stroke-emerald-400"
      />
      {/* Foreground animated flow stroke */}
      <path
        d={pathData}
        fill="none"
        stroke="#10b981"
        strokeWidth={2.5}
        strokeDasharray="6 6"
        className="animate-[flow_1.5s_linear_infinite]"
      />
      {/* Optional edge label */}
      {label && (
        <foreignObject
          x={midX - 60}
          y={midY - 12}
          width={120}
          height={24}
          className="pointer-events-none overflow-visible"
        >
          <div className="flex items-center justify-center">
            <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[9px] font-semibold text-slate-600 shadow-2xs whitespace-nowrap">
              {label}
            </span>
          </div>
        </foreignObject>
      )}
    </g>
  );
}

export function TemporaryEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  label,
  className = "",
}: EdgeProps) {
  const pathData = getBezierPath(sourceX, sourceY, targetX, targetY);
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  return (
    <g className={`edge-temporary group ${className}`}>
      {/* Dashed edge */}
      <path
        d={pathData}
        fill="none"
        stroke="#f59e0b"
        strokeWidth={2}
        strokeDasharray="4 4"
        className="transition-colors group-hover:stroke-amber-600"
      />
      {/* Optional edge label */}
      {label && (
        <foreignObject
          x={midX - 60}
          y={midY - 12}
          width={120}
          height={24}
          className="pointer-events-none overflow-visible"
        >
          <div className="flex items-center justify-center">
            <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[9px] font-semibold text-amber-800 shadow-2xs whitespace-nowrap">
              {label}
            </span>
          </div>
        </foreignObject>
      )}
    </g>
  );
}

export const Edge = {
  Animated: AnimatedEdge,
  Temporary: TemporaryEdge,
};

