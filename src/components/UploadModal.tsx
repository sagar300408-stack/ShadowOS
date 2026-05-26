"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileUp, Upload, CheckCircle2, Terminal, AlertCircle } from "lucide-react";
import React, { useState, useEffect } from "react";

interface UploadModalProps {
  onComplete: () => void;
  onClose: () => void;
}

export default function UploadModal({ onComplete, onClose }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Shadow Analysis Initializing...");
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const mockSamples = [
    { name: "whatsapp_sales_leads.txt", type: "WhatsApp Chat Log", size: "142 KB" },
    { name: "hubspot_pipeline_export.csv", type: "CRM Spreadsheet", size: "2.4 MB" },
    { name: "zendesk_customer_routing.json", type: "Support Logs", size: "512 KB" },
  ];

  const handleSelectSample = (name: string) => {
    setSelectedFile(name);
    startAnalysis();
  };

  const startAnalysis = () => {
    setIsProcessing(true);
    setProgress(0);
    setLogMessages(["[SYSTEM] Initiating dark workflow telemetry analysis..."]);
  };

  // Simulated analysis timers
  useEffect(() => {
    if (!isProcessing) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }
        // Speed up slightly or fluctuate for realism
        const increment = Math.floor(Math.random() * 4) + 2;
        return Math.min(prev + increment, 100);
      });
    }, 80);

    return () => clearInterval(progressInterval);
  }, [isProcessing, onComplete]);

  // Log message stream during processing
  useEffect(() => {
    if (!isProcessing) return;

    const messages = [
      { trigger: 15, text: "[DECODE] Extracting conversational timestamps from text threads..." },
      { trigger: 30, text: "[SCAN] Flagged 18 manual handoffs between CRM and Excel sheets." },
      { trigger: 45, text: "[BOTTLENECK] Calculated ₹2.4L/mo revenue leak at step: 'Manual Follow-up'." },
      { trigger: 60, text: "[FLOW] Synthesized optimal React Flow transition schema..." },
      { trigger: 75, text: "[INTEGRATION] Pre-compiled Node-Red automations for CRM sync." },
      { trigger: 90, text: "[INFRA] Shadow Dashboard build workspace complete." }
    ];

    messages.forEach((msg) => {
      if (progress >= msg.trigger && !logMessages.includes(msg.text)) {
        setLogMessages((prev) => [...prev, msg.text]);
      }
    });

    if (progress < 25) {
      setStatusText("Shadow Analysis Initializing...");
    } else if (progress < 55) {
      setStatusText("Scanning Messaging Threads & Timestamps...");
    } else if (progress < 80) {
      setStatusText("Reconstructing Optimal Workflow Path...");
    } else {
      setStatusText("Shadow Dashboard Ready.");
    }
  }, [progress, isProcessing, logMessages]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={!isProcessing ? onClose : undefined}
      />

      {/* Upload Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl glass-panel-cyan z-10 p-6 flex flex-col md:p-8"
      >
        {/* Glow corners */}
        <div className="absolute top-0 left-0 w-8 h-[2px] bg-cyan-400" />
        <div className="absolute top-0 left-0 w-[2px] h-8 bg-cyan-400" />
        <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-cyan-400" />
        <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-cyan-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-cyan-400 uppercase">ShadowOS Operational Engine</span>
          </div>
          {!isProcessing && (
            <button 
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-300 font-mono text-xs cursor-pointer"
            >
              [ESC] CANCEL
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!isProcessing ? (
            <motion.div
              key="select-mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Drag and Drop Zone */}
              <div 
                onClick={() => handleSelectSample("custom_upload.csv")}
                className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border border-dashed border-cyan-500/20 bg-cyan-950/10 hover:bg-cyan-950/20 hover:border-cyan-500/40 transition-all cursor-pointer group text-center"
              >
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/20 transition-all mb-4">
                  <Upload className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-mono text-sm font-semibold text-zinc-200 mb-1">Drag operational logs here</h3>
                <p className="text-xs text-zinc-500 max-w-xs">Supports CRM spreadsheets, support ticket CSVs, or WhatsApp chat export files</p>
                <span className="mt-4 font-mono text-xs text-cyan-400 bg-cyan-950/30 px-3 py-1 rounded border border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                  Browse Files
                </span>
              </div>

              {/* Sample Files Selection */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-mono text-xs text-cyan-400 uppercase tracking-wider">Or ingest sample logs to simulate:</h4>
                </div>
                <div className="space-y-2">
                  {mockSamples.map((sample) => (
                    <button
                      key={sample.name}
                      onClick={() => handleSelectSample(sample.name)}
                      className="w-full text-left p-3 rounded-lg border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900/60 hover:border-cyan-500/30 hover:shadow-[0_0_10px_rgba(6,182,212,0.05)] transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-cyan-400 group-hover:border-cyan-500/20">
                          <FileUp className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-mono text-xs text-zinc-300 group-hover:text-cyan-300 transition-colors">{sample.name}</p>
                          <p className="text-[10px] text-zinc-500">{sample.type}</p>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500 group-hover:text-zinc-400">{sample.size}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="processing-mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 flex flex-col justify-between"
            >
              {/* Spinning scanning animation */}
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative w-24 h-24 mb-6">
                  {/* Outer scan border */}
                  <div className="absolute inset-0 rounded-full border border-cyan-500/10" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-t border-r border-cyan-400/40"
                  />
                  {/* Glowing core */}
                  <div className="absolute inset-4 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center">
                    <span className="font-mono text-lg font-bold text-cyan-400">{progress}%</span>
                  </div>
                  {/* Pulse aura */}
                  <motion.div
                    animate={{ scale: [0.95, 1.15, 0.95], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-2 rounded-full border border-cyan-400/30"
                  />
                </div>

                <h3 className="font-mono text-sm font-semibold text-cyan-400 tracking-wide animate-pulse">{statusText}</h3>
                <p className="text-[10px] text-zinc-500 mt-1 font-mono">Analyzing: {selectedFile}</p>
              </div>

              {/* Console log display */}
              <div className="rounded-lg bg-black border border-zinc-800 p-4 font-mono text-[10px] text-zinc-400 space-y-1.5 h-36 overflow-y-auto">
                <AnimatePresence>
                  {logMessages.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start space-x-1.5"
                    >
                      <span className="text-cyan-500/80">⚡</span>
                      <span>{log}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Progress bar */}
              <div className="w-full">
                <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
