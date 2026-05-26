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
  Bot,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  MessageCircle,
  RefreshCcw,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { fetchWorkflowGraph, type WorkflowGraph, type WorkflowNodeData, type WorkflowResponse } from "@/lib/shadowos-api";

type FlowNodeData = WorkflowNodeData & {
  phase: "before" | "after";
  index: number;
};

const nodeTypes = {
  shadowNode: memo(ShadowWorkflowNode),
};

export function WorkflowVisualization() {
  const [workflow, setWorkflow] = useState<WorkflowResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadWorkflow() {
      try {
        const graph = await fetchWorkflowGraph();
        if (!active) {
          return;
        }
        setWorkflow(graph);
        setStatus("ready");
      } catch (workflowError) {
        if (!active) {
          return;
        }
        setError(workflowError instanceof Error ? workflowError.message : "Workflow graph is unavailable.");
        setStatus("error");
      }
    }

    loadWorkflow();

    return () => {
      active = false;
    };
  }, []);

  const beforeFlow = useMemo(() => buildReactFlowGraph(workflow?.before, "before"), [workflow]);
  const afterFlow = useMemo(() => buildReactFlowGraph(workflow?.after, "after"), [workflow]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(248,113,113,0.13),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(52,211,153,0.16),transparent_30%),linear-gradient(135deg,rgba(2,6,23,0.98),rgba(5,10,24,0.98))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.055)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center border border-cyan-300/35 bg-cyan-300/10 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.18)]">
              <Workflow className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200">ShadowOS</p>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">Workflow Transformation</h1>
            </div>
          </div>
          <div className="inline-flex w-fit items-center gap-2 border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-2 text-sm text-emerald-100">
            {status === "loading" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
            Before pain, after recovery
          </div>
        </header>

        <div className="py-6">
          <p className="max-w-3xl text-lg leading-8 text-slate-300">
            ShadowOS turns the invisible drag of manual real estate operations into a living map: the old path where
            leads disappear, and the recovered path where automation keeps momentum alive.
          </p>
        </div>

        {status === "error" ? (
          <div className="mb-5 border border-rose-300/25 bg-rose-300/[0.08] p-4 text-sm text-rose-100">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <p>{error}</p>
            </div>
          </div>
        ) : null}

        <div className="grid flex-1 gap-5 pb-6 lg:grid-cols-2">
          <WorkflowPanel
            title="Before Workflow"
            subtitle="Manual systems lose intent one handoff at a time."
            tone="before"
            nodes={beforeFlow.nodes}
            edges={beforeFlow.edges}
            loading={status === "loading"}
          />
          <WorkflowPanel
            title="After Workflow"
            subtitle="AI extraction and automation recover the lead before it goes cold."
            tone="after"
            nodes={afterFlow.nodes}
            edges={afterFlow.edges}
            loading={status === "loading"}
          />
        </div>
      </section>
    </main>
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
    <section className="min-h-[620px] border border-white/[0.12] bg-slate-950/[0.72] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${tone === "before" ? "text-rose-200" : "text-emerald-200"}`}>
            {tone === "before" ? "Fragmented path" : "Recovered path"}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
        </div>
        <div className={`grid size-10 shrink-0 place-items-center border ${tone === "before" ? "border-rose-300/25 bg-rose-300/[0.08] text-rose-200" : "border-emerald-300/25 bg-emerald-300/[0.08] text-emerald-200"}`}>
          {tone === "before" ? <AlertTriangle className="size-5" aria-hidden="true" /> : <Zap className="size-5" aria-hidden="true" />}
        </div>
      </div>

      <div className="h-[430px] min-h-[430px] overflow-hidden border border-white/10 bg-[#050816]/80">
        {loading ? (
          <div className="grid h-full place-items-center">
            <div className="flex items-center gap-3 text-sm text-cyan-100">
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              Loading workflow graph
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag
            zoomOnScroll={false}
            connectionLineType={ConnectionLineType.SmoothStep}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(148,163,184,0.22)" />
            <Controls showInteractive={false} position="bottom-right" />
          </ReactFlow>
        )}
      </div>
    </section>
  );
}

function ShadowWorkflowNode({ data }: NodeProps<FlowNodeData>) {
  const after = data.phase === "after";
  const risky = data.node_type === "risk" || data.severity === "high";

  return (
    <div
      className={`workflow-node min-w-[210px] border px-4 py-3 shadow-[0_18px_42px_rgba(0,0,0,0.32)] ${
        after
          ? "border-emerald-300/35 bg-emerald-300/[0.09] text-emerald-50"
          : risky
            ? "border-rose-300/35 bg-rose-300/[0.08] text-rose-50"
            : "border-cyan-300/25 bg-cyan-300/[0.07] text-cyan-50"
      }`}
      style={{ animationDelay: `${data.index * 120}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className={`grid size-10 place-items-center border ${after ? "border-emerald-200/25 bg-emerald-200/[0.08]" : "border-white/15 bg-white/[0.06]"}`}>
          <WorkflowNodeIcon label={data.label} nodeType={data.node_type} />
        </div>
        <div>
          <p className="text-base font-semibold text-white">{normalizeWorkflowLabel(data.label)}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{data.node_type.replace("_", " ")}</p>
        </div>
      </div>
      {data.description ? <p className="mt-3 text-xs leading-5 text-slate-300">{data.description}</p> : null}
    </div>
  );
}

function WorkflowNodeIcon({ label, nodeType }: { label: string; nodeType: string }) {
  const normalized = label.toLowerCase();

  if (normalized.includes("whatsapp")) {
    return <MessageCircle className="size-5" aria-hidden="true" />;
  }
  if (normalized.includes("excel")) {
    return <FileSpreadsheet className="size-5" aria-hidden="true" />;
  }
  if (normalized.includes("extraction")) {
    return <Bot className="size-5" aria-hidden="true" />;
  }
  if (normalized.includes("crm")) {
    return <RefreshCcw className="size-5" aria-hidden="true" />;
  }
  if (normalized.includes("recovery")) {
    return <CheckCircle2 className="size-5" aria-hidden="true" />;
  }
  if (nodeType === "risk") {
    return <AlertTriangle className="size-5" aria-hidden="true" />;
  }
  return <Zap className="size-5" aria-hidden="true" />;
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
      y: index * 118,
    },
    data: {
      ...node.data,
      label: normalizeWorkflowLabel(node.data.label),
      phase,
      index,
    },
  }));

  const edges: Edge[] = graph.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: "smoothstep",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: phase === "after" ? "#34d399" : "#fb7185",
      width: 18,
      height: 18,
    },
    style: {
      stroke: phase === "after" ? "#34d399" : "#fb7185",
      strokeWidth: 2.2,
      filter: phase === "after" ? "drop-shadow(0 0 8px rgba(52,211,153,0.5))" : "drop-shadow(0 0 8px rgba(251,113,133,0.38))",
    },
  }));

  return { nodes, edges };
}

function normalizeWorkflowLabel(label: string) {
  if (label === "Automated Follow-Up") {
    return "Auto Follow-Up";
  }
  return label;
}
