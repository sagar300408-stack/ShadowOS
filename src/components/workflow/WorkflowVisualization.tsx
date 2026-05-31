"use client";

import { memo, useEffect, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  MarkerType,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "reactflow";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Cpu,
  FileSpreadsheet,
  Loader2,
  MessageCircle,
  Play,
  RefreshCcw,
  Sparkles,
  Split,
  Workflow,
  Zap,
} from "lucide-react";
import { useAnalysis } from "@/lib/AnalysisContext";
import { type WorkflowGraph, type WorkflowNodeData, type WorkflowResponse } from "@/lib/shadowos-api";

type FlowNodeData = WorkflowNodeData & {
  phase: "before" | "after" | "transform";
  index: number;
  active?: boolean;
  transforming?: boolean;
};

const nodeTypes = {
  shadowNode: memo(ShadowWorkflowNode),
};

export function WorkflowVisualization() {
  const { analysis, status, error } = useAnalysis();
  const workflow = analysis?.workflow;
  
  // Navigation & Interactive Tabs
  const [activeTab, setActiveTab] = useState<"split" | "simulator">("split");
  
  // Simulator States
  const [simState, setSimState] = useState<"idle" | "running" | "completed">("idle");
  const [simProgress, setSimProgress] = useState(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simGraphState, setSimGraphState] = useState<"before" | "transitioning" | "after">("before");

  const beforeFlow = useMemo(() => buildReactFlowGraph(workflow?.before, "before"), [workflow]);
  const afterFlow = useMemo(() => buildReactFlowGraph(workflow?.after, "after"), [workflow]);

  // Simulated Morphing Graph (4 stages, 500px canvas height)
  const simulatorFlow = useMemo(() => {
    if (!workflow) return { nodes: [], edges: [] };
    
    const beforeGraph = buildReactFlowGraph(workflow.before, "before");
    const afterGraph = buildReactFlowGraph(workflow.after, "after");
    
    if (simProgress === 0) {
      return beforeGraph;
    }
    
    const nodes = beforeGraph.nodes.map((node, index) => {
      const afterNode = afterGraph.nodes[index] || node;
      
      // Node 0: WhatsApp -> AI Extraction
      if (index === 0) {
        const isMorphed = simProgress >= 25;
        return {
          ...(isMorphed ? afterNode : node),
          position: { x: 0, y: isMorphed ? 0 : 0 },
          data: {
            ...(isMorphed ? afterNode.data : node.data),
            active: simProgress >= 25,
            transforming: simProgress < 25 && simState === "running",
            label: isMorphed ? afterNode.data.label : node.data.label
          }
        };
      }
      
      // Node 1: Excel -> CRM Sync
      if (index === 1) {
        const isMorphed = simProgress >= 50;
        return {
          ...(isMorphed ? afterNode : node),
          position: { x: 0, y: isMorphed ? 135 : 135 },
          data: {
            ...(isMorphed ? afterNode.data : node.data),
            active: simProgress >= 50,
            transforming: simProgress === 25,
            label: simProgress === 25 ? "Syncing..." : (isMorphed ? afterNode.data.label : node.data.label)
          }
        };
      }
      
      // Node 2: Manual Follow-Up -> Automated Follow-Up
      if (index === 2) {
        const isMorphed = simProgress >= 75;
        return {
          ...(isMorphed ? afterNode : node),
          position: { x: 0, y: isMorphed ? 270 : 270 },
          data: {
            ...(isMorphed ? afterNode.data : node.data),
            active: simProgress >= 75,
            transforming: simProgress === 50,
            label: simProgress === 50 ? "Automating..." : (isMorphed ? afterNode.data.label : node.data.label)
          }
        };
      }
      
      // Node 3: Lost Lead -> Lead Recovered
      if (index === 3) {
        const isMorphed = simProgress >= 100;
        return {
          ...(isMorphed ? afterNode : node),
          position: { x: 0, y: isMorphed ? 405 : 405 },
          data: {
            ...(isMorphed ? afterNode.data : node.data),
            active: simProgress >= 100,
            transforming: simProgress === 75,
            label: simProgress === 75 ? "Recovering..." : (isMorphed ? afterNode.data.label : node.data.label)
          }
        };
      }
      
      return node;
    });

    const edges = beforeGraph.edges.map((edge, index) => {
      let stroke = "#f43f5e";
      let filter = "drop-shadow(0 0 4px rgba(244,63,94,0.15))";
      
      // Edge 0: index 0 -> index 1
      if (index === 0 && simProgress >= 25) {
        stroke = simProgress === 25 ? "#eab308" : "#10b981";
        filter = simProgress === 25 ? "drop-shadow(0 0 6px rgba(234,179,8,0.4))" : "drop-shadow(0 0 8px rgba(16,185,129,0.5))";
      }
      
      // Edge 1: index 1 -> index 2
      if (index === 1 && simProgress >= 50) {
        stroke = simProgress === 50 ? "#eab308" : "#10b981";
        filter = simProgress === 50 ? "drop-shadow(0 0 6px rgba(234,179,8,0.4))" : "drop-shadow(0 0 8px rgba(16,185,129,0.5))";
      }
      
      // Edge 2: index 2 -> index 3
      if (index === 2 && simProgress >= 75) {
        stroke = simProgress === 75 ? "#eab308" : "#10b981";
        filter = simProgress === 75 ? "drop-shadow(0 0 6px rgba(234,179,8,0.4))" : "drop-shadow(0 0 8px rgba(16,185,129,0.5))";
      }

      return {
        ...edge,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: stroke,
          width: 18,
          height: 18,
        },
        style: {
          ...edge.style,
          stroke,
          strokeWidth: stroke === "#f43f5e" ? 2.2 : 3,
          filter,
        }
      };
    });

    return { nodes, edges };
  }, [workflow, simProgress, simState]);

  const runTransformation = () => {
    if (simState === "running") return;
    setSimState("running");
    setSimGraphState("before");
    setSimProgress(0);
    setSimLogs(["[SIMULATOR] Initiating operational transformation flow..."]);

    const steps = [
      {
        progress: 25,
        log: "Intercepting WhatsApp inbound events... Activating AI Extraction.",
        graph: "transitioning" as const,
      },
      {
        progress: 50,
        log: "Orchestrating CRM synchronization. Removing Excel dependency...",
        graph: "transitioning" as const,
      },
      {
        progress: 75,
        log: "Deploying Automated Follow-Up responders and SLA escalation engine...",
        graph: "after" as const,
      },
      {
        progress: 100,
        log: "Operational transformation complete. Stalled leads resolved: 100%",
        graph: "after" as const,
      }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        setSimLogs(prev => [...prev, `[SIMULATOR] ${step.log}`]);
        setSimProgress(step.progress);
        setSimGraphState(step.graph);
        stepIndex++;
      } else {
        clearInterval(interval);
        setSimState("completed");
      }
    }, 1200);
  };

  const resetSimulator = () => {
    setSimState("idle");
    setSimProgress(0);
    setSimLogs([]);
    setSimGraphState("before");
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-cyan-500/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white">Workflow Intelligence Map</h2>
          <p className="mt-1.5 text-xs text-slate-400 max-w-3xl leading-relaxed">
            ShadowOS visualizes the hidden inefficiencies of manual workflows side-by-side with their optimized automated equivalents.
          </p>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex border border-cyan-500/20 bg-slate-950 p-1 shrink-0 self-start md:self-center">
          <button
            onClick={() => setActiveTab("split")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase transition rounded-none cursor-pointer ${
              activeTab === "split"
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Split className="size-3.5" />
            Split View
          </button>
          <button
            onClick={() => {
              setActiveTab("simulator");
              resetSimulator();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase transition rounded-none cursor-pointer ${
              activeTab === "simulator"
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Cpu className="size-3.5" />
            Transition Simulator
          </button>
        </div>
      </div>

      {status === "error" ? (
        <div className="border border-rose-500/25 bg-rose-950/20 p-4 text-xs text-rose-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        </div>
      ) : null}

      {/* VIEWPORT AREA */}
      {activeTab === "split" ? (
        // TAB 1: SPLIT SCREEN (concise Before and After side-by-side)
        <div className="grid gap-5 lg:grid-cols-2">
          <WorkflowPanel
            title="Before Workflow"
            subtitle="Fragmented channels lose customer intent one manual handoff at a time."
            tone="before"
            nodes={beforeFlow.nodes}
            edges={beforeFlow.edges}
            loading={status === "loading"}
          />
          <WorkflowPanel
            title="After Workflow"
            subtitle="AI Extraction and Auto-Response recover leads before they go cold."
            tone="after"
            nodes={afterFlow.nodes}
            edges={afterFlow.edges}
            loading={status === "loading"}
          />
        </div>
      ) : (
        // TAB 2: TRANSFORMATION SIMULATOR
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          {/* SIMULATOR CANVAS PANEL */}
          <section className="min-h-[660px] border border-cyan-500/15 bg-slate-950/40 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur relative flex flex-col justify-between">
            <div className="absolute top-0 right-0 border-l border-b border-cyan-500/20 bg-slate-950/80 px-3 py-1 text-[9px] font-mono tracking-widest text-cyan-400 uppercase">
              Transformation Engine
            </div>
            
            <div className="mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-400">
                Visual Transformation Canvas
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5 font-sans">
                {simGraphState === "before" && "Phase 1: Fragmented Manual State"}
                {simGraphState === "transitioning" && "Phase 2: Data Extraction & Synchronization"}
                {simGraphState === "after" && "Phase 3: Optimized Automated State"}
              </h3>
            </div>

            <div className="h-[500px] border border-cyan-500/10 bg-[#040816]/70 relative">
              {/* Laser scan line overlay during execution */}
              {simState === "running" && (
                <div className="absolute left-0 right-0 h-0.5 bg-cyan-500/60 shadow-[0_0_12px_rgba(34,211,238,0.6)] animate-[scan-laser_2s_linear_infinite] z-20 pointer-events-none" />
              )}
              
              {status === "loading" ? (
                <div className="grid h-full place-items-center">
                  <div className="flex items-center gap-3 text-xs text-cyan-200">
                    <Loader2 className="size-4 animate-spin" />
                    Initializing Transformation Canvas...
                  </div>
                </div>
              ) : (
                <ReactFlow
                  nodes={simulatorFlow.nodes}
                  edges={simulatorFlow.edges}
                  nodeTypes={nodeTypes}
                  fitView
                  fitViewOptions={{ padding: 0.15 }}
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable={false}
                  panOnDrag
                  zoomOnScroll={false}
                  connectionLineType={ConnectionLineType.SmoothStep}
                  proOptions={{ hideAttribution: true }}
                >
                  <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(6, 182, 212, 0.12)" />
                  <Controls showInteractive={false} position="bottom-right" />
                </ReactFlow>
              )}
            </div>

            {/* Sim Control Panel */}
            <div className="mt-4 flex items-center justify-between border-t border-cyan-500/10 pt-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={runTransformation}
                  disabled={simState === "running"}
                  className="inline-flex h-9 items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 text-xs tracking-wider uppercase transition border border-cyan-400/40 rounded-none disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Play className="size-3.5 fill-current" />
                  Run Simulator
                </button>
                {(simState === "running" || simState === "completed") && (
                  <button
                    onClick={resetSimulator}
                    disabled={simState === "running"}
                    className="inline-flex h-9 items-center justify-center border border-cyan-500/20 hover:border-cyan-400 text-cyan-300 font-bold px-3 text-xs tracking-wider uppercase transition rounded-none disabled:text-slate-600 disabled:border-slate-800 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <span className="text-slate-500">OPTIMIZATION:</span>
                <span>{simProgress}%</span>
              </div>
            </div>
          </section>

          {/* SIMULATOR LOGS PANEL */}
          <section className="border border-cyan-500/15 bg-slate-950/40 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur flex flex-col justify-between">
            <div>
              <div className="mb-4 flex items-center justify-between border-b border-cyan-500/15 pb-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-400 font-mono">
                  Transformation Logs
                </span>
                <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              <div className="border border-cyan-500/10 bg-slate-950 p-4 h-[490px] overflow-y-auto space-y-3 font-mono text-xs select-none">
                {simLogs.length === 0 ? (
                  <p className="text-slate-500 italic text-center pt-52">
                    Click 'Run Simulator' to trigger the automation sequence.
                  </p>
                ) : (
                  simLogs.map((log, index) => {
                    const isLast = index === simLogs.length - 1;
                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-2.5 transition-all duration-300 ${
                          isLast ? "text-cyan-300 font-semibold" : "text-slate-500"
                        }`}
                      >
                        <span className="text-[10px] text-cyan-600 mt-0.5">❯</span>
                        <span>{log}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {simState === "completed" && (
              <div className="mt-4 border border-emerald-500/25 bg-emerald-950/20 p-3.5 text-xs flex items-center gap-3">
                <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
                <div className="text-slate-300">
                  <span className="font-bold text-emerald-400 uppercase mr-1">Success:</span>
                  Workflow transformation complete. Operational drag eliminated by 62%.
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

type WorkflowPanelProps = {
  title: string;
  subtitle: string;
  tone: "before" | "after";
  nodes: Node<FlowNodeData>[];
  edges: Edge[];
  loading: boolean;
};

function WorkflowPanel({ title, subtitle, tone, nodes, edges, loading }: WorkflowPanelProps) {
  return (
    <section className="min-h-[660px] border border-cyan-500/15 bg-slate-950/40 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur sm:p-5 flex flex-col justify-between">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${tone === "before" ? "text-rose-450" : "text-emerald-400"}`}>
            {tone === "before" ? "Fragmented Path" : "Recovered Path"}
          </p>
          <h2 className="mt-1 text-lg font-bold text-white uppercase tracking-wider">{title}</h2>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">{subtitle}</p>
        </div>
        <div className={`grid size-9 shrink-0 place-items-center border ${tone === "before" ? "border-rose-500/20 bg-rose-950/30 text-rose-450" : "border-emerald-500/20 bg-emerald-950/30 text-emerald-400"}`}>
          {tone === "before" ? <AlertTriangle className="size-4.5" aria-hidden="true" /> : <Zap className="size-4.5" aria-hidden="true" />}
        </div>
      </div>

      <div className="h-[500px] border border-cyan-500/10 bg-[#040816]/70">
        {loading ? (
          <div className="grid h-full place-items-center">
            <div className="flex items-center gap-2 text-xs text-cyan-200">
              <Loader2 className="size-4 animate-spin" />
              Loading workflow...
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag
            zoomOnScroll={false}
            connectionLineType={ConnectionLineType.SmoothStep}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(6, 182, 212, 0.12)" />
            <Controls showInteractive={false} position="bottom-right" />
          </ReactFlow>
        )}
      </div>
    </section>
  );
}

function ShadowWorkflowNode({ data }: NodeProps<FlowNodeData>) {
  const after = data.phase === "after" || data.node_type === "automation" || data.node_type === "outcome";
  const risky = data.node_type === "risk" || data.severity === "high";
  const active = data.active;
  const transforming = data.transforming;

  return (
    <div
      className={`workflow-node min-w-[210px] border px-4 py-3 shadow-[0_18px_42px_rgba(0,0,0,0.32)] transition-all duration-500 ${
        transforming
          ? "border-yellow-500/40 bg-yellow-950/30 text-yellow-100 shadow-[0_0_15px_rgba(234,179,8,0.2)] animate-pulse"
          : active
            ? "border-emerald-500/55 bg-emerald-950/45 text-emerald-50 shadow-[0_0_15px_rgba(16,185,129,0.22)]"
            : after
              ? "border-emerald-500/15 bg-emerald-950/10 text-emerald-450 opacity-60"
              : risky
                ? "border-rose-500/35 bg-rose-950/20 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.05)]"
                : "border-cyan-500/25 bg-cyan-950/40 text-cyan-50"
      }`}
      style={{ animationDelay: `${data.index * 120}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className={`grid size-9 shrink-0 place-items-center border transition-all duration-300 ${
          transforming
            ? "border-yellow-500/30 bg-yellow-950 text-yellow-450"
            : active
              ? "border-emerald-500/30 bg-emerald-950 text-emerald-400"
              : "border-slate-800 bg-slate-900/60 text-slate-450"
        }`}>
          {transforming ? (
            <RefreshCcw className="size-4 animate-spin text-yellow-450" />
          ) : (
            <WorkflowNodeIcon label={data.label} nodeType={data.node_type} />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-white tracking-wide">{data.label}</p>
            {data.node_type === "automation" && active && (
              <span className="border border-emerald-500/30 bg-emerald-950 px-1 py-0.5 text-[8px] font-bold text-emerald-400 font-mono rounded uppercase">
                AI Agent
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-slate-500 font-mono">{data.node_type.replace("_", " ")}</p>
        </div>
      </div>
      {data.description ? <p className="mt-2.5 text-[11px] leading-relaxed text-slate-400 border-t border-cyan-500/5 pt-2">{data.description}</p> : null}
    </div>
  );
}

function WorkflowNodeIcon({ label, nodeType }: { label: string; nodeType: string }) {
  const normalized = label.toLowerCase();

  if (normalized.includes("whatsapp")) {
    return <MessageCircle className="size-4" aria-hidden="true" />;
  }
  if (normalized.includes("excel")) {
    return <FileSpreadsheet className="size-4" aria-hidden="true" />;
  }
  if (normalized.includes("extraction")) {
    return <Bot className="size-4" aria-hidden="true" />;
  }
  if (normalized.includes("crm") || normalized.includes("sync")) {
    return <RefreshCcw className="size-4" aria-hidden="true" />;
  }
  if (normalized.includes("recovery") || normalized.includes("recovered")) {
    return <CheckCircle2 className="size-4 text-emerald-400" aria-hidden="true" />;
  }
  if (nodeType === "risk") {
    return <AlertTriangle className="size-4 text-rose-450" aria-hidden="true" />;
  }
  return <Zap className="size-4" aria-hidden="true" />;
}

function buildReactFlowGraph(graph: WorkflowGraph | undefined, phase: "before" | "after") {
  if (!graph) {
    return { nodes: [], edges: [] };
  }

  const nodes: Node<FlowNodeData>[] = graph.nodes.map((node, index) => ({
    id: node.id,
    type: "shadowNode",
    position: {
      x: 0,
      y: index * 135,
    },
    data: {
      ...node.data,
      label: node.data.label,
      phase,
      index,
    },
  }));

  const edges: Edge[] = graph.edges.map((edge) => {
    const isAfter = phase === "after";
    const stroke = isAfter ? "#10b981" : "#f43f5e";
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      animated: isAfter,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: stroke,
        width: 18,
        height: 18,
      },
      style: {
        stroke,
        strokeWidth: 2.2,
        filter: isAfter ? "drop-shadow(0 0 8px rgba(16,185,129,0.4))" : "drop-shadow(0 0 4px rgba(244,63,94,0.15))",
      },
    };
  });

  return { nodes, edges };
}
