"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, FileSpreadsheet, AlertTriangle, ArrowRight, UserMinus,
  Cpu, Database, Sparkles, UserCheck, ShieldAlert, ArrowDownRight, ArrowUpRight
} from "lucide-react";
import React, { useState } from "react";

export default function WorkflowVisualizer() {
  const [activeFlow, setActiveFlow] = useState<"before" | "after">("before");

  // Before Nodes Schema
  const beforeNodes = [
    {
      id: "b1",
      title: "WhatsApp Lead",
      desc: "Raw chats received",
      status: "UNSTRUCTURED",
      icon: MessageSquare,
      color: "zinc",
      pos: { x: "5%", y: "15%" }
    },
    {
      id: "b2",
      title: "Manual Copy-Paste",
      desc: "Data typed into sheets",
      status: "DELAY: 2-4 HOURS",
      icon: FileSpreadsheet,
      color: "rose",
      pos: { x: "42%", y: "15%" }
    },
    {
      id: "b3",
      title: "Manual Follow-Up",
      desc: "Representative calls",
      status: "DELAY: 24 HOURS",
      icon: AlertTriangle,
      color: "rose",
      pos: { x: "78%", y: "15%" }
    },
    {
      id: "b4",
      title: "Lost Lead",
      desc: "Lead went to competitor",
      status: "LEAKAGE DETECTED",
      icon: UserMinus,
      color: "rose",
      pos: { x: "78%", y: "70%" }
    }
  ];

  // After Nodes Schema (ShadowOS)
  const afterNodes = [
    {
      id: "a1",
      title: "WhatsApp Lead",
      desc: "Incoming chat stream",
      status: "INGESTED INSTANTLY",
      icon: MessageSquare,
      color: "cyan",
      pos: { x: "5%", y: "15%" }
    },
    {
      id: "a2",
      title: "Shadow AI Parser",
      desc: "Context extraction (LLM)",
      status: "PROCESSING: 1.2S",
      icon: Cpu,
      color: "purple",
      pos: { x: "42%", y: "15%" }
    },
    {
      id: "a3",
      title: "API CRM Sync",
      desc: "Auto lead creation",
      status: "DEAL STAGE LOCKED",
      icon: Database,
      color: "cyan",
      pos: { x: "78%", y: "15%" }
    },
    {
      id: "a4",
      title: "Auto follow-up",
      desc: "AI triggers recovery chat",
      status: "INSTANT ENGAGEMENT",
      icon: Sparkles,
      color: "emerald",
      pos: { x: "42%", y: "70%" }
    },
    {
      id: "a5",
      title: "Recovered Lead",
      desc: "Deal closed successfully",
      status: "OPTIMIZED",
      icon: UserCheck,
      color: "emerald",
      pos: { x: "78%", y: "70%" }
    }
  ];

  return (
    <div className="relative w-full rounded-2xl glass-panel p-4 md:p-6 overflow-hidden min-h-[580px] flex flex-col justify-between select-none">
      {/* Header and Toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-800 pb-4 mb-4 gap-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400">Operational Graph Model</h3>
          </div>
          <h2 className="text-lg font-bold text-zinc-100">Workflow Visualization</h2>
        </div>

        {/* Action Toggle Switch */}
        <div className="flex p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveFlow("before")}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-md font-mono text-xs cursor-pointer transition-all ${
              activeFlow === "before" 
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                : "text-zinc-500 hover:text-zinc-300 border border-transparent"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Before: Chaos</span>
          </button>
          <button
            onClick={() => setActiveFlow("after")}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-md font-mono text-xs cursor-pointer transition-all ${
              activeFlow === "after" 
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                : "text-zinc-500 hover:text-zinc-300 border border-transparent"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>After: ShadowOS</span>
          </button>
        </div>
      </div>

      {/* Grid Canvas Area */}
      <div className="relative flex-1 w-full border border-zinc-800/40 rounded-xl bg-zinc-950/40 cockpit-grid p-2 md:p-4 overflow-hidden min-h-[400px]">
        {/* SVG edges rendering */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            {/* Glowing marker dots */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            </pattern>
          </defs>
          
          <AnimatePresence mode="wait">
            {activeFlow === "before" ? (
              <motion.g
                key="before-wires"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* WhatsApp to Excel */}
                <path d="M 180 60 Q 250 60, 310 60" fill="none" stroke="rgba(244,63,94,0.3)" strokeWidth="2" className="marching-ants stroke-rose-500" style={{ animationDuration: '3s' }} />
                {/* Excel to Follow-up */}
                <path d="M 490 60 Q 560 60, 620 60" fill="none" stroke="rgba(244,63,94,0.3)" strokeWidth="2" className="marching-ants stroke-rose-500" style={{ animationDuration: '3s' }} />
                {/* Follow-up to Lost Lead */}
                <path d="M 690 110 Q 690 190, 690 240" fill="none" stroke="rgba(244,63,94,0.3)" strokeWidth="2" className="marching-ants stroke-rose-500" style={{ animationDuration: '3s' }} />
              </motion.g>
            ) : (
              <motion.g
                key="after-wires"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* WhatsApp to Parser */}
                <path d="M 180 60 Q 250 60, 310 60" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="2" className="marching-ants stroke-cyan-400" />
                {/* Parser to CRM Sync */}
                <path d="M 490 60 Q 560 60, 620 60" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="2" className="marching-ants stroke-cyan-400" />
                {/* Parser down to Auto Follow Up */}
                <path d="M 380 110 Q 380 190, 380 240" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="2" className="marching-ants stroke-purple-400" />
                {/* CRM Sync down to Recovery */}
                <path d="M 690 110 Q 690 190, 690 240" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="2" className="marching-ants stroke-emerald-400" />
                {/* Auto Follow-up to Recovery */}
                <path d="M 490 280 Q 560 280, 620 280" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="2" className="marching-ants stroke-emerald-400" />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Responsive Mobile Layout (Stacked list) */}
        <div className="md:hidden space-y-4 relative z-10 py-4">
          <AnimatePresence mode="wait">
            {activeFlow === "before" ? (
              <motion.div
                key="before-mobile"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {beforeNodes.map((node, i) => {
                  const Icon = node.icon;
                  return (
                    <div 
                      key={node.id} 
                      className="glass-panel-rose rounded-xl p-4 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.05)]"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded bg-rose-950/20 border border-rose-500/30 text-rose-400">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-mono text-xs font-bold text-zinc-100">{node.title}</h4>
                            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-rose-950/30 border border-rose-500/30 text-rose-400 font-bold uppercase">{node.status}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{node.desc}</p>
                        </div>
                      </div>
                      {i < beforeNodes.length - 1 && (
                        <div className="flex justify-center mt-3 -mb-1 text-rose-500/40">
                          <ArrowRight className="w-4 h-4 rotate-90" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="after-mobile"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {afterNodes.map((node, i) => {
                  const Icon = node.icon;
                  return (
                    <div 
                      key={node.id} 
                      className={`rounded-xl p-4 border shadow-[0_0_15px_rgba(6,182,212,0.05)] ${
                        node.color === "cyan" ? "glass-panel-cyan border-cyan-500/20" :
                        node.color === "purple" ? "glass-panel-purple border-purple-500/20" :
                        "glass-panel-green border-emerald-500/20"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded bg-zinc-950 border ${
                          node.color === "cyan" ? "border-cyan-500/30 text-cyan-400" :
                          node.color === "purple" ? "border-purple-500/30 text-purple-400" :
                          "border-emerald-500/30 text-emerald-400"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-mono text-xs font-bold text-zinc-100">{node.title}</h4>
                            <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded uppercase font-bold border ${
                              node.color === "cyan" ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-400" :
                              node.color === "purple" ? "bg-purple-950/30 border-purple-500/30 text-purple-400" :
                              "bg-emerald-950/30 border-emerald-500/30 text-emerald-400"
                            }`}>{node.status}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{node.desc}</p>
                        </div>
                      </div>
                      {i < afterNodes.length - 1 && (
                        <div className="flex justify-center mt-3 -mb-1 text-cyan-500/40">
                          <ArrowRight className="w-4 h-4 rotate-90" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Absolute Grid Map */}
        <div className="hidden md:block relative w-full h-[320px] z-10">
          <AnimatePresence mode="wait">
            {activeFlow === "before" ? (
              <motion.div
                key="before-desktop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {/* Node mapping */}
                <div className="absolute w-[180px]" style={{ left: "5%", top: "10%" }}>
                  <BeforeNodeCard node={beforeNodes[0]} />
                </div>
                <div className="absolute w-[180px]" style={{ left: "38%", top: "10%" }}>
                  <BeforeNodeCard node={beforeNodes[1]} />
                </div>
                <div className="absolute w-[180px]" style={{ left: "71%", top: "10%" }}>
                  <BeforeNodeCard node={beforeNodes[2]} />
                </div>
                <div className="absolute w-[180px]" style={{ left: "71%", top: "60%" }}>
                  <BeforeNodeCard node={beforeNodes[3]} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="after-desktop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {/* Node mapping */}
                <div className="absolute w-[180px]" style={{ left: "5%", top: "10%" }}>
                  <AfterNodeCard node={afterNodes[0]} />
                </div>
                <div className="absolute w-[180px]" style={{ left: "38%", top: "10%" }}>
                  <AfterNodeCard node={afterNodes[1]} />
                </div>
                <div className="absolute w-[180px]" style={{ left: "71%", top: "10%" }}>
                  <AfterNodeCard node={afterNodes[2]} />
                </div>
                <div className="absolute w-[180px]" style={{ left: "38%", top: "60%" }}>
                  <AfterNodeCard node={afterNodes[3]} />
                </div>
                <div className="absolute w-[180px]" style={{ left: "71%", top: "60%" }}>
                  <AfterNodeCard node={afterNodes[4]} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer statistics annotation */}
      <div className="mt-4 p-3 rounded-lg bg-zinc-950 border border-zinc-900 text-xs text-zinc-400 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-1.5 h-1.5 rounded-full ${activeFlow === "before" ? "bg-rose-500 animate-pulse" : "bg-cyan-500 animate-pulse"}`} />
          <span className="font-mono text-[10px]">
            {activeFlow === "before" 
              ? "LEAKAGE DETECTED: Manual delays create high dropout rates."
              : "OPTIMIZATION SEQUENCE: AI operates webhooks in <2 seconds."
            }
          </span>
        </div>
        <span className="font-mono text-[10px] text-zinc-600 hidden sm:inline">SCALE: 1:1 AUTO-COMPILING</span>
      </div>
    </div>
  );
}

// Subcomponents
function BeforeNodeCard({ node }: { node: any }) {
  const Icon = node.icon;
  return (
    <div className="glass-panel-rose border border-rose-500/20 rounded-xl p-3 shadow-lg select-none relative group hover:border-rose-500/40 hover:shadow-[0_0_15px_rgba(244,63,94,0.1)] transition-all">
      <div className="flex items-start space-x-2.5">
        <div className="p-1.5 rounded bg-rose-950/20 border border-rose-500/30 text-rose-400">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-mono text-[11px] font-bold text-zinc-100 truncate">{node.title}</h4>
          <p className="text-[9px] text-zinc-500 truncate mt-0.5">{node.desc}</p>
          <span className="inline-block mt-2 font-mono text-[8px] px-1 py-0.5 rounded bg-rose-950/30 border border-rose-500/20 text-rose-400 font-bold uppercase">
            {node.status}
          </span>
        </div>
      </div>
    </div>
  );
}

function AfterNodeCard({ node }: { node: any }) {
  const Icon = node.icon;
  
  const borderClass = 
    node.color === "cyan" ? "border-cyan-500/20 glass-panel-cyan hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]" :
    node.color === "purple" ? "border-purple-500/20 glass-panel-purple hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.1)]" :
    "border-emerald-500/20 glass-panel-green hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]";

  const iconBorder = 
    node.color === "cyan" ? "border-cyan-500/30 text-cyan-400" :
    node.color === "purple" ? "border-purple-500/30 text-purple-400" :
    "border-emerald-500/30 text-emerald-400";

  const badgeBorder =
    node.color === "cyan" ? "bg-cyan-950/30 border-cyan-500/20 text-cyan-400" :
    node.color === "purple" ? "bg-purple-950/30 border-purple-500/20 text-purple-400" :
    "bg-emerald-950/30 border-emerald-500/20 text-emerald-400";

  return (
    <div className={`border rounded-xl p-3 shadow-lg select-none relative group transition-all ${borderClass}`}>
      {node.color === "emerald" && (
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      )}
      <div className="flex items-start space-x-2.5">
        <div className={`p-1.5 rounded bg-zinc-950 border ${iconBorder}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-mono text-[11px] font-bold text-zinc-100 truncate">{node.title}</h4>
          <p className="text-[9px] text-zinc-500 truncate mt-0.5">{node.desc}</p>
          <span className={`inline-block mt-2 font-mono text-[8px] px-1 py-0.5 rounded font-bold border uppercase ${badgeBorder}`}>
            {node.status}
          </span>
        </div>
      </div>
    </div>
  );
}
