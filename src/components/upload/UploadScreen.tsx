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

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(20,184,166,0.22),transparent_28%),radial-gradient(circle_at_85%_8%,rgba(59,130,246,0.2),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center border border-cyan-300/35 bg-cyan-300/10 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
              <Radar className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">ShadowOS</p>
              <h1 className="text-lg font-semibold text-white sm:text-xl">Operational Intelligence Upload</h1>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-sm text-slate-300 sm:flex">
            <Activity className="size-4 text-emerald-300" aria-hidden="true" />
            Analysis pipeline armed
          </div>
        </header>

        <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-12">
          <div className="order-2 space-y-6 lg:order-1">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.32em] text-emerald-300">Real estate workflows</p>
              <h2 className="max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Upload the signal. Expose the operational drag.
              </h2>
              <p className="max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                Feed ShadowOS a CSV or Excel export from lead ops, site visits, support logs, or broker task tracking.
                The backend validates the file before sending you into the intelligence dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["CSV", "Lead sheets"],
                ["XLS", "Ops trackers"],
                ["XLSX", "CRM exports"],
              ].map(([label, text]) => (
                <div key={label} className="border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-semibold text-cyan-100">{label}</p>
                  <p className="mt-1 text-sm text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 border border-white/[0.12] bg-slate-950/[0.72] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur md:p-6 lg:order-2">
            <div
              className={`relative flex min-h-[320px] flex-col items-center justify-center border border-dashed p-6 text-center transition sm:min-h-[380px] ${
                isDragging
                  ? "border-cyan-200 bg-cyan-300/10 shadow-[0_0_38px_rgba(34,211,238,0.16)]"
                  : "border-cyan-200/28 bg-white/[0.03]"
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

              <div className="mb-5 grid size-16 place-items-center border border-cyan-200/30 bg-cyan-300/10 text-cyan-100">
                {status === "uploaded" ? (
                  <CheckCircle2 className="size-8 text-emerald-300" aria-hidden="true" />
                ) : status === "uploading" ? (
                  <Loader2 className="size-8 animate-spin text-cyan-200" aria-hidden="true" />
                ) : status === "error" ? (
                  <XCircle className="size-8 text-rose-300" aria-hidden="true" />
                ) : (
                  <UploadCloud className="size-8" aria-hidden="true" />
                )}
              </div>

              <p className="text-xl font-semibold text-white sm:text-2xl">
                {status === "uploaded" ? "Workflow file secured" : "Drop workflow data here"}
              </p>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">{fileSummary}</p>

              <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 border border-white/[0.12] bg-white/[0.08] px-4 text-sm font-semibold text-white transition hover:border-cyan-200/50 hover:bg-cyan-200/10"
                >
                  <FileSpreadsheet className="size-4" aria-hidden="true" />
                  Select file
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!selectedFile || status === "uploading"}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 bg-cyan-200 px-4 text-sm font-bold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                >
                  {status === "uploading" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <DatabaseZap className="size-4" aria-hidden="true" />}
                  Upload
                </button>
              </div>

              {error ? <p className="mt-5 text-sm font-medium text-rose-300">{error}</p> : null}
              {metadata ? (
                <div className="mt-5 w-full max-w-md border border-emerald-300/20 bg-emerald-300/[0.08] p-4 text-left">
                  <p className="text-sm font-semibold text-emerald-200">Upload validated</p>
                  <p className="mt-1 break-all text-xs text-slate-300">ID: {metadata.upload_id}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {metadata.file_type.toUpperCase()} · {(metadata.size_bytes / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : null}
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">
                Files are sent directly to the ShadowOS FastAPI upload endpoint.
              </p>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!metadata}
                className="inline-flex h-12 items-center justify-center gap-2 bg-emerald-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                Analyze
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
