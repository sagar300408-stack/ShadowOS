"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  DatabaseZap,
  FileSpreadsheet,
  Loader2,
  Radar,
  UploadCloud,
  XCircle,
  Clock3,
  Hourglass,
  TrendingUp,
  Bot,
  Zap,
  Repeat2,
  ShieldAlert,
  Workflow,
  BrainCircuit,
} from "lucide-react";
import { uploadWorkflowFile, type UploadMetadata } from "@/lib/shadowos-api";

const ACCEPTED_EXTENSIONS = [".csv", ".xls", ".xlsx"];
const ACCEPT_ATTRIBUTE = ".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

type UploadState = "idle" | "ready" | "uploading" | "uploaded" | "error";
type IntroStep = "pain" | "upload" | "discovery" | "verdict" | "summary";

import { useAnalysis } from "@/lib/AnalysisContext";

export function UploadScreen() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<UploadMetadata | null>(null);
  const [status, setStatus] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Onboarding Flow States
  const [introStep, setIntroStep] = useState<IntroStep>("pain");

  // Analysis engine states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  
  const { loadAnalysis, analysis } = useAnalysis();

  const fileSummary = useMemo(() => {
    if (!selectedFile) {
      return "CSV and Excel workflow exports";
    }

    const sizeInKb = Math.max(selectedFile.size / 1024, 1);
    return `${selectedFile.name} · ${sizeInKb.toFixed(1)} KB`;
  }, [selectedFile]);

  const chooseFile = useCallback((file: File | null) => {
    if (!file) {
      return;
    }

    const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      setSelectedFile(null);
      setMetadata(null);
      setStatus("error");
      setError("ShadowOS accepts CSV, XLS, and XLSX workflow exports.");
      return;
    }

    setSelectedFile(file);
    setMetadata(null);
    setStatus("ready");
    setError(null);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || status === "uploading") {
      return;
    }

    setStatus("uploading");
    setError(null);

    try {
      const result = await uploadWorkflowFile(selectedFile);
      setMetadata(result.metadata);
      localStorage.setItem("shadowos_upload_id", result.metadata.upload_id);
      setStatus("uploaded");
    } catch (uploadError) {
      setMetadata(null);
      setStatus("error");
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    }
  };

  const handleAnalyze = async () => {
    if (!metadata) {
      return;
    }

    setIntroStep("discovery");
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisLogs(["Initiating operational scan..."]);

    try {
      setAnalysisProgress(20);
      setAnalysisLogs((prev) => [...prev, "Connecting to analysis engine..."]);
      
      const logInterval = setInterval(() => {
        setAnalysisProgress((p) => Math.min(p + 15, 85));
      }, 600);

      await loadAnalysis(metadata.upload_id);

      clearInterval(logInterval);
      setAnalysisProgress(100);
      setAnalysisLogs((prev) => [...prev, "Scan complete."]);
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setIntroStep("verdict");
      }, 1000);
    } catch (err) {
      setAnalysisLogs((prev) => [...prev, "Analysis failed."]);
      setIsAnalyzing(false);
      setStatus("error");
      setError("Failed to load analysis telemetry.");
      setIntroStep("upload");
    }
  };

  // PRIORITY 1: PAIN SCREEN
  if (introStep === "pain") {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-6 text-slate-100 font-sans">
        <div className="w-full max-w-4xl border border-cyan-500/10 bg-slate-950/60 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.52)] backdrop-blur-md relative overflow-hidden animate-[metric-rise_450ms_ease-out_both]">
          {/* Subtle decoration nodes */}
          <div className="absolute top-0 right-0 border-l border-b border-cyan-500/20 bg-cyan-950/40 px-3 py-1 text-[9px] font-mono tracking-widest text-cyan-400 uppercase">
            Operational Gap Report
          </div>
          <div className="absolute -top-24 -left-24 size-48 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
          <div className="space-y-8 relative z-20">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-400 font-mono">
                Real Estate Workflow Vulnerability
              </p>
              <h2 className="text-2xl md:text-4xl font-extrabold leading-snug text-white">
                "Your leads aren't disappearing. <br/>
                <span className="text-cyan-400">Your workflow is."</span>
              </h2>
            </div>

            {/* FLOW CHART TIMELINE */}
            <div className="border border-slate-900 bg-slate-950/50 p-6">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block mb-4">
                The Leakage Pipeline (Manual Flow Decay)
              </span>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs font-mono relative">
                {[
                  { title: "Lead WhatsApp", desc: "Lead arrives via chat" },
                  { title: "Excel Sheet", desc: "Broker manually updates sheet" },
                  { title: "Manual Visit Track", desc: "Site visit logged on paper" },
                  { title: "Delayed Follow-Up", desc: "No reminders, 12h+ contact lag" },
                  { title: "Lead Disappears", desc: "Zero conversion / deal lost" }
                ].map((step, idx, arr) => (
                  <div key={idx} className="flex-1 flex md:flex-col items-start gap-3 md:gap-2 relative z-10">
                    <div className="flex items-center md:flex-col gap-3 md:gap-2 w-full">
                      <div className="grid size-7 shrink-0 place-items-center border border-rose-500/30 bg-rose-950/50 text-rose-400 font-bold text-xs rounded-full">
                        {idx + 1}
                      </div>
                      {idx < arr.length - 1 && (
                        <div className="hidden md:block w-full h-px border-t border-dashed border-rose-500/20 my-auto flex-1 mt-3.5" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-200">{step.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KEY BUSINESS OUTCOMES / METRICS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-900 pt-6">
              <div className="border border-rose-500/15 bg-rose-950/5 p-4 text-center flex flex-col justify-between min-h-[90px]">
                <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block">
                  Lead Loss Rate
                </span>
                <span className="text-2xl font-extrabold text-rose-400 block mt-2 font-mono">
                  32%
                </span>
              </div>
              <div className="border border-amber-500/15 bg-amber-950/5 p-4 text-center flex flex-col justify-between min-h-[90px]">
                <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block">
                  Manual Work
                </span>
                <span className="text-2xl font-extrabold text-amber-400 block mt-2 font-mono">
                  18 hrs/week
                </span>
              </div>
              <div className="border border-rose-500/15 bg-rose-950/5 p-4 text-center flex flex-col justify-between min-h-[90px]">
                <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block">
                  Revenue Exposure
                </span>
                <span className="text-2xl font-extrabold text-rose-400 block mt-2 font-mono">
                  ₹12.4L
                </span>
              </div>
              <div className="border border-emerald-500/15 bg-emerald-950/5 p-4 text-center flex flex-col justify-between min-h-[90px]">
                <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block">
                  Recovery Potential
                </span>
                <span className="text-2xl font-extrabold text-emerald-400 block mt-2 font-mono">
                  ₹8.2L
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIntroStep("upload")}
                className="inline-flex h-11 items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 text-xs tracking-wider uppercase transition border border-cyan-400/40 rounded-none cursor-pointer"
              >
                <span>Reveal Operational Blind Spots</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // PRIORITY 1: AI DISCOVERY SEQUENCE
  if (introStep === "discovery") {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-6 text-slate-100 font-sans">
        <div className="w-full max-w-2xl border border-cyan-500/15 bg-slate-950/60 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.52)] backdrop-blur-md relative overflow-hidden animate-[metric-rise_450ms_ease-out_both]">
          {/* Telemetry scan line & signal grids */}
          <div className="absolute left-0 right-0 h-0.5 bg-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-[scan-line_3s_linear_infinite] pointer-events-none z-10" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:100%_6px] pointer-events-none z-10 animate-pulse" />
          
          <div className="flex min-h-[380px] flex-col justify-between p-4 font-mono relative z-20">
            <div>
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-5">
                <span className="text-xs font-bold text-cyan-300 tracking-wider">
                  SYSTEM INTEGRITY SCAN: RADAR
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[10px] text-cyan-400">ACTIVE</span>
                </span>
              </div>

              {/* CIRCULAR GAUGES & PROGRESS */}
              <div className="flex items-center gap-6 my-6">
                <div className="relative size-16 shrink-0 grid place-items-center">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/30 animate-spin" />
                  <div className="absolute inset-2 rounded-full border border-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold text-cyan-300">{analysisProgress}%</span>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-full bg-slate-900 border border-cyan-500/20">
                    <div
                      className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-500"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                    Analyzing operational footprints
                  </span>
                </div>
              </div>

              {/* LOG WINDOW */}
              <div className="border border-cyan-500/10 bg-slate-950 p-4 h-48 overflow-y-auto space-y-2 text-xs select-none">
                {analysisLogs.map((log, index) => {
                  const isLast = index === analysisLogs.length - 1;
                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-2 transition-all duration-300 ${
                        isLast ? "text-cyan-300 font-semibold" : "text-slate-500"
                      }`}
                    >
                      <span className="text-[10px] text-cyan-600 mt-0.5">❯</span>
                      <span className={isLast ? "shadow-[0_0_8px_rgba(6,182,212,0.15)]" : ""}>
                        {log}
                        {isLast && <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-1.5 animate-pulse" />}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 text-[10px] text-slate-500 text-center uppercase tracking-widest">
              Do not interrupt. Generating telemetry...
            </div>
          </div>
        </div>
      </main>
    );
  }

  // PRIORITY 2: INTELLIGENCE VERDICT SCREEN
  if (introStep === "verdict" && analysis) {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-6 text-slate-100 font-sans">
        <div className="w-full max-w-4xl border border-cyan-500/30 bg-slate-950/40 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.52)] relative overflow-hidden backdrop-blur-md animate-[metric-rise_450ms_ease-out_both]">
          <div className="absolute top-0 right-0 border-l border-b border-cyan-500/20 bg-cyan-950/40 px-3 py-1 text-[9px] font-mono tracking-widest text-cyan-400 uppercase">
            Intelligence Verdict
          </div>
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-cyan-400 animate-ping" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
                  SHADOWOS INTELLIGENCE DIAGNOSIS
                </h2>
              </div>
              <p className="text-xl md:text-2xl font-extrabold text-slate-100 leading-snug">
                {analysis.primary_finding.description}
              </p>
            </div>

            {/* WHY SHADOWOS FLAGGED THIS */}
            <div className="border border-cyan-500/10 bg-cyan-950/5 p-5">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase block mb-3 font-semibold">
                Why ShadowOS Flagged This
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 font-mono">
                {analysis.dashboard.ai_findings.slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-cyan-500 font-bold">✓</span>
                    <span>{f.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-cyan-500/10 py-6">
              <div className="border border-rose-500/15 bg-rose-950/15 p-4 flex flex-col justify-between min-h-[90px]">
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">
                  Revenue Exposure
                </span>
                <span className="text-2xl font-extrabold text-rose-400 mt-2 font-mono">
                  ₹{analysis.dashboard.revenue_leakage_estimate.toLocaleString()}
                </span>
              </div>
              <div className="border border-amber-500/15 bg-amber-950/15 p-4 flex flex-col justify-between min-h-[90px]">
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">
                  Manual Work
                </span>
                <span className="text-2xl font-extrabold text-amber-400 mt-2 font-mono">
                  {analysis.dashboard.time_waste_estimate} hrs/week
                </span>
              </div>
              <div className="border border-cyan-500/15 bg-cyan-950/15 p-4 flex flex-col justify-between min-h-[90px]">
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">
                  Automation Opps
                </span>
                <span className="text-2xl font-extrabold text-cyan-300 mt-2 font-mono">
                  {analysis.recommendations.length} Active
                </span>
              </div>
              <div className="border border-rose-500/15 bg-rose-950/15 p-4 flex flex-col justify-between min-h-[90px]">
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">
                  Operational Risk
                </span>
                <span className="text-2xl font-extrabold text-rose-500 mt-2 font-mono uppercase">
                  {analysis.primary_finding.severity}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIntroStep("summary")}
                className="inline-flex h-11 items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 text-xs tracking-wider uppercase transition border border-cyan-400/40 rounded-none cursor-pointer"
              >
                <span>View Operational Impact</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // PRIORITY 3: EXECUTIVE SUMMARY SCREEN
  if (introStep === "summary" && analysis) {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-6 text-slate-100 font-sans">
        <div className="w-full max-w-4xl border border-cyan-500/30 bg-slate-950/40 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.52)] relative overflow-hidden backdrop-blur-md animate-[metric-rise_450ms_ease-out_both]">
          <div className="absolute top-0 right-0 border-l border-b border-cyan-500/20 bg-cyan-950/40 px-3 py-1 text-[9px] font-mono tracking-widest text-cyan-400 uppercase">
            Operational Summary
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
                ShadowOS Intelligence Summary
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {analysis.primary_finding.description}
              </p>
            </div>

            <div className="text-[11px] text-slate-400 uppercase tracking-widest font-mono border-t border-cyan-500/10 pt-4">
              ShadowOS Detected (Dataset: {analysis.dataset_type}):
            </div>

            {/* DETECTED METRICS LIST */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-4 border-b border-cyan-500/10">
              <div className="border border-rose-500/15 bg-rose-950/10 p-4 flex flex-col justify-between min-h-[90px]">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono block leading-normal">
                  Revenue Leakage
                </span>
                <span className="text-xl font-extrabold text-rose-400 mt-2 block font-mono">
                  ₹{analysis.dashboard.revenue_leakage_estimate.toLocaleString()}
                </span>
              </div>
              <div className="border border-amber-500/15 bg-amber-950/10 p-4 flex flex-col justify-between min-h-[90px]">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono block leading-normal">
                  Manual Work
                </span>
                <span className="text-xl font-extrabold text-amber-400 mt-2 block font-mono">
                  {analysis.dashboard.time_waste_estimate} hrs/week
                </span>
              </div>
              <div className="border border-rose-500/15 bg-rose-950/10 p-4 flex flex-col justify-between min-h-[90px]">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono block leading-normal">
                  Inefficiency Score
                </span>
                <span className="text-xl font-extrabold text-rose-550 mt-2 block font-mono">
                  {analysis.dashboard.inefficiency_score}%
                </span>
              </div>
              <div className="border border-cyan-500/15 bg-cyan-950/10 p-4 flex flex-col justify-between min-h-[90px]">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono block leading-normal">
                  Automation Opps
                </span>
                <span className="text-xl font-extrabold text-cyan-300 mt-2 block font-mono">
                  {analysis.recommendations.length}
                </span>
              </div>
              <div className="border border-emerald-500/15 bg-emerald-950/10 p-4 flex flex-col justify-between min-h-[90px] col-span-2 md:col-span-1">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono block leading-normal">
                  Potential Recovery
                </span>
                <span className="text-xl font-extrabold text-emerald-400 mt-2 block font-mono">
                  ₹{analysis.executive_impact.revenue_recovery_estimate.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="inline-flex h-11 items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 text-xs tracking-wider uppercase transition border border-emerald-400/40 rounded-none cursor-pointer"
              >
                <span>Access Operational Dashboard</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // DEFAULT UPLOAD SCREEN
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-6 text-slate-100 font-sans">
      <div className="w-full max-w-6xl animate-[metric-rise_450ms_ease-out_both]">
        <div className="grid flex-1 items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-400">
                AI Operational Intelligence
              </p>
              <h2 className="max-w-xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                Upload the signal. Expose the operational drag.
              </h2>
              <p className="max-w-lg text-sm leading-6 text-slate-300">
                Feed ShadowOS a CSV or Excel export from lead ops, site visits, support logs, or broker task tracking.
                The system analyzes the signal to uncover revenue leakage, duplicate efforts, and fragmented channels.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["CSV", "Lead Sheets"],
                ["XLS", "Broker Trackers"],
                ["XLSX", "CRM Exports"],
              ].map(([label, text]) => (
                <div key={label} className="border border-cyan-500/10 bg-cyan-950/10 p-4">
                  <p className="text-xs font-semibold text-cyan-400 font-mono tracking-widest">{label}</p>
                  <p className="mt-1 text-xs text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative border border-cyan-500/15 bg-slate-950/60 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.52)] backdrop-blur-md md:p-6 overflow-hidden">
            {isAnalyzing && (
              <>
                {/* Telemetry scan line & signal grids */}
                <div className="absolute left-0 right-0 h-0.5 bg-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-[scan-line_3s_linear_infinite] pointer-events-none z-10" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:100%_6px] pointer-events-none z-10 animate-pulse" />
              </>
            )}
            {isAnalyzing ? (
              // ANALYZING SCREEN
              <div className="flex min-h-[380px] flex-col justify-between p-4 font-mono relative z-20">
                <div>
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-5">
                    <span className="text-xs font-bold text-cyan-300 tracking-wider">
                      SYSTEM INTEGRITY SCAN: RADAR
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
                      <span className="text-[10px] text-cyan-400">ACTIVE</span>
                    </span>
                  </div>

                  {/* CIRCULAR GAUGES & PROGRESS */}
                  <div className="flex items-center gap-6 my-6">
                    <div className="relative size-16 shrink-0 grid place-items-center">
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/30 animate-spin" />
                      <div className="absolute inset-2 rounded-full border border-cyan-400 animate-pulse" />
                      <span className="text-xs font-bold text-cyan-300">{analysisProgress}%</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-2 w-full bg-slate-900 border border-cyan-500/20">
                        <div
                          className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-500"
                          style={{ width: `${analysisProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                        Analyzing operational footprints
                      </span>
                    </div>
                  </div>

                  {/* LOG WINDOW */}
                  <div className="border border-cyan-500/10 bg-slate-950 p-4 h-48 overflow-y-auto space-y-2 text-xs select-none">
                    {analysisLogs.map((log, index) => {
                      const isLast = index === analysisLogs.length - 1;
                      return (
                        <div
                          key={index}
                          className={`flex items-start gap-2 transition-all duration-300 ${
                            isLast ? "text-cyan-300 font-semibold" : "text-slate-500"
                          }`}
                        >
                          <span className="text-[10px] text-cyan-600 mt-0.5">❯</span>
                          <span className={isLast ? "shadow-[0_0_8px_rgba(6,182,212,0.15)]" : ""}>
                            {log}
                            {isLast && <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-1.5 animate-pulse" />}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 text-[10px] text-slate-500 text-center uppercase tracking-widest">
                  Do not interrupt. Generating telemetry...
                </div>
              </div>
            ) : (
              // IDLE UPLOAD SCREEN
              <div>
                <div
                  className={`relative flex min-h-[320px] flex-col items-center justify-center border border-dashed p-6 text-center transition-all duration-200 sm:min-h-[350px] ${
                    isDragging
                      ? "border-cyan-400 bg-cyan-950/20 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                      : "border-cyan-500/20 bg-slate-900/10"
                  }`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    chooseFile(event.dataTransfer.files.item(0));
                  }}
                >
                  <input
                    ref={fileInputRef}
                    className="sr-only"
                    type="file"
                    accept={ACCEPT_ATTRIBUTE}
                    onChange={(event) => chooseFile(event.target.files?.item(0) ?? null)}
                  />

                  <div className="mb-5 grid size-14 place-items-center border border-cyan-500/20 bg-cyan-950/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                    {status === "uploaded" ? (
                      <CheckCircle2 className="size-6 text-emerald-400" aria-hidden="true" />
                    ) : status === "uploading" ? (
                      <Loader2 className="size-6 animate-spin text-cyan-400" aria-hidden="true" />
                    ) : status === "error" ? (
                      <XCircle className="size-6 text-rose-400" aria-hidden="true" />
                    ) : (
                      <UploadCloud className="size-6" aria-hidden="true" />
                    )}
                  </div>

                  <p className="text-lg font-semibold text-white">
                    {status === "uploaded" ? "Signal Secured" : "Drop operational data here"}
                  </p>
                  <p className="mt-2 max-w-sm text-xs leading-5 text-slate-400">{fileSummary}</p>

                  <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 border border-cyan-500/20 bg-slate-900/50 px-4 text-xs font-bold text-white transition hover:bg-slate-900 hover:border-cyan-400 rounded-none cursor-pointer"
                    >
                      <FileSpreadsheet className="size-3.5" aria-hidden="true" />
                      Browse
                    </button>
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={!selectedFile || status === "uploading"}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 bg-cyan-500 px-4 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 rounded-none border border-cyan-400/40 cursor-pointer"
                    >
                      {status === "uploading" ? (
                        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <DatabaseZap className="size-3.5" aria-hidden="true" />
                      )}
                      Upload
                    </button>
                  </div>

                  {error ? <p className="mt-4 text-xs font-medium text-rose-400">{error}</p> : null}
                  {metadata ? (
                    <div className="mt-4 w-full max-w-xs border border-emerald-500/20 bg-emerald-950/20 p-3 text-left">
                      <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Payload Verified</p>
                      <p className="mt-1 break-all text-[10px] text-slate-400 font-mono">ID: {metadata.upload_id}</p>
                      <p className="mt-0.5 text-[10px] text-slate-500 font-mono">
                        {metadata.file_type.toUpperCase()} · {(metadata.size_bytes / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-900 pt-4">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                    FastAPI Endpoint: Armed
                  </p>
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={!metadata}
                    className="inline-flex h-10 items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 text-xs tracking-wider uppercase transition disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 rounded-none border border-emerald-400/40 cursor-pointer"
                  >
                    <span>Analyze</span>
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
