"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Cpu, TrendingUp, DollarSign, Settings, CheckSquare, 
  ArrowRight, ShieldCheck, Database, LayoutGrid, Eye, Terminal, Activity
} from "lucide-react";
import React, { useState } from "react";
import BackgroundGrid from "@/components/BackgroundGrid";
import UploadModal from "@/components/UploadModal";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [viewMode, setViewMode] = useState<"landing" | "dashboard">("landing");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  // Triggered when simulated upload completes
  const handleUploadComplete = () => {
    setIsUploadOpen(false);
    setViewMode("dashboard");
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Background visual components */}
      <BackgroundGrid />

      {/* Global Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between border-b border-zinc-900/60 bg-[#030303]/30 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          {/* Logo Icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px] flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <div className="w-full h-full bg-black rounded-lg flex items-center justify-center font-mono font-bold text-xs text-cyan-400">
              S⚡
            </div>
          </div>
          <div>
            <h1 className="font-mono text-sm font-bold tracking-wider text-zinc-100 uppercase flex items-center space-x-1.5">
              <span>ShadowOS</span>
              <span className="text-[8px] bg-cyan-950 border border-cyan-500/30 text-cyan-400 px-1 py-0.5 rounded font-normal font-mono">V1.0.4</span>
            </h1>
          </div>
        </div>

        {/* Header telemetry badge */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 bg-zinc-950 border border-zinc-900 px-3 py-1 rounded-md text-[10px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span>OPERATIONAL CLOUD GATEWAY: ONLINE</span>
          </div>
          {viewMode === "dashboard" && (
            <button 
              onClick={() => {
                setViewMode("landing");
                setIsDeployed(false);
                setIsDeploying(false);
              }}
              className="font-mono text-xs text-zinc-500 hover:text-zinc-300 border border-zinc-800 bg-zinc-950/40 px-3 py-1.5 rounded-md cursor-pointer transition-colors"
            >
              [ RESET ]
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          {viewMode === "landing" ? (
            <motion.div
              key="landing-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Left Side Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  {/* Tagline Badge */}
                  <div className="inline-flex items-center space-x-2 bg-cyan-950/30 border border-cyan-500/20 px-3 py-1 rounded-full text-xs text-cyan-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="font-mono tracking-wider uppercase text-[10px]">Jarvis for Business Operations</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-100">
                    AI That Discovers <br />
                    <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent glow-text-cyan">
                      Hidden Operational Chaos
                    </span>
                  </h2>

                  <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-lg">
                    ShadowOS analyzes business workflows, detects inefficiencies, identifies operational bottlenecks, and generates intelligent automation systems before businesses realize they need them.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center justify-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs px-6 py-3.5 rounded-lg border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer group"
                  >
                    <span>ANALYZE OPERATIONS</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center justify-center space-x-2 bg-zinc-950/60 border border-zinc-800 hover:border-cyan-500/30 hover:bg-zinc-900/40 text-zinc-300 font-mono text-xs px-6 py-3.5 rounded-lg cursor-pointer transition-all"
                  >
                    <span>VIEW WORKFLOW INTELLIGENCE</span>
                  </button>
                </div>

                {/* Metrics Cards Grid (2x2) */}
                <div className="grid grid-cols-2 gap-4 max-w-md pt-4">
                  {/* Metric 1 */}
                  <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between text-zinc-500">
                      <span className="font-mono text-[9px] uppercase tracking-wider">Manual Dependency</span>
                      <Settings className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <p className="font-mono text-xl font-extrabold text-zinc-200">72%</p>
                    <p className="text-[10px] text-zinc-500">Manual workflows detected</p>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between text-zinc-500">
                      <span className="font-mono text-[9px] uppercase tracking-wider">Revenue Leakage</span>
                      <DollarSign className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                    </div>
                    <p className="font-mono text-xl font-extrabold text-rose-400">₹2.4L<span className="text-[10px] text-zinc-500 font-normal font-sans">/mo</span></p>
                    <p className="text-[10px] text-zinc-500">Potential leakage calculated</p>
                  </div>

                  {/* Metric 3 */}
                  <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between text-zinc-500">
                      <span className="font-mono text-[9px] uppercase tracking-wider">Efficiency Shift</span>
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <p className="font-mono text-xl font-extrabold text-emerald-400">+43%</p>
                    <p className="text-[10px] text-zinc-500">Target workflow gain</p>
                  </div>

                  {/* Metric 4 */}
                  <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between text-zinc-500">
                      <span className="font-mono text-[9px] uppercase tracking-wider">Opportunities</span>
                      <Cpu className="w-3.5 h-3.5 text-purple-500" />
                    </div>
                    <p className="font-mono text-xl font-extrabold text-zinc-200">12 Systems</p>
                    <p className="text-[10px] text-zinc-500">Auto-generation modules</p>
                  </div>
                </div>
              </div>

              {/* Right Side Visuals (Command Cockpit Mockup) */}
              <div className="relative flex items-center justify-center">
                {/* Circular scanner glowing widget */}
                <div className="w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-full border border-cyan-500/10 flex items-center justify-center relative shadow-[0_0_30px_rgba(6,182,212,0.03)] bg-zinc-950/10 backdrop-blur-sm">
                  {/* Outer Orbit */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 rounded-full border border-dashed border-cyan-500/20"
                  />
                  {/* Inner Orbit */}
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-16 rounded-full border border-purple-500/15"
                  />
                  {/* Core glow sensor */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-950/60 to-zinc-900 border border-cyan-500/30 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                    <Cpu className="w-7 h-7 text-cyan-400 animate-pulse" />
                    <span className="font-mono text-[8px] text-cyan-400 mt-1 uppercase tracking-widest">Active Core</span>
                  </div>

                  {/* Operational Nodes joined absolutely */}
                  {/* Node 1 */}
                  <div className="absolute top-[10%] left-[20%] p-2 rounded-lg bg-zinc-950 border border-zinc-900 text-zinc-300 flex items-center space-x-1.5 shadow-lg">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-mono text-[9px]">Ingest: WhatsApp</span>
                  </div>

                  {/* Node 2 */}
                  <div className="absolute bottom-[20%] left-[5%] p-2 rounded-lg bg-zinc-950 border border-zinc-900 text-zinc-300 flex items-center space-x-1.5 shadow-lg">
                    <LayoutGrid className="w-3.5 h-3.5 text-purple-400" />
                    <span className="font-mono text-[9px]">Map: Excel.csv</span>
                  </div>

                  {/* Node 3 */}
                  <div className="absolute top-[30%] right-[5%] p-2 rounded-lg bg-zinc-950 border border-zinc-900 text-zinc-300 flex items-center space-x-1.5 shadow-lg">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-mono text-[9px]">Flag: Bottlenecks</span>
                  </div>

                  {/* Node 4 */}
                  <div className="absolute bottom-[10%] right-[20%] p-2 rounded-lg bg-zinc-950 border border-zinc-900 text-zinc-300 flex items-center space-x-1.5 shadow-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono text-[9px]">Deploy: Sync</span>
                  </div>

                  {/* Telemetry output box in corner */}
                  <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[240px] p-2.5 rounded-lg bg-black border border-zinc-900 text-[8px] font-mono text-zinc-500 space-y-1 shadow-2xl">
                    <div className="flex justify-between items-center text-cyan-400 border-b border-zinc-900 pb-1">
                      <span>TELEMETRY STREAM</span>
                      <span>SCANNING...</span>
                    </div>
                    <div className="truncate">► Ingesting sales channels...</div>
                    <div className="truncate">► Discovered 3 manual handoff pathways</div>
                    <div className="truncate text-rose-400/80">► Redundant copy loop detected in spreadsheet</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <Dashboard 
                isDeployed={isDeployed}
                isDeploying={isDeploying}
                onDeployStart={() => setIsDeploying(true)}
                onDeployComplete={() => {
                  setIsDeploying(false);
                  setIsDeployed(true);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload Flow Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <UploadModal 
            onComplete={handleUploadComplete} 
            onClose={() => setIsUploadOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Global footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 border-t border-zinc-900/60 text-center flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-zinc-600 gap-2">
        <span>© 2026 SHADOWOS OPERATIONS INTELLIGENCE LABORATORY</span>
        <div className="flex space-x-4">
          <span>SECURE SYSTEM</span>
          <span>TELEMETRY: ONLINE</span>
        </div>
      </footer>
    </main>
  );
}
