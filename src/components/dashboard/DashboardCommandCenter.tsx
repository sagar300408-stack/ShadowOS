"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Activity,
  AlertTriangle,
  Bot,
  BrainCircuit,
  Clock3,
  DatabaseZap,
  Loader2,
  Repeat2,
  ShieldAlert,
  Workflow,
  Zap,
} from "lucide-react";
import { fetchDashboardMetrics, type DashboardMetrics } from "@/lib/shadowos-api";

const OperationalPressureChart = dynamic(
  () => import("@/components/dashboard/OperationalPressureChart").then((mod) => mod.OperationalPressureChart),
  {
    ssr: false,
    loading: () => <div className="h-[310px] w-full animate-pulse bg-white/[0.04]" />,
  },
);

const fallbackDashboard: DashboardMetrics = {
  inefficiency_score: 0,
  revenue_leakage_estimate: 0,
  time_waste_estimate: 0,
  repeated_task_count: 0,
  workflow_fragmentation_score: 0,
  automation_opportunities: [],
  ai_findings: [],
};

export function DashboardCommandCenter() {
  const [dashboard, setDashboard] = useState<DashboardMetrics>(fallbackDashboard);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const metrics = await fetchDashboardMetrics();
        if (!active) {
          return;
        }
        setDashboard(metrics);
        setStatus("ready");
      } catch (loadError) {
        if (!active) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Dashboard telemetry is unavailable.");
        setStatus("error");
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const metricCards = useMemo(
    () => [
      {
        label: "Inefficiency Score",
        value: `${dashboard.inefficiency_score.toFixed(1)}%`,
        signal: "Operational drag",
        icon: Activity,
        tone: "cyan",
      },
      {
        label: "Revenue Leakage",
        value: formatCurrency(dashboard.revenue_leakage_estimate),
        signal: "Estimated at risk",
        icon: ShieldAlert,
        tone: "rose",
      },
      {
        label: "Time Waste",
        value: `${dashboard.time_waste_estimate.toFixed(1)}h`,
        signal: "Per week",
        icon: Clock3,
        tone: "amber",
      },
      {
        label: "Repeated Tasks",
        value: dashboard.repeated_task_count.toString(),
        signal: "Manual loops",
        icon: Repeat2,
        tone: "emerald",
      },
      {
        label: "Workflow Fragmentation",
        value: `${dashboard.workflow_fragmentation_score.toFixed(1)}%`,
        signal: "System spread",
        icon: Workflow,
        tone: "violet",
      },
    ],
    [dashboard],
  );

  const chartData = useMemo(
    () => [
      { name: "Inefficiency", value: dashboard.inefficiency_score },
      { name: "Leakage", value: normalizeCurrency(dashboard.revenue_leakage_estimate) },
      { name: "Time Waste", value: dashboard.time_waste_estimate },
      { name: "Repeats", value: dashboard.repeated_task_count },
      { name: "Fragmentation", value: dashboard.workflow_fragmentation_score },
    ],
    [dashboard],
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#04070d] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(16,185,129,0.14),transparent_30%),linear-gradient(135deg,rgba(2,6,23,0.98),rgba(8,13,28,0.98))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.055)_1px,transparent_1px)] bg-[size:38px_38px]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center border border-cyan-300/35 bg-cyan-300/10 text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.18)]">
              <BrainCircuit className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">ShadowOS</p>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">AI Command Center</h1>
            </div>
          </div>
          <div className="inline-flex w-fit items-center gap-2 border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-2 text-sm text-emerald-100">
            {status === "loading" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Zap className="size-4" aria-hidden="true" />}
            {status === "error" ? "Telemetry link degraded" : "Operational telemetry live"}
          </div>
        </header>

        {status === "error" ? (
          <div className="mt-6 border border-rose-300/25 bg-rose-300/[0.08] p-4 text-sm text-rose-100">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <p>{error}</p>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 py-6 sm:grid-cols-2 xl:grid-cols-5">
          {metricCards.map((metric, index) => (
            <MetricCard key={metric.label} metric={metric} index={index} loading={status === "loading"} />
          ))}
        </div>

        <div className="grid flex-1 gap-5 pb-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="border border-white/[0.12] bg-slate-950/[0.72] p-4 backdrop-blur sm:p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-300">Signal Map</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Operational pressure index</h2>
              </div>
              <DatabaseZap className="size-5 text-cyan-200" aria-hidden="true" />
            </div>

            <div className="h-[310px] min-w-0">
              <OperationalPressureChart data={chartData} />
            </div>
          </section>

          <section className="border border-white/[0.12] bg-slate-950/[0.72] p-4 backdrop-blur sm:p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">AI Findings</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Detected operational events</h2>
              </div>
              <Bot className="size-5 text-emerald-200" aria-hidden="true" />
            </div>

            <div className="space-y-3">
              {dashboard.ai_findings.map((finding) => (
                <div key={finding.title} className="border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white">{finding.title}</h3>
                    <span className={severityClass(finding.severity)}>{finding.severity}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{finding.summary}</p>
                </div>
              ))}
              {status === "loading" ? <SkeletonLines /> : null}
            </div>
          </section>
        </div>

        <section className="border border-white/[0.12] bg-slate-950/[0.72] p-4 backdrop-blur sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-300">Automation Opportunities</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Recommended operational moves</h2>
            </div>
            <Zap className="size-5 text-cyan-200" aria-hidden="true" />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {dashboard.automation_opportunities.map((opportunity) => (
              <article key={opportunity.title} className="border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-white">{opportunity.title}</h3>
                  <span className={severityClass(opportunity.priority)}>{opportunity.priority}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{opportunity.description}</p>
                <p className="mt-4 border-t border-white/10 pt-3 text-sm text-cyan-100">{opportunity.impact}</p>
              </article>
            ))}
            {status === "loading" ? <SkeletonLines /> : null}
          </div>
        </section>
      </section>
    </main>
  );
}

type MetricCardProps = {
  metric: {
    label: string;
    value: string;
    signal: string;
    icon: typeof Activity;
    tone: string;
  };
  index: number;
  loading: boolean;
};

function MetricCard({ metric, index, loading }: MetricCardProps) {
  const Icon = metric.icon;

  return (
    <article
      className="animate-[metric-rise_520ms_ease-out_both] border border-white/[0.12] bg-white/[0.045] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`grid size-10 place-items-center border ${toneClass(metric.tone)}`}>
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <span className="mt-1 h-2 w-2 animate-pulse bg-emerald-300" />
      </div>
      <p className="mt-5 text-sm text-slate-400">{metric.label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{loading ? "..." : metric.value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">{metric.signal}</p>
    </article>
  );
}

function SkeletonLines() {
  return (
    <div className="border border-white/10 bg-white/[0.04] p-4">
      <div className="h-4 w-2/3 animate-pulse bg-white/10" />
      <div className="mt-3 h-3 w-full animate-pulse bg-white/10" />
      <div className="mt-2 h-3 w-4/5 animate-pulse bg-white/10" />
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value >= 100000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function normalizeCurrency(value: number) {
  return Math.round(value / 2500);
}

function severityClass(severity: string) {
  const normalized = severity.toLowerCase();
  if (normalized === "critical") {
    return "shrink-0 border border-rose-300/30 bg-rose-300/[0.09] px-2 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-rose-200";
  }
  if (normalized === "high") {
    return "shrink-0 border border-amber-300/30 bg-amber-300/[0.09] px-2 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200";
  }
  return "shrink-0 border border-cyan-300/30 bg-cyan-300/[0.09] px-2 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200";
}

function toneClass(tone: string) {
  switch (tone) {
    case "rose":
      return "border-rose-300/25 bg-rose-300/[0.08] text-rose-200";
    case "amber":
      return "border-amber-300/25 bg-amber-300/[0.08] text-amber-200";
    case "emerald":
      return "border-emerald-300/25 bg-emerald-300/[0.08] text-emerald-200";
    case "violet":
      return "border-violet-300/25 bg-violet-300/[0.08] text-violet-200";
    default:
      return "border-cyan-300/25 bg-cyan-300/[0.08] text-cyan-200";
  }
}
