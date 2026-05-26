"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Play, CheckCircle, RefreshCw, Cpu, Activity } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

interface DeploySimulationProps {
  isDeployed: boolean;
  onDeployStart: () => void;
  onDeployComplete: () => void;
}

export default function DeploySimulation({ 
  isDeployed, 
  onDeployStart, 
  onDeployComplete 
}: DeploySimulationProps) {
  const [logs, setLogs] = useState<string[]>([
    "// ShadowOS Daemon v1.0.4 - Standby Mode",
    "// Ready to compile automation architecture...",
    "// Tap 'Deploy Shadow Workflow' to provision Docker pods and webhooks."
  ]);
  const [status, setStatus] = useState<"idle" | "deploying" | "success">("idle");
  const [cpuLoad, setCpuLoad] = useState(12);
  const [networkLatency, setNetworkLatency] = useState(45);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const deploymentSteps = [
    { log: "[INIT] Initializing operational shadow engine container...", delay: 500 },
    { log: "[SCAN] Resolving WhatsApp webhook routing configurations...", delay: 1000 },
    { log: "[COMPILE] Synthesizing context extraction models (Regex + GPT-4o)...", delay: 1500 },
    { log: "[BUILD] Bundling CRM API synchronization adapters (OAuth2)...", delay: 2000 },
    { log: "[DEPLOY] Launching Kubernetes pods on Cluster Node-7a...", delay: 2600 },
    { log: "[NETWORK] Testing endpoint latency: 12ms (Target: <50ms)...", delay: 3100 },
    { log: "[VERIFY] Running automated sanity checklists: SUCCESS.", delay: 3500 },
    { log: "[ACTIVE] Shadow Workflow deployed. Operational sync active.", delay: 4000 }
  ];

  const handleDeploy = () => {
    if (status !== "idle") return;
    
    setStatus("deploying");
    onDeployStart();
    setLogs(["[SYSTEM] Dequeueing build triggers...", "[SYSTEM] Fetching optimized DAG schema..."]);
    
    deploymentSteps.forEach((step) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step.log]);
        // Fluctuate CPU and Latency metrics during build
        setCpuLoad(Math.floor(Math.random() * 50) + 40);
        setNetworkLatency(Math.floor(Math.random() * 15) + 10);
      }, step.delay);
    });

    // Complete deployment
    setTimeout(() => {
      setStatus("success");
      onDeployComplete();
      setCpuLoad(4);
      setNetworkLatency(11);
    }, 4500);
  };

  // Auto-scroll terminal logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // CPU metric jitter
  useEffect(() => {
    const timer = setInterval(() => {
      if (status === "idle") {
        setCpuLoad(Math.floor(Math.random() * 4) + 8);
      } else if (status === "success") {
        setCpuLoad(Math.floor(Math.random() * 3) + 3);
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [status]);

  return (
    <div className="relative w-full rounded-2xl glass-panel p-4 md:p-6 overflow-hidden flex flex-col select-none border border-zinc-800">
      {/* Top Console Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400">Deploy Simulation Panel</h3>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-mono text-[10px] text-zinc-500">
            <Cpu className="w-3.5 h-3.5 text-zinc-600" />
            <span>CPU: {cpuLoad}%</span>
          </div>
          <div className="flex items-center space-x-1.5 font-mono text-[10px] text-zinc-500">
            <Activity className="w-3.5 h-3.5 text-zinc-600" />
            <span>LAT: {networkLatency}ms</span>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Terminal Screen (2 Cols on large screens) */}
        <div className="lg:col-span-2 flex flex-col rounded-lg bg-black border border-zinc-900 overflow-hidden shadow-inner">
          {/* Mock Mac-style window controls */}
          <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-900 flex items-center justify-between">
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            </div>
            <span className="font-mono text-[10px] text-zinc-600">shadowos-deployment-log</span>
            <div className="w-8" />
          </div>

          {/* Log Lines */}
          <div className="p-4 font-mono text-[10px] md:text-xs text-zinc-400 h-52 overflow-y-auto space-y-2 select-text">
            {logs.map((log, idx) => {
              let lineClass = "text-zinc-400";
              if (log.startsWith("//")) lineClass = "text-zinc-600 italic";
              if (log.startsWith("[INIT]") || log.startsWith("[SCAN]")) lineClass = "text-cyan-500/80";
              if (log.startsWith("[SYSTEM]")) lineClass = "text-purple-400";
              if (log.startsWith("[ACTIVE]") || log.startsWith("[VERIFY]")) lineClass = "text-emerald-400 font-bold";
              
              return (
                <div key={idx} className={`leading-relaxed ${lineClass}`}>
                  <span className="text-zinc-700 select-none mr-2">{(idx + 1).toString().padStart(2, '0')}</span>
                  {log}
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Action Panel (1 Col) */}
        <div className="flex flex-col justify-between p-4 rounded-lg bg-zinc-950/60 border border-zinc-900 space-y-4">
          <div className="space-y-2">
            <h4 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">Automation Engine</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              ShadowOS compiles business process models directly into serverless automation configurations. Click deploy to run testing suites and hook up the WhatsApp-to-CRM pipeline.
            </p>
          </div>

          <div className="space-y-3">
            {/* Deploy Trigger Button */}
            {status === "idle" && (
              <button
                onClick={handleDeploy}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-mono text-xs font-bold bg-cyan-500 text-black border border-cyan-400 hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer group"
              >
                <Play className="w-4 h-4 fill-black group-hover:scale-110 transition-transform" />
                <span>DEPLOY SHADOW WORKFLOW</span>
              </button>
            )}

            {status === "deploying" && (
              <button
                disabled
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-mono text-xs font-bold bg-cyan-950/40 text-cyan-400 border border-cyan-500/30"
              >
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>BUILDING SYSTEMS...</span>
              </button>
            )}

            {status === "success" && (
              <button
                disabled
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-mono text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              >
                <CheckCircle className="w-4 h-4" />
                <span>SYSTEM ACTIVE</span>
              </button>
            )}

            {/* Micro details annotation */}
            <div className="rounded p-2 bg-zinc-900/60 border border-zinc-800/40 text-[9px] font-mono text-zinc-500 flex justify-between">
              <span>POD STATUS:</span>
              <span className={status === "success" ? "text-emerald-400" : status === "deploying" ? "text-cyan-400" : "text-zinc-600"}>
                {status === "success" ? "HEALTHY (3/3)" : status === "deploying" ? "COMPILING" : "STANDBY"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
