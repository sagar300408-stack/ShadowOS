"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  BrainCircuit,
  ChevronRight,
  DatabaseZap,
  DollarSign,
  FolderOpen,
  Lock,
  Network,
  Radar,
  Terminal,
  TrendingUp,
  Zap,
} from "lucide-react";

interface Step {
  title: string;
  subtitle: string;
  path: string;
  icon: any;
}

const STEPS: Step[] = [
  {
    title: "Data Capture",
    subtitle: "Upload operational signals",
    path: "/upload",
    icon: FolderOpen,
  },
  {
    title: "Intelligence Findings",
    subtitle: "Exposure & diagnostics",
    path: "/dashboard",
    icon: BrainCircuit,
  },
  {
    title: "Workflow Analysis",
    subtitle: "Transformation simulator",
    path: "/workflow",
    icon: Network,
  },
  {
    title: "Automation Blueprint",
    subtitle: "Executive automation plan",
    path: "/deploy",
    icon: Terminal,
  },
  {
    title: "Executive Impact",
    subtitle: "Business outcomes",
    path: "/impact",
    icon: TrendingUp,
  },
];

import { useAnalysis } from "@/lib/AnalysisContext";

interface DemoLayoutProps {
  children: ReactNode;
}

export function DemoLayout({ children }: DemoLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [time, setTime] = useState("");
  const { analysis } = useAnalysis();

  // Determine active step index
  const activeIndex = STEPS.findIndex((step) => pathname?.startsWith(step.path)) ?? 0;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);



  return (
    <div className="relative min-h-screen bg-[#02050d] text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Background Grids and Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(6,182,212,0.12),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(16,185,129,0.08),transparent_32%),linear-gradient(to_bottom,rgba(15,23,42,0.98),rgba(2,6,23,0.99))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.045)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Outer Console border wrap */}
      <div className="relative flex flex-col min-h-screen">
        {/* TOP STATUS BAR */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-cyan-500/15 bg-slate-950/70 px-4 md:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative grid size-9 place-items-center border border-cyan-500/40 bg-cyan-950/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Radar className="size-4 animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 size-1.5 bg-emerald-400 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold uppercase tracking-[0.25em] text-white">ShadowOS</span>
                <span className="border border-cyan-500/30 bg-cyan-950/50 px-1.5 py-0.5 text-[9px] font-mono text-cyan-300 rounded uppercase">
                  v1.2.0-beta
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 hidden sm:block">
                AI Operational Intelligence System
              </p>
            </div>
          </div>

          {/* TELEMETRY DECK */}
          <div className="flex items-center gap-4 text-xs font-mono md:gap-6">
            <div className="hidden lg:flex items-center gap-2 border-r border-slate-800 pr-4">
              <Activity className="size-3.5 text-cyan-400 animate-pulse" />
              <span className="text-slate-400 uppercase text-[10px] tracking-wider">Telemetry:</span>
              <span className="text-emerald-400 uppercase text-[10px] font-bold">CONNECTED</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 border-r border-slate-800 pr-4">
              <DatabaseZap className="size-3.5 text-yellow-500" />
              <span className="text-slate-400 uppercase text-[10px] tracking-wider">Codex Engine:</span>
              <span className="text-cyan-400 uppercase text-[10px] font-bold">ARMED</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 border border-cyan-500/10">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-cyan-200 tabular-nums tracking-wider text-[11px]">{time || "00:00:00"}</span>
            </div>
          </div>
        </header>

        {/* CONTAINER SHELL */}
        <div className="flex flex-1 flex-col md:flex-row min-h-0">
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-full md:w-64 shrink-0 border-r border-cyan-500/10 bg-slate-950/30 p-4 md:p-6 flex flex-col justify-between backdrop-blur-sm">
            <div className="space-y-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 border-b border-cyan-500/20 pb-2 flex items-center justify-between">
                <span>Mission Pipeline</span>
                <span className="flex items-center gap-1">
                  <span className="size-1 bg-cyan-400 rounded-full animate-ping" />
                  <span className="text-[8px] text-cyan-400/70 font-mono font-bold tracking-widest">LIVE</span>
                </span>
              </div>
              <nav className="space-y-2.5">
                {STEPS.map((step, index) => {
                  const isActive = index === activeIndex;
                  const isCompleted = index < activeIndex;

                  let stepColorClass = "text-slate-500 border-slate-900 bg-transparent";
                  if (isActive) {
                    stepColorClass = "border-cyan-500/50 bg-cyan-950/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]";
                  } else if (isCompleted) {
                    stepColorClass = "border-emerald-500/25 bg-emerald-950/15 text-emerald-400";
                  }

                  return (
                    <Link
                      key={step.path}
                      href={step.path}
                      className={`group flex items-center gap-3 border p-3 transition-all hover:bg-slate-900/40 relative overflow-hidden ${stepColorClass}`}
                    >
                      {isActive && (
                        /* Pulsing scanner bar overlay on active step */
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
                      )}
                      
                      <div
                        className={`grid size-8 place-items-center border text-[11px] font-mono transition-colors ${
                          isActive
                            ? "border-cyan-400 bg-cyan-950/90 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                            : isCompleted
                            ? "border-emerald-500/35 bg-emerald-950/80 text-emerald-400"
                            : "border-slate-800 bg-slate-900/80 text-slate-600 group-hover:border-slate-700 group-hover:text-slate-400"
                        }`}
                      >
                        {isCompleted ? "✓" : `0${index + 1}`}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${
                              isActive ? "text-white" : isCompleted ? "text-slate-200" : "text-slate-500 group-hover:text-slate-400"
                            }`}
                          >
                            {step.title}
                          </span>
                          {isActive && (
                            <span className="text-[8px] font-mono text-cyan-400/80 px-1 border border-cyan-500/20 bg-cyan-950/50 uppercase font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate tracking-wide mt-0.5">{step.subtitle}</p>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Subtle Codex Badge */}
            <div className="mt-8 border border-cyan-500/10 bg-cyan-950/10 p-3 text-center hidden md:block">
              <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                Codex Orchestrated
              </p>
              <div className="mt-1 flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-300">
                <BrainCircuit className="size-3.5 text-cyan-400 animate-pulse" />
                <span>OPENAI CODEX</span>
              </div>
            </div>
          </aside>

          {/* MAIN PAGE VIEWPORT */}
          <main className="flex-1 min-w-0 overflow-y-auto relative p-4 md:p-6 lg:p-8 pb-24 md:pb-28">
            {children}
          </main>
        </div>


      </div>
    </div>
  );
}
