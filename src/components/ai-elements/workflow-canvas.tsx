"use client";

import { useId } from "react";
import { Canvas } from "@/src/components/ai-elements/canvas";
import { Edge } from "@/src/components/ai-elements/edge";
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@/src/components/ai-elements/node";

export function BusinessAutomationWorkflowCanvas() {
  const baseId = useId();

  const nodeIds = {
    start: `${baseId}-start`,
    process1: `${baseId}-process1`,
    decision: `${baseId}-decision`,
    output1: `${baseId}-output1`,
    output2: `${baseId}-output2`,
    process2: `${baseId}-process2`,
  };

  const nodes = [
    {
      id: nodeIds.start,
      position: { x: 20, y: 80 },
      type: "workflow",
      data: {
        label: "01 · Process Intake",
        description: "Submit operational procedures & constraints",
        handles: { source: true, target: false },
        badge: "Process Intake",
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
        role: "Operations Staff",
        details:
          "Staff inputs standard operating procedures (SOPs), team bottlenecks, volume, and service-level constraints.",
        icon: (
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
    },
    {
      id: nodeIds.process1,
      position: { x: 420, y: 80 },
      type: "workflow",
      data: {
        label: "02 · Gemini AI Diagnosis",
        description: "Analyze friction & synthesize opportunities",
        handles: { source: true, target: true },
        badge: "Gemini 2.0 Flash",
        badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
        role: "AI Reasoning Engine",
        details:
          "Identifies manual bottlenecks, computes ROI & hours saved, and generates 3 prioritized automation opportunities.",
        icon: (
          <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
      },
    },
    {
      id: nodeIds.decision,
      position: { x: 820, y: 80 },
      type: "workflow",
      data: {
        label: "03 · Human Approval Gate",
        description: "Enforce FR-05 Zero-Trust Manager Signoff",
        handles: { source: true, target: true },
        badge: "Required Checkpoint",
        badgeColor: "bg-amber-400 text-slate-900 border-amber-300 font-bold",
        role: "Elias Chane (Operations Manager)",
        details:
          "Crucial safeguard: External side effects remain locked until reviewed and signed off by the Operations Manager.",
        variant: "approval",
        icon: (
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
    },
    {
      id: nodeIds.output1,
      position: { x: 1220, y: -20 },
      type: "workflow",
      data: {
        label: "04 · Approved Execution",
        description: "Multi-channel verified side effects",
        handles: { source: true, target: true },
        badge: "Trello · Telegram · Email",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        role: "Multi-Channel Dispatcher",
        details:
          "Parallel creation of live Trello cards, Telegram channel alerts (@ai_business_automation_et_bot), & emails.",
        variant: "success",
        icon: (
          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      },
    },
    {
      id: nodeIds.output2,
      position: { x: 1220, y: 190 },
      type: "workflow",
      data: {
        label: "05 · Safe Halt / Revision",
        description: "Block unapproved external actions",
        handles: { source: true, target: true },
        badge: "Zero-Trust Guardrail",
        badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
        role: "Security Governor",
        details:
          "Zero unapproved writes. Rejection routes back to operations staff with manager feedback for adjustments.",
        variant: "warning",
        icon: (
          <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      },
    },
    {
      id: nodeIds.process2,
      position: { x: 1620, y: 80 },
      type: "workflow",
      data: {
        label: "06 · Audit Trail & Monitor",
        description: "Immutable execution log & observability",
        handles: { source: false, target: true },
        badge: "Supabase PostgreSQL",
        badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
        role: "Audit System",
        details:
          "Complete execution status, parameters, execution timestamps, and audit records stored in Supabase.",
        icon: (
          <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
      },
    },
  ];

  const edges = [
    {
      id: `${baseId}-edge-1`,
      source: nodeIds.start,
      target: nodeIds.process1,
      type: "animated",
      label: "Process Context",
    },
    {
      id: `${baseId}-edge-2`,
      source: nodeIds.process1,
      target: nodeIds.decision,
      type: "animated",
      label: "Draft Workflow",
    },
    {
      id: `${baseId}-edge-3`,
      source: nodeIds.decision,
      target: nodeIds.output1,
      type: "animated",
      label: "Approved by Manager",
    },
    {
      id: `${baseId}-edge-4`,
      source: nodeIds.decision,
      target: nodeIds.output2,
      type: "temporary",
      label: "Rejected / Needs Revision",
    },
    {
      id: `${baseId}-edge-5`,
      source: nodeIds.output1,
      target: nodeIds.process2,
      type: "animated",
      label: "Executed Actions",
    },
    {
      id: `${baseId}-edge-6`,
      source: nodeIds.output2,
      target: nodeIds.process2,
      type: "temporary",
      label: "Halt Recorded",
    },
  ];

  const nodeTypes = {
    workflow: ({ data }: { data: any }) => (
      <Node handles={data.handles} variant={data.variant}>
        <NodeHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="shrink-0">{data.icon}</span>
              <NodeTitle>{data.label}</NodeTitle>
            </div>
            {data.badge && (
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full border font-semibold shrink-0 ${data.badgeColor}`}
              >
                {data.badge}
              </span>
            )}
          </div>
          <NodeDescription>{data.description}</NodeDescription>
        </NodeHeader>
        <NodeContent>
          <p className="text-[11px] leading-relaxed text-inherit opacity-90">
            {data.details}
          </p>
        </NodeContent>
        <NodeFooter>
          <span className="font-medium text-[10px] text-inherit opacity-75">
            Role: {data.role}
          </span>
          <span className="text-[9px] font-mono text-inherit opacity-60">
            {data.handles?.source ? "→ Out" : "• End"}
          </span>
        </NodeFooter>
      </Node>
    ),
  };

  const edgeTypes = {
    animated: Edge.Animated,
    temporary: Edge.Temporary,
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
            <span>●</span> Live Visual Workflow
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-1">
            End-to-End Operational Automation Lifecycle
          </h3>
          <p className="text-xs text-slate-500">
            Intake $\to$ Gemini 2.0 Diagnosis $\to$ Elias Chane Human Approval $\to$ Trello, Telegram & Audit Trace.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-500 border-dashed" />
            <span className="text-[11px] text-slate-600 font-medium">Approved Path</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-500 border-dashed" />
            <span className="text-[11px] text-slate-600 font-medium">Safe Halt / Revision</span>
          </div>
        </div>
      </div>

      {/* Workflow Canvas */}
      <Canvas
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      />
    </div>
  );
}

export default BusinessAutomationWorkflowCanvas;

