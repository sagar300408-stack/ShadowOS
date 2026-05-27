"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  BrainCircuit,
  Calendar,
  CheckCircle2,
  DollarSign,
  FileSpreadsheet,
  Globe,
  Hourglass,
  RefreshCw,
  TrendingUp,
  Zap,
} from "lucide-react";

export function ExecutiveImpact() {
  const router = useRouter();

  const metrics = [
    {
      label: "Revenue Recovery",
      value: "₹8,20,000",
      unit: "/ month",
      description: "Recaptured leakages from delayed broker response loops",
      icon: DollarSign,
      color: "text-emerald-400 border-emerald-500/25 bg-emerald-950/15",
    },
    {
      label: "Manual Work Reduction",
      value: "62%",
      unit: " decrease",
      description: "Hours saved on manual status syncs and local WhatsApp-Excel entry",
      icon: Hourglass,
      color: "text-cyan-400 border-cyan-500/25 bg-cyan-950/15",
    },
    {
      label: "Lead Recovery",
      value: "18%",
      unit: " conversion",
      description: "Prospect retention gains via auto follow-ups",
      icon: Zap,
      color: "text-yellow-400 border-yellow-500/25 bg-yellow-950/15",
    },
    {
      label: "Automation Opportunities",
      value: "4 Discovered",
      unit: " agents",
      description: "Actionable system blueprints flagged in operational footprints",
      icon: FileSpreadsheet,
      color: "text-purple-400 border-purple-500/25 bg-purple-950/15",
    },
    {
      label: "Workflow Efficiency",
      value: "47%",
      unit: " increase",
      description: "Handoff speed improvements across CRM and broker routing hubs",
      icon: TrendingUp,
      color: "text-blue-400 border-blue-500/25 bg-blue-950/15",
    },
    {
      label: "Operational Risk Reduction",
      value: "68%",
      unit: " decrease",
      description: "Decay prevention from multi-channel fragmentation",
      icon: CheckCircle2,
      color: "text-rose-400 border-rose-500/25 bg-rose-950/15",
    },
  ];

  const chartData = [
    { name: "First Response", before: 360, after: 3, unit: " min" },
    { name: "Weekly Ops Hours", before: 42.5, after: 4.5, unit: " hrs" },
    { name: "Handoff Delays", before: 24, after: 0.5, unit: " hrs" },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="border-b border-cyan-500/10 pb-5">
        <h2 className="text-xl font-semibold text-white">Executive Impact Summary</h2>
        <p className="mt-1.5 text-xs text-slate-400 max-w-3xl leading-relaxed">
          Operational intelligence converted to financial value. Below is the projected executive impact of deploying ShadowOS automation layers.
        </p>
      </div>

      {/* METRIC GRID */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article
              key={metric.label}
              className={`border p-5 relative overflow-hidden backdrop-blur flex flex-col justify-between h-44 ${metric.color}`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                    {metric.label}
                  </span>
                  <Icon className="size-5 opacity-70" />
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold tracking-tight text-white">
                    {metric.value}
                  </span>
                  <span className="ml-1 text-xs text-slate-400 font-mono">
                    {metric.unit}
                  </span>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300 mt-2 border-t border-white/5 pt-2">
                {metric.description}
              </p>
            </article>
          );
        })}
      </div>

      {/* COMPARATIVE ANALYSIS */}
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        {/* CHART SECTION */}
        <section className="border border-cyan-500/15 bg-slate-950/40 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <TrendingUp className="size-4 text-cyan-400" />
            Performance Delta: Manual vs. ShadowOS
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(6,182,212,0.04)" }}
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid rgba(6,182,212,0.15)",
                    color: "#f8fafc",
                    fontSize: "11px",
                    fontFamily: "monospace",
                  }}
                />
                <Bar dataKey="before" name="Before (Manual)" fill="#f43f5e" radius={[2, 2, 0, 0]} maxBarSize={30} />
                <Bar dataKey="after" name="After (ShadowOS)" fill="#10b981" radius={[2, 2, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6 text-[10px] font-mono uppercase">
            <div className="flex items-center gap-1.5">
              <span className="size-2 bg-rose-500" />
              <span className="text-slate-400">Manual Operations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 bg-emerald-500" />
              <span className="text-slate-400">ShadowOS Active</span>
            </div>
          </div>
        </section>

        {/* METRICS & QUICK RESTART */}
        <section className="border border-cyan-500/15 bg-slate-950/40 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              Operational Milestones unlocked
            </h3>
            
            <div className="space-y-2.5 font-mono text-[11px]">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">REVENUE PROTECTION ENGINE</span>
                <span className="text-emerald-400 font-bold uppercase">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">AUTO LEAD-ROUTING SLAs</span>
                <span className="text-emerald-400 font-bold uppercase">ONLINE</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">UNIFIED CRM PROFILE MERGES</span>
                <span className="text-emerald-400 font-bold uppercase">COMPLETED</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">TOTAL OPPORTUNITIES DISCOVERED</span>
                <span className="text-cyan-400 font-bold">4 WORKFLOWS</span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-cyan-500/10 pt-4 flex flex-col items-stretch gap-3">
            <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-mono">
              End of Walkthrough Cycle
            </p>
            <button
              onClick={() => router.push("/upload")}
              className="inline-flex h-10 items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 text-xs tracking-wider uppercase transition border border-cyan-400/40 rounded-none cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              Restart Demo Walkthrough
            </button>
          </div>
        </section>
      </div>

      {/* FINAL EMOTIONAL NARRATIVE CALLOUT */}
      <section className="border border-cyan-500/35 bg-cyan-950/15 p-6 shadow-[0_0_30px_rgba(6,182,212,0.06)] relative overflow-hidden text-center max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_70%)]" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-400 font-mono block mb-3">
          ShadowOS Core Philosophy
        </span>
        <blockquote className="text-base md:text-lg text-white font-medium italic leading-relaxed">
          "ShadowOS doesn't just analyze operations. It understands how businesses operate and reveals where intelligence should be deployed."
        </blockquote>
      </section>

      {/* CODEX SECTION */}
      <section className="border border-cyan-500/10 bg-cyan-950/10 p-5 backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-300">
              <BrainCircuit className="size-4 animate-pulse text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
                Built Using OpenAI Codex
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              ShadowOS was engineered using OpenAI Codex. The code copilot was leveraged to write, optimize, and connect the analytical and visual models at the heart of ShadowOS.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono text-slate-500 shrink-0">
            <span className="border border-slate-900 bg-slate-950 px-2.5 py-1 uppercase">✓ Workflow orchestration</span>
            <span className="border border-slate-900 bg-slate-950 px-2.5 py-1 uppercase">✓ Backend acceleration</span>
            <span className="border border-slate-900 bg-slate-950 px-2.5 py-1 uppercase">✓ API integration</span>
            <span className="border border-slate-900 bg-slate-950 px-2.5 py-1 uppercase">✓ Workflow visualization</span>
            <span className="border border-slate-900 bg-slate-950 px-2.5 py-1 uppercase">✓ Deployment simulation</span>
            <span className="border border-slate-900 bg-slate-950 px-2.5 py-1 uppercase">✓ Architecture refinement</span>
          </div>
        </div>
      </section>
    </div>
  );
}
