"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingDown, TrendingUp, DollarSign, Activity, AlertOctagon, 
  CheckSquare, Check, Calendar, ArrowRight, Eye, Play, Sparkles, Cpu, Clock
} from "lucide-react";
import React, { useState } from "react";
import WorkflowVisualizer from "./WorkflowVisualizer";
import DeploySimulation from "./DeploySimulation";

interface DashboardProps {
  isDeployed: boolean;
  isDeploying: boolean;
  onDeployStart: () => void;
  onDeployComplete: () => void;
}

export default function Dashboard({
  isDeployed,
  isDeploying,
  onDeployStart,
  onDeployComplete
}: DashboardProps) {
  // Activity timeline mock logs
  const getTimelineEvents = () => {
    if (isDeployed) {
      return [
        { time: "Just now", type: "system", text: "Shadow Node-7a deployed: Active webhook routing initialized." },
        { time: "Just now", type: "success", text: "CRM integration authorized: Token synchronized successfully." },
        { time: "2 min ago", type: "extract", text: "AI Parser successfully extracted contact name 'Rohan Mehta' from conversation stream." },
        { time: "10 min ago", type: "system", text: "Shadow telemetry scanner initialized on sales database." }
      ];
    }
    return [
      { time: "15 min ago", type: "warning", text: "Lead 'Ananya R.' dropped out: 24h delay in manual follow-up response." },
      { time: "1 hr ago", type: "leak", text: "Leakage of ₹15,000 recorded: Data manually keyed into sheet with incorrect phone field." },
      { time: "2 hr ago", type: "warning", text: "Lead copy-paste delay: Representative queue latency exceeded 180 minutes." },
      { time: "4 hr ago", type: "info", text: "Unstructured chat export processed from WhatsApp Sales Channel." }
    ];
  };

  const opportunities = [
    { id: "opt1", name: "WhatsApp to CRM Automatic Extraction", type: "Extraction Engine", timeSave: "6.5h/week" },
    { id: "opt2", name: "Automated Lead Recovery WhatsApp Reminders", type: "Follow-up Agent", timeSave: "12.0h/week" },
    { id: "opt3", name: "Duplicate Sales Lead Detection & Merging", type: "Routing Rule", timeSave: "4.2h/week" },
    { id: "opt4", name: "Out-of-Office Automatic Lead Handback", type: "Failover Agent", timeSave: "3.5h/week" }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 px-4 py-8 z-10 relative">
      {/* Cockpit Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-900 gap-4">
        <div className="flex items-center space-x-3">
          {/* Status Glow */}
          <div className="relative flex h-3.5 w-3.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isDeployed ? "bg-emerald-400" : isDeploying ? "bg-cyan-400" : "bg-cyan-500"
            }`} />
            <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
              isDeployed ? "bg-emerald-500" : isDeploying ? "bg-cyan-400" : "bg-cyan-500"
            }`} />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">ShadowOS Engine Status:</span>
              <span className={`font-mono text-xs font-bold uppercase tracking-wider ${
                isDeployed ? "text-emerald-400" : isDeploying ? "text-cyan-400 animate-pulse" : "text-cyan-400"
              }`}>
                {isDeployed ? "OPERATIONAL SYNC ACTIVE" : isDeploying ? "DEPLOYING PIPELINE..." : "SCANNING OPERATIONAL TELEMETRY"}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
              {isDeployed ? "Node Router: STABLE // Latency: 12ms // Loss: 0%" : "Telemetry: ONLINE // Ingesting data logs"}
            </p>
          </div>
        </div>

        {/* AI Action Indicator Box */}
        <div className="flex items-center space-x-2 bg-zinc-900/60 border border-zinc-800/40 px-3 py-1.5 rounded-lg">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-[10px] text-zinc-400">
            {isDeployed ? "AUTOMATION INSTANCES RUNNING: 4" : "POTENTIAL ROI DETECTED: 84%"}
          </span>
        </div>
      </div>

      {/* THREE SCORE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Inefficiency Score Card */}
        <motion.div 
          className="relative rounded-2xl glass-panel p-5 overflow-hidden border border-zinc-800"
          whileHover={{ y: -2 }}
        >
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between text-zinc-400 mb-4">
            <span className="font-mono text-xs uppercase tracking-wider">Inefficiency Score</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="flex items-baseline space-x-2">
            <motion.span 
              className={`text-4xl font-extrabold font-mono tracking-tight transition-colors ${
                isDeployed ? "text-emerald-400 glow-text-green" : "text-zinc-100"
              }`}
              animate={{ scale: isDeployed ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5 }}
            >
              {isDeployed ? "04%" : "72%"}
            </motion.span>
            <span className="text-zinc-500 text-xs font-mono">Manual Dependency</span>
          </div>

          <div className="mt-3 flex items-center space-x-1 text-[10px] font-mono text-zinc-500">
            {isDeployed ? (
              <>
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">-68% improvement</span>
                <span>telemetry active</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span className="text-rose-400 font-bold">Critically High</span>
                <span>bottleneck detected</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Card 2: Revenue Leakage Card */}
        <motion.div 
          className="relative rounded-2xl glass-panel p-5 overflow-hidden border border-zinc-800"
          whileHover={{ y: -2 }}
        >
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between text-zinc-400 mb-4">
            <span className="font-mono text-xs uppercase tracking-wider">Potential Revenue Leakage</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>

          <div className="flex items-baseline space-x-2">
            <motion.span 
              className={`text-4xl font-extrabold font-mono tracking-tight transition-colors ${
                isDeployed ? "text-emerald-400 glow-text-green" : "text-zinc-100"
              }`}
            >
              {isDeployed ? "₹0.0L" : "₹2.4L"}
            </motion.span>
            <span className="text-zinc-500 text-xs font-mono">/ month</span>
          </div>

          <div className="mt-3 flex items-center space-x-1 text-[10px] font-mono text-zinc-500">
            {isDeployed ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">100% Resolved</span>
                <span>zero leakage flagged</span>
              </>
            ) : (
              <>
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span className="text-rose-400 font-bold">₹28.8L annual risk</span>
                <span>leaking lead queue</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Card 3: Repeated Tasks Card */}
        <motion.div 
          className="relative rounded-2xl glass-panel p-5 overflow-hidden border border-zinc-800"
          whileHover={{ y: -2 }}
        >
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between text-zinc-400 mb-4">
            <span className="font-mono text-xs uppercase tracking-wider">Repetitive Actions</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="flex items-baseline space-x-2">
            <motion.span 
              className={`text-4xl font-extrabold font-mono tracking-tight transition-colors ${
                isDeployed ? "text-emerald-400 glow-text-green" : "text-zinc-100"
              }`}
            >
              {isDeployed ? "0" : "47"}
            </motion.span>
            <span className="text-zinc-500 text-xs font-mono">Manual tasks / week</span>
          </div>

          <div className="mt-3 flex items-center space-x-1 text-[10px] font-mono text-zinc-500">
            {isDeployed ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Auto-extracted</span>
                <span>via background cron</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-400 font-bold">24h wasted weekly</span>
                <span>copy-pasting text logs</span>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* WARNING/ALERT DRAWER */}
      <AnimatePresence mode="wait">
        {!isDeployed ? (
          <motion.div
            key="warning-alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-start space-x-3 shadow-[0_0_15px_rgba(244,63,94,0.05)]">
              <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="font-mono text-xs font-bold text-rose-400 uppercase tracking-wider">Workflow Fragmentation Detected</h4>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  Operational disconnect identified between incoming WhatsApp chats and CRM lead records. Leads remain unassigned in excel spreadsheets for an average of 4.2 hours, causing a 43% response dropout rate.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-start space-x-3 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">Operational Fragmentation Resolved</h4>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  Automated sync active. WhatsApp chats are parsed contextually in 1.2s and logged to CRM fields instantly. Manual spreadsheet transfers have been completely eliminated.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* React Flow styled Workflow Visualizer */}
      <WorkflowVisualizer />

      {/* TWO PANEL COLUMNS: AI FINDINGS & OPPORTUNITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI Findings */}
        <div className="rounded-2xl glass-panel p-5 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3 mb-4">
              <Eye className="w-4 h-4 text-cyan-400" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400">AI Operational Findings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-900/60">
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase font-bold">High Priority</span>
                <h4 className="font-mono text-xs font-bold text-zinc-200 mt-2">Lead Sync Bottleneck</h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  Sales managers are copy-pasting customer profiles from WhatsApp chats into HubSpot deals. Average copy-paste lag: 2 hours 18 minutes.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-900/60">
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 uppercase font-bold">Medium Priority</span>
                <h4 className="font-mono text-xs font-bold text-zinc-200 mt-2">Duplicate Entry Loop</h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  Same customers are sending queries on both WhatsApp and Support Email, creating duplicate leads in spreadsheets. Duplicate rate: 14.8%.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-zinc-900/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>MODELS IN USE: GPT-4o + telemetry classifier</span>
            <span>UPDATED: SECONDS AGO</span>
          </div>
        </div>

        {/* Right: Automation Opportunities */}
        <div className="rounded-2xl glass-panel p-5 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3 mb-4">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400">Automation Opportunities</h3>
            </div>

            <div className="space-y-3">
              {opportunities.map((opt) => (
                <div 
                  key={opt.id}
                  className="p-3 rounded-lg border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-950 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded border transition-colors ${
                      isDeployed 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:text-cyan-400 group-hover:border-cyan-500/20"
                    }`}>
                      {isDeployed ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full bg-transparent border border-zinc-500 group-hover:border-cyan-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-mono text-xs text-zinc-200 group-hover:text-cyan-400 transition-colors">{opt.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{opt.type}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/10">
                    {opt.timeSave} saved
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-900/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>TOTAL OPTIMIZATION SAVINGS:</span>
            <span className="text-emerald-400 font-bold">26.2 hours / week</span>
          </div>
        </div>
      </div>

      {/* Deploy Simulation panel */}
      <DeploySimulation 
        isDeployed={isDeployed}
        onDeployStart={onDeployStart}
        onDeployComplete={onDeployComplete}
      />

      {/* Activity Timeline logs */}
      <div className="rounded-2xl glass-panel p-5 border border-zinc-800">
        <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3 mb-4">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400">Operational Log Feed</h3>
        </div>

        <div className="space-y-4">
          {getTimelineEvents().map((event, idx) => (
            <div key={idx} className="flex items-start space-x-3 text-xs">
              <span className="font-mono text-[10px] text-zinc-600 shrink-0 w-20">{event.time}</span>
              <div className="mt-1 shrink-0">
                <div className={`w-2 h-2 rounded-full ${
                  event.type === "success" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" :
                  event.type === "warning" ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" :
                  event.type === "leak" ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" :
                  "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                }`} />
              </div>
              <p className="text-zinc-300 font-mono flex-1">{event.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Inline fallback for CheckCircle2 from lucide-react if needed, but it is available.
function CheckCircle2(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
