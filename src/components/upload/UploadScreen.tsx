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
} from "lucide-react";
import { uploadWorkflowFile, type UploadMetadata } from "@/lib/shadowos-api";

const ACCEPTED_EXTENSIONS = [".csv", ".xls", ".xlsx"];
const ACCEPT_ATTRIBUTE = ".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

type UploadState = "idle" | "ready" | "uploading" | "uploaded" | "error";

export function UploadScreen() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<UploadMetadata | null>(null);
  const [status, setStatus] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Analysis simulation states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);

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
      setStatus("uploaded");
    } catch (uploadError) {
      setMetadata(null);
      setStatus("error");
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    }
  };

  const handleAnalyze = () => {
    if (!metadata) {
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisLogs([]);

    const logMessages = [
      { text: "Scanning workflow signals...", progress: 15 },
      { text: "Analyzing lead activity...", progress: 30 },
      { text: "Detecting fragmented systems...", progress: 45 },
      { text: "Calculating operational drag...", progress: 60 },
      { text: "Estimating revenue exposure...", progress: 75 },
      { text: "Identifying automation opportunities...", progress: 90 },
      { text: "Generating intelligence profile...", progress: 100 }
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logMessages.length) {
        const nextLog = logMessages[currentLogIndex];
        setAnalysisLogs((prev) => [...prev, nextLog.text]);
        setAnalysisProgress(nextLog.progress);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          router.push("/dashboard");
        }, 900);
      }
    }, 600);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-6 text-slate-100">
      <div className="w-full max-w-6xl">
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

