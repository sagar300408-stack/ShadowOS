"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Bot,
  BrainCircuit,
  Clock3,
  DatabaseZap,
  Repeat2,
  ShieldAlert,
  Workflow,
  Zap,
  ArrowRight,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { useAnalysis } from "@/lib/AnalysisContext";

export function DashboardCommandCenter() {
  const { analysis, status, error } = useAnalysis();
  const dashboard = analysis?.dashboard;

  const primaryMetrics = useMemo(
    () => {
      if (!dashboard) return [];
      return [
        {
          label: "Revenue Leakage",
          value: formatCurrency(dashboard.revenue_leakage_estimate || 0),
          signal: "Monthly revenue exposure",
          icon: ShieldAlert,
          tone: "rose",
        },
        {
          label: "Manual Hours Lost",
          value: `${(dashboard.time_waste_estimate || 0).toFixed(0)} hrs`,
          signal: "Wasted hours / week",
          icon: Clock3,
          tone: "amber",
        },
        {
          label: "Lead Drop-Off",
          value: `${(dashboard.workflow_fragmentation_score || 0).toFixed(0)}%`, // We can use fragmentation or another metric
          signal: "Pipeline loss rate",
          icon: Zap,
          tone: "emerald",
        },
        {
          label: "Automation Potential",
          value: `${(dashboard.automation_potential || 0).toFixed(0)}%`,
          signal: "Orchestration capacity",
          icon: Bot,
          tone: "cyan",
        },
      ];
    },
    [dashboard],
  );

  const secondaryMetrics = useMemo(
    () => {
      if (!dashboard) return [];
      return [
        {
          label: "Fragmentation",
          value: `${(dashboard.workflow_fragmentation_score || 0).toFixed(0)}%`,
          signal: "Multi-channel spread",
          icon: Workflow,
          tone: "violet",
        },
        {
          label: "Bottlenecks",
          value: `${dashboard.repeated_task_count || 0} active`,
          signal: "Stuck tasks / week",
          icon: Repeat2,
          tone: "amber",
        },
        {
          label: "Operational Pressure",
          value: `${(dashboard.inefficiency_score || 0).toFixed(0)}%`,
          signal: "System friction load",
          icon: Activity,
          tone: "cyan",
        },
        {
          label: "Operational Confidence",
          value: "100%",
          signal: "Deterministic rule-based",
          icon: BrainCircuit,
          tone: "cyan",
        },
      ];
    },
    [dashboard],
  );

  const topAutomations = dashboard?.automation_opportunities || [];
  const aiFindings = dashboard?.ai_findings || [];

  if (status === "loading") {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-6 text-slate-100 font-sans">
        <div className="flex flex-col items-center justify-center gap-4 text-cyan-400">
          <Loader2 className="size-8 animate-spin" />
          <p className="text-sm font-mono tracking-widest uppercase">Synthesizing Intelligence...</p>
        </div>
      </main>
    );
  }

  if (status === "error" || !dashboard) {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-6 text-slate-100 font-sans">
        <div className="w-full max-w-2xl border border-rose-500/30 bg-slate-950/40 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.52)] relative overflow-hidden backdrop-blur-md animate-[metric-rise_450ms_ease-out_both] text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-rose-950/50 mb-6 border border-rose-500/20">
            <UploadCloud className="size-8 text-rose-400" />
          </div>
          <h2 className="text-xl font-extrabold text-white mb-2 uppercase tracking-wider font-mono">No Active Telemetry</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">{error}</p>
          <Link
            href="/upload"
            className="inline-flex h-11 items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 text-xs tracking-wider uppercase transition border border-cyan-400/40 rounded-none"
          >
            <span>Upload Dataset</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="space-y-6">
      {/* INTELLIGENCE VERDICT PANEL */}
      <section className="border border-cyan-500/30 bg-slate-950/40 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.52)] relative overflow-hidden backdrop-blur-md animate-[metric-rise_400ms_ease-out_both]">
        <div className="absolute top-0 right-0 border-l border-b border-cyan-500/20 bg-cyan-950/40 px-3 py-1 text-[9px] font-mono tracking-widest text-cyan-400 uppercase">
          Intelligence Verdict
        </div>
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column: Primary Verdict */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
                  ShadowOS Intelligence Verdict
                </h2>
              </div>
              <p className="text-lg md:text-xl font-extrabold text-slate-100 leading-snug">
                {aiFindings.length > 0 
                  ? `${aiFindings.length} operational bottlenecks detected, contributing to significant workflow friction.`
                  : `Operations appear healthy, but continuous telemetry monitoring is recommended.`}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Telemetry signals pinpoint critical leakage points in manual workflows and uncoordinated handoffs. Automated agent routing is recommended to plug the conversion gap immediately.
              </p>
            </div>
          </div>

          {/* Right Column: Financial Exposure Callouts */}
          <div className="grid grid-cols-2 gap-3 pl-0 md:pl-4 border-l border-cyan-500/10">
            <div className="border border-rose-500/20 bg-rose-950/20 p-4 flex flex-col justify-between">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono block leading-normal">
                Potential Monthly Revenue Exposure
              </span>
              <span className="text-2xl font-extrabold text-rose-400 tracking-tight block mt-3">
                {formatCurrency(dashboard.revenue_leakage_estimate)}
              </span>
            </div>
            <div className="border border-amber-500/20 bg-amber-950/20 p-4 flex flex-col justify-between">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono block leading-normal">
                Estimated Manual Work
              </span>
              <span className="text-2xl font-extrabold text-amber-400 tracking-tight block mt-3">
                {(dashboard.time_waste_estimate || 0).toFixed(0)} hours/week
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SIMPLIFIED DASHBOARD METRICS */}
      <div className="space-y-4">
        {/* Primary Row */}
        <div>
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block mb-2">
            Primary Metrics
          </span>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {primaryMetrics.map((metric, index) => (
              <MetricCard key={metric.label} metric={metric} index={index} loading={false} isPrimary={true} />
            ))}
          </div>
        </div>

        {/* Secondary Row */}
        <div>
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block mb-2">
            Secondary Telemetry Details
          </span>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {secondaryMetrics.map((metric, index) => (
              <MetricCard key={metric.label} metric={metric} index={index + 4} loading={false} isPrimary={false} />
            ))}
          </div>
        </div>
      </div>

      {/* TOP AUTOMATION OPPORTUNITIES */}
      {topAutomations.length > 0 && (
        <section className="border border-cyan-500/10 bg-slate-950/40 p-4 backdrop-blur sm:p-5 animate-[metric-rise_600ms_ease-out_both]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-emerald-400 font-mono">Intelligent Agent Orchestration</p>
              <h2 className="mt-1 text-base font-bold text-white uppercase tracking-wider">Recommended Automations</h2>
            </div>
            <Zap className="size-4 text-cyan-400" aria-hidden="true" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {topAutomations.map((opportunity) => (
              <article key={opportunity.title} className="border border-cyan-500/10 bg-slate-900/40 p-4 transition hover:border-cyan-500/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{opportunity.title}</h3>
                    <span className={severityClass(opportunity.priority)}>{opportunity.priority}</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block">Proposed Solution</span>
                      <p className="text-xs leading-relaxed text-slate-300 mt-1">{opportunity.description}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block">Expected Impact</span>
                      <p className="text-xs leading-relaxed text-slate-300 mt-1">{opportunity.impact}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* SEVERITY HEATMAP & AI SCAN FINDINGS */}
      <div className="grid gap-5 md:grid-cols-2 animate-[metric-rise_700ms_ease-out_both]">
        {/* SEVERITY HEATMAP */}
        <section className="border border-cyan-500/10 bg-slate-950/40 p-4 backdrop-blur sm:p-5 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-rose-400 font-mono">
                Risk Map
              </p>
              <h2 className="mt-1 text-base font-bold text-white uppercase tracking-wider">Severity Breakdown</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="border border-rose-500/30 bg-rose-950/15 p-3 flex items-center justify-between">
                <span className="text-[9px] font-bold text-rose-400 tracking-wider uppercase">[CRITICAL]</span>
                <span className="text-white text-right font-semibold">{aiFindings.filter(f => f.severity === 'critical').length}</span>
              </div>
              <div className="border border-amber-500/30 bg-amber-950/15 p-3 flex items-center justify-between">
                <span className="text-[9px] font-bold text-amber-400 tracking-wider uppercase">[HIGH]</span>
                <span className="text-white text-right font-semibold">{aiFindings.filter(f => f.severity === 'high').length}</span>
              </div>
              <div className="border border-yellow-500/20 bg-yellow-950/5 p-3 flex items-center justify-between">
                <span className="text-[9px] font-bold text-yellow-400 tracking-wider uppercase">[MEDIUM]</span>
                <span className="text-white text-right font-semibold font-sans">{aiFindings.filter(f => f.severity === 'medium').length}</span>
              </div>
              <div className="border border-slate-700 bg-slate-800/20 p-3 flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">[LOW]</span>
                <span className="text-slate-300 text-right font-semibold font-sans">{aiFindings.filter(f => f.severity === 'low').length}</span>
              </div>
            </div>
          </div>
        </section>

        {/* AI SCAN FINDINGS */}
        <section className="border border-cyan-500/10 bg-slate-950/40 p-4 backdrop-blur sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-cyan-400 font-mono">AI Diagnostics</p>
              <h3 className="text-base font-bold text-white uppercase tracking-wider mt-0.5">Detected Inefficiencies</h3>
            </div>
            <Bot className="size-4 text-emerald-400" aria-hidden="true" />
          </div>

          <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
            {aiFindings.length === 0 && (
              <div className="text-xs text-slate-400 font-mono">No significant inefficiencies detected.</div>
            )}
            {aiFindings.map((finding, idx) => (
              <div key={idx} className="border border-cyan-500/5 bg-slate-900/40 p-3 transition hover:border-cyan-500/20">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">{finding.title}</h3>
                  <span className={severityClass(finding.severity)}>{finding.severity}</span>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">{finding.summary}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="border border-cyan-500/15 bg-cyan-950/5 p-5 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-300">
              <BrainCircuit className="size-4.5 animate-pulse text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
                Powered by ShadowOS Engine V2
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Real-time deterministic analysis processed directly from uploaded datasets. ML models bypassed for transparent business heuristics.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

type MetricCardProps = {
  metric: {
    label: string;
    value: string;
    signal: string;
    icon: any;
    tone: string;
  };
  index: number;
  loading: boolean;
  isPrimary: boolean;
};

function MetricCard({ metric, index, loading, isPrimary }: MetricCardProps) {
  const Icon = metric.icon;

  return (
    <article
      className={`animate-[metric-rise_520ms_ease-out_both] border shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur flex flex-col justify-between ${
        isPrimary 
          ? "border-cyan-500/25 bg-cyan-950/10 p-5 min-h-[140px]" 
          : "border-white/[0.08] bg-white/[0.03] p-4 min-h-[110px]"
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className={`text-slate-400 font-mono tracking-wide ${isPrimary ? "text-[11px]" : "text-[9px]"}`}>
            {metric.label}
          </span>
          <div className={`grid place-items-center border ${isPrimary ? "size-9 border-cyan-500/20 text-cyan-400" : "size-7 border-slate-800 text-slate-500"}`}>
            <Icon className={isPrimary ? "size-4" : "size-3"} aria-hidden="true" />
          </div>
        </div>
        <p className={`mt-3 font-extrabold text-white tracking-tight ${isPrimary ? "text-2xl" : "text-lg"}`}>
          {loading ? "..." : metric.value}
        </p>
      </div>
      <p className="mt-2 text-[9px] uppercase tracking-widest text-slate-500">{metric.signal}</p>
    </article>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function severityClass(severity: string) {
  const normalized = severity.toLowerCase();
  if (normalized === "critical") {
    return "shrink-0 border border-rose-300/30 bg-rose-300/[0.09] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-200";
  }
  if (normalized === "high") {
    return "shrink-0 border border-amber-300/30 bg-amber-300/[0.09] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-200";
  }
  if (normalized === "medium") {
    return "shrink-0 border border-yellow-300/30 bg-yellow-300/[0.09] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-yellow-200";
  }
  return "shrink-0 border border-cyan-300/30 bg-cyan-300/[0.09] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200";
}
