"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  Globe,
  Loader2,
  Lock,
  MessageSquare,
  Play,
  Server,
  Terminal,
  Zap,
} from "lucide-react";

interface ServiceStatus {
  name: string;
  category: string;
  status: "OFFLINE" | "INITIALIZING" | "ONLINE";
  icon: any;
}

export function DeploymentSimulation() {
  const router = useRouter();
  const [deployState, setDeployState] = useState<"idle" | "deploying" | "success">("idle");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Status check list of systems
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: "WhatsApp Webhook Listener", category: "Data Ingest", status: "OFFLINE", icon: MessageSquare },
    { name: "AI Intent Extraction Model", category: "Core Intelligence", status: "OFFLINE", icon: Cpu },
    { name: "CRM Synchronization Hub", category: "Data Storage", status: "OFFLINE", icon: Database },
    { name: "Auto Follow-Up Automator", category: "Actions Engine", status: "OFFLINE", icon: Zap },
    { name: "Broker SLA Escalation Logic", category: "Ops Control", status: "OFFLINE", icon: Server },
  ]);

  const runDeployment = () => {
    if (deployState === "deploying") return;
    
    setDeployState("deploying");
    setProgress(0);
    setLogs(["Initializing ShadowOS..."]);
    
    // Reset services to offline
    setServices((prev) => prev.map((s) => ({ ...s, status: "OFFLINE" })));

    const steps = [
      {
        progress: 15,
        log: "Initializing ShadowOS...",
        updateService: null,
      },
      {
        progress: 30,
        log: "Mapping workflow dependencies...",
        updateService: { name: "WhatsApp Webhook Listener", status: "ONLINE" as const },
      },
      {
        progress: 45,
        log: "Generating CRM synchronization...",
        updateService: { name: "CRM Synchronization Hub", status: "ONLINE" as const },
      },
      {
        progress: 60,
        log: "Deploying follow-up automation...",
        updateService: { name: "AI Intent Extraction Model", status: "ONLINE" as const },
      },
      {
        progress: 75,
        log: "Activating lead recovery engine...",
        updateService: { name: "Auto Follow-Up Automator", status: "ONLINE" as const },
      },
      {
        progress: 90,
        log: "Configuring escalation workflows...",
        updateService: { name: "Broker SLA Escalation Logic", status: "ONLINE" as const },
      },
      {
        progress: 100,
        log: "Deployment complete.",
        updateService: null,
      },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        setLogs((prev) => [...prev, step.log]);
        setProgress(step.progress);
        
        if (step.updateService) {
          setServices((prev) =>
            prev.map((s) =>
              s.name === step.updateService?.name
                ? { ...s, status: step.updateService.status }
                : s
            )
          );
        }
        currentStep++;
      } else {
        clearInterval(interval);
        setDeployState("success");
      }
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="border-b border-cyan-500/10 pb-5">
        <h2 className="text-xl font-semibold text-white">System Deployment Cockpit</h2>
        <p className="mt-1.5 text-xs text-slate-400 max-w-3xl leading-relaxed">
          Arm your business with automation. Clicking deploy orchestrates the ShadowOS operational infrastructure layer and turns findings into active workflows.
        </p>
      </div>

      {/* EXPECTED IMPROVEMENTS PREVIEW CARD */}
      <section className="border border-cyan-500/25 bg-slate-950/40 p-4 shadow-[0_15px_40px_rgba(6,182,212,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 border-l border-b border-cyan-500/20 bg-slate-950/85 px-3 py-1 text-[9px] font-mono tracking-widest text-cyan-400 uppercase">
          Pre-deployment Audit
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400 font-mono mb-3">
          Expected Automation Improvements
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="border border-cyan-500/10 bg-cyan-950/5 p-3">
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block">Revenue Recovery</span>
            <span className="text-xl font-bold text-white block mt-1">₹8,20,000/mo</span>
          </div>
          <div className="border border-cyan-500/10 bg-cyan-950/5 p-3">
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block">Manual Work Red.</span>
            <span className="text-xl font-bold text-white block mt-1">62%</span>
          </div>
          <div className="border border-cyan-500/10 bg-cyan-950/5 p-3">
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block">Workflow Eff.</span>
            <span className="text-xl font-bold text-white block mt-1">+47%</span>
          </div>
          <div className="border border-cyan-500/10 bg-cyan-950/5 p-3">
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block">Lead Recovery</span>
            <span className="text-xl font-bold text-white block mt-1">+18%</span>
          </div>
          <div className="border border-cyan-500/10 bg-cyan-950/5 p-3 col-span-2 sm:col-span-1">
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block">Operational Vis.</span>
            <span className="text-xl font-bold text-white block mt-1">+71%</span>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        {/* CONTROL DECK & STATUSES */}
        <section className="border border-cyan-500/15 bg-slate-950/40 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur relative flex flex-col justify-between">
          <div className="absolute top-0 right-0 border-l border-b border-cyan-500/20 bg-slate-950/80 px-3 py-1 text-[9px] font-mono tracking-widest text-cyan-400 uppercase">
            Deploy Control
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Server className="size-4 text-cyan-400" />
              Target Operational Infrastructure
            </h3>

            {/* SERVICES STATUS LIST */}
            <div className="space-y-3">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.name}
                    className={`flex items-center justify-between border p-3.5 transition-all duration-300 ${
                      service.status === "ONLINE"
                        ? "border-emerald-500/20 bg-emerald-950/5 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                        : service.status === "INITIALIZING"
                        ? "border-yellow-500/20 bg-yellow-950/5"
                        : "border-slate-800 bg-slate-950/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid size-9 place-items-center border transition-colors ${
                          service.status === "ONLINE"
                            ? "border-emerald-500/30 bg-emerald-950 text-emerald-400"
                            : "border-slate-800 bg-slate-900 text-slate-500"
                        }`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white uppercase tracking-wide">
                          {service.name}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                          Category: {service.category}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 border rounded uppercase font-bold tracking-widest ${
                          service.status === "ONLINE"
                            ? "border-emerald-500/30 bg-emerald-950 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                            : service.status === "INITIALIZING"
                            ? "border-yellow-500/30 bg-yellow-950 text-yellow-400 animate-pulse"
                            : "border-slate-800 bg-slate-900 text-slate-500"
                        }`}
                      >
                        {service.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DEPLOY BUTTON & PROGRESS */}
          <div className="mt-6 border-t border-cyan-500/10 pt-5 space-y-4">
            {deployState !== "idle" && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-cyan-400">
                  <span className="uppercase tracking-wider">Deployment Pipeline:</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-900 border border-cyan-500/15">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={runDeployment}
                disabled={deployState === "deploying"}
                className="inline-flex h-11 items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 text-xs tracking-wider uppercase transition border border-cyan-400/40 rounded-none disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer"
              >
                {deployState === "deploying" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Zap className="size-4" />
                )}
                Deploy Operational Improvements
              </button>

              {deployState === "success" && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono uppercase">
                  <CheckCircle2 className="size-4" />
                  <span>Deployment Online</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* TERMINAL PANEL */}
        <section className="border border-cyan-500/15 bg-slate-950/40 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-cyan-500/15 pb-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-400 font-mono flex items-center gap-1.5">
                <Terminal className="size-3.5" />
                Deployment Console
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[8px] font-mono text-cyan-400">TTY0</span>
              </span>
            </div>

            <div className="border border-cyan-500/10 bg-slate-950 p-4 h-[350px] overflow-y-auto space-y-3 font-mono text-xs select-none">
              {logs.length === 0 ? (
                <p className="text-slate-600 italic text-center pt-32">
                  Awaiting deployment instruction...
                </p>
              ) : (
                logs.map((log, index) => {
                  const isLast = index === logs.length - 1;
                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-2.5 transition-all duration-300 ${
                        isLast ? "text-cyan-300 font-semibold" : "text-slate-500"
                      }`}
                    >
                      <span className="text-[10px] text-cyan-600 mt-0.5">❯</span>
                      <span>
                        {log}
                        {isLast && deployState === "deploying" && (
                          <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-1.5 animate-pulse" />
                        )}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {deployState === "success" && (
            <div className="mt-4 border border-emerald-500/20 bg-emerald-950/30 p-3.5 text-xs flex items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4.5 text-emerald-400" />
                <span className="text-slate-300 font-mono">ALL MODULES ACTIVE.</span>
              </div>
              <button
                onClick={() => router.push("/impact")}
                className="inline-flex h-7 items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 text-[10px] tracking-wider uppercase transition rounded-none border border-emerald-400/40 cursor-pointer"
              >
                <span>Impact Summary</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
