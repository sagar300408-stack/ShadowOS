"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { fetchUnifiedAnalysis, type UnifiedAnalysisResult } from "./shadowos-api";

interface AnalysisState {
  uploadId: string | null;
  analysis: UnifiedAnalysisResult | null;
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
}

interface AnalysisContextType extends AnalysisState {
  loadAnalysis: (uploadId: string) => Promise<void>;
  resetAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | null>(null);
const STORAGE_KEY = "shadowos_analysis_state";

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AnalysisState>({
    uploadId: null,
    analysis: null,
    status: "idle",
    error: null,
  });

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.analysis) {
          setState({
            uploadId: parsed.uploadId,
            analysis: parsed.analysis,
            status: "ready",
            error: null,
          });
        }
      }
    } catch (e) {
      console.error("Failed to restore analysis state:", e);
    }
  }, []);

  const loadAnalysis = async (uploadId: string) => {
    setState((prev) => ({ ...prev, status: "loading", error: null }));
    try {
      const analysis = await fetchUnifiedAnalysis(uploadId);
      const newState: AnalysisState = {
        uploadId,
        analysis,
        status: "ready",
        error: null,
      };
      setState(newState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: err instanceof Error ? err.message : "Failed to load analysis telemetry.",
      }));
    }
  };

  const resetAnalysis = () => {
    setState({
      uploadId: null,
      analysis: null,
      status: "idle",
      error: null,
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AnalysisContext.Provider value={{ ...state, loadAnalysis, resetAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
