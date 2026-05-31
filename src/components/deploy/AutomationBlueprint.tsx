"use client";

import { useAnalysis } from "@/lib/AnalysisContext";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ListTodo,
  Target,
  Zap,
} from "lucide-react";

export function AutomationBlueprint() {
  const router = useRouter();
  const { analysis } = useAnalysis();

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-slate-500 font-mono text-sm animate-pulse">
          Awaiting Operational Intelligence Data...
        </div>
      </div>
    );
  }

  const { primary_finding, recommendations, executive_impact, confidence_score } = analysis;

  // Render priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "text-rose-400 bg-rose-400/10 border-rose-400/30";
      case "high":
        return "text-orange-400 bg-orange-400/10 border-orange-400/30";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "low":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/30";
    }
  };

  // Generate Executive Summary
  const recommendationTitles = recommendations?.map(r => r.title) || [];
  const formattedRecommendations = recommendationTitles.slice(0, 2).join(" and ");
  const executiveSummary = `ShadowOS recommends prioritizing ${formattedRecommendations || "key automations"} to address ${
    primary_finding?.category?.replace(/_/g, ' ') || 'workflow inefficiencies'
  } and recover high-value opportunities.`;

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER */}
      <div className="border-b border-cyan-500/10 pb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Operational Transformation Blueprint</h2>
          <p className="mt-1.5 text-xs text-slate-400 max-w-3xl leading-relaxed">
            Executive Automation Recommendation Center based on detected workflow issues.
          </p>
        </div>
        <button
          onClick={() => router.push("/impact")}
          className="inline-flex h-9 items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 text-xs tracking-wider uppercase transition rounded-none cursor-pointer"
        >
          <span>View Impact Report</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>

      {/* SECTION 1: Summary */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 border border-cyan-500/20 bg-slate-950/40 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 border-l border-b border-cyan-500/20 bg-slate-950/85 px-3 py-1 text-[9px] font-mono tracking-widest text-cyan-400 uppercase">
            Primary Finding
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 mt-2">
            {primary_finding?.title || "No Primary Finding"}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {primary_finding?.description}
          </p>
        </div>
        
        <div className="border border-cyan-500/20 bg-slate-950/40 p-5 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 border-l border-b border-cyan-500/20 bg-slate-950/85 px-2 py-0.5 text-[8px] font-mono tracking-widest text-cyan-400 uppercase">
            Severity
          </div>
          <span className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-1">Issue Severity</span>
          <span className={`text-xl font-bold uppercase ${
            primary_finding?.severity === 'high' || primary_finding?.severity === 'critical' ? 'text-rose-400' : 'text-yellow-400'
          }`}>
            {primary_finding?.severity || "Unknown"}
          </span>
        </div>

        <div className="border border-cyan-500/20 bg-slate-950/40 p-5 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 border-l border-b border-cyan-500/20 bg-slate-950/85 px-2 py-0.5 text-[8px] font-mono tracking-widest text-cyan-400 uppercase">
            Confidence
          </div>
          <span className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-1">AI Confidence</span>
          <span className="text-xl font-bold text-cyan-400">
            {Math.round((confidence_score || 0) * 100)}%
          </span>
        </div>
      </section>

      {/* SECTION 4: Expected Business Outcomes */}
      <section className="border border-emerald-500/20 bg-emerald-950/10 p-5 shadow-[0_10px_30px_rgba(16,185,129,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 border-l border-b border-emerald-500/20 bg-emerald-950/40 px-3 py-1 text-[9px] font-mono tracking-widest text-emerald-400 uppercase">
          Expected Business Outcomes
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-2">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono block">Revenue Recovery</span>
            <span className="text-xl font-bold text-white block mt-1">₹{executive_impact?.revenue_recovery_estimate?.toLocaleString() || 0}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono block">Manual Work Red.</span>
            <span className="text-xl font-bold text-white block mt-1">{executive_impact?.manual_work_reduction_percent || 0}%</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono block">Workflow Eff.</span>
            <span className="text-xl font-bold text-white block mt-1">+{executive_impact?.workflow_efficiency_increase || 0}%</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono block">Lead Recovery</span>
            <span className="text-xl font-bold text-white block mt-1">+{executive_impact?.lead_recovery_conversion_increase || 0}%</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono block">Ops Risk Reduction</span>
            <span className="text-xl font-bold text-white block mt-1">+{executive_impact?.operational_risk_reduction || 0}%</span>
          </div>
        </div>
      </section>

      {/* SECTION 5: Executive Recommendation */}
      <section className="border-l-4 border-cyan-400 bg-cyan-950/20 p-5 text-sm leading-relaxed text-cyan-50">
        <h4 className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Target className="size-3.5" />
          Executive Recommendation
        </h4>
        {executiveSummary}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* SECTION 2: Recommended Automation Initiatives */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-slate-800 pb-2">
            <Zap className="size-4 text-cyan-400" />
            Automation Initiatives
          </h3>
          <div className="space-y-4">
            {recommendations?.map((rec: any, idx: number) => (
              <div key={idx} className="border border-slate-800 bg-slate-950/50 p-4 transition-colors hover:border-cyan-500/30">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border rounded ${getPriorityColor(rec.priority)}`}>
                    {rec.priority || "Unknown"}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-0.5">Problem Solved</span>
                    <p className="text-xs text-slate-300">{rec.current_problem || rec.description || rec.solves?.join(", ") || "Operational inefficiency"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/50">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-0.5">Expected Impact</span>
                      <p className="text-xs text-emerald-400 font-semibold">{rec.expected_impact || rec.estimated_business_impact || "Improves efficiency"}</p>
                    </div>
                    {rec.potential_recovery_value !== undefined && rec.potential_recovery_value > 0 && (
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-0.5">Recovery Value</span>
                        <p className="text-xs text-emerald-400 font-semibold">₹{rec.potential_recovery_value.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Implementation Roadmap */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-slate-800 pb-2">
            <ListTodo className="size-4 text-cyan-400" />
            Implementation Roadmap
          </h3>
          <div className="relative border-l border-slate-800 ml-3 pl-6 space-y-8 pt-4 pb-4">
            {recommendations?.map((rec: any, idx: number) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[30px] top-0 bg-slate-950 border border-cyan-500 rounded-full size-4 flex items-center justify-center">
                  <span className="size-1.5 bg-cyan-400 rounded-full animate-pulse" />
                </div>
                <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">
                  Phase {idx + 1}
                </h4>
                <p className="text-sm font-bold text-white">{rec.title}</p>
                <p className="text-xs text-slate-400 mt-1">{rec.proposed_automation || `Implement ${rec.title.toLowerCase()} to address operational drag.`}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
