"use client";

import React, { useRef, useState, useMemo } from "react";
import { EdgeProps, Edge } from "./edge";

export interface CanvasNode {
  id: string;
  position: { x: number; y: number };
  type?: string;
  data: any;
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  type?: "animated" | "temporary" | string;
  label?: string;
}

interface CanvasProps {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  nodeTypes?: Record<string, React.ComponentType<{ data: any }>>;
  edgeTypes?: Record<string, React.ComponentType<EdgeProps>>;
  fitView?: boolean;
  className?: string;
}

export function Canvas({
  nodes,
  edges,
  nodeTypes = {},
  edgeTypes = { animated: Edge.Animated, temporary: Edge.Temporary },
  fitView = true,
  className = "",
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 30, y: 140 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Map nodes by id for quick lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, CanvasNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Handle pan drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left-click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(0.8);
    setPan({ x: 40, y: 140 });
  };

  // Node width estimation for handle anchors (standard node width is ~280px, height ~160px)
  const NODE_WIDTH = 290;
  const NODE_HEIGHT = 160;

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-[520px] sm:h-[580px] bg-slate-900/95 overflow-hidden select-none cursor-grab active:cursor-grabbing border border-slate-800 rounded-2xl shadow-xl ${className}`}
    >
      {/* Blueprint / Dot Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      />

      {/* Floating Canvas Controls */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-slate-800/90 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-xl shadow-lg">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(z + 0.15, 1.4))}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/70 transition-colors font-bold text-xs"
          title="Zoom In"
        >
          +
        </button>
        <span className="text-[11px] font-mono text-slate-400 px-1 min-w-[38px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(z - 0.15, 0.45))}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/70 transition-colors font-bold text-xs"
          title="Zoom Out"
        >
          -
        </button>
        <div className="w-px h-4 bg-slate-700 mx-0.5" />
        <button
          type="button"
          onClick={handleResetView}
          className="px-2.5 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/70 transition-colors text-[11px] font-medium"
          title="Reset to Center"
        >
          Fit View
        </button>
      </div>

      {/* Canvas Canvas Transformation Layer */}
      <div
        className="absolute inset-0 transform-gpu origin-top-left transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* SVG Edges Layer */}
        <svg
          className="absolute inset-0 pointer-events-none overflow-visible w-[3500px] h-[1500px]"
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <defs>
            <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>

          {edges.map((edge) => {
            const sourceNode = nodeMap.get(edge.source);
            const targetNode = nodeMap.get(edge.target);

            if (!sourceNode || !targetNode) return null;

            // Source handle is on the right of source node
            const sourceX = sourceNode.position.x + NODE_WIDTH;
            const sourceY = sourceNode.position.y + NODE_HEIGHT / 2;

            // Target handle is on the left of target node
            const targetX = targetNode.position.x;
            const targetY = targetNode.position.y + NODE_HEIGHT / 2;

            const EdgeComponent =
              (edge.type && edgeTypes[edge.type]) ||
              (edge.type === "temporary" ? Edge.Temporary : Edge.Animated);

            return (
              <EdgeComponent
                key={edge.id}
                id={edge.id}
                sourceX={sourceX}
                sourceY={sourceY}
                targetX={targetX}
                targetY={targetY}
                label={edge.label}
              />
            );
          })}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((node) => {
          const NodeRenderer =
            (node.type && nodeTypes[node.type]) ||
            (({ data }: { data: any }) => (
              <div className="p-4 bg-white rounded-xl shadow-md border border-slate-200">
                <div className="font-bold text-sm">{data.label}</div>
                <div className="text-xs text-slate-500">{data.description}</div>
              </div>
            ));

          return (
            <div
              key={node.id}
              className="absolute pointer-events-auto"
              style={{
                left: `${node.position.x}px`,
                top: `${node.position.y}px`,
                width: `${NODE_WIDTH}px`,
              }}
            >
              <NodeRenderer data={node.data} />
            </div>
          );
        })}
      </div>

      {/* Canvas Footnote Watermark */}
      <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="font-medium text-slate-300">Interactive Canvas:</span>
        <span>Drag to pan · Click & explore workflow stages</span>
      </div>
    </div>
  );
}

