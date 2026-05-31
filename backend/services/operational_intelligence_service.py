import pandas as pd
from datetime import datetime, timezone

from backend.analyzers.base_analyzer import BaseOperationalAnalyzer
from backend.analyzers.bottleneck_analyzer import BottleneckAnalyzer
from backend.analyzers.fragmentation_analyzer import FragmentationAnalyzer
from backend.analyzers.manual_task_analyzer import ManualTaskAnalyzer
from backend.analyzers.revenue_leakage_analyzer import RevenueLeakageAnalyzer
from backend.models.operational_intelligence import IntelligenceSignal
from backend.schemas.analysis_schema import (
    AnalyzeRequest,
    AnalyzeResponse,
    IntelligenceFinding,
    OpportunityInsight,
    RiskInsight,
)
from backend.schemas.upload_schema import CanonicalRecord


class OperationalIntelligenceEngine:
    def __init__(self, analyzers: list[BaseOperationalAnalyzer] | None = None) -> None:
        self.analyzers = analyzers or [
            ManualTaskAnalyzer(),
            BottleneckAnalyzer(),
            FragmentationAnalyzer(),
            RevenueLeakageAnalyzer(),
        ]

    def analyze(self, payload: AnalyzeRequest) -> AnalyzeResponse:
        records = payload.records
        signals = self._run_analyzers(records)

        # Aggregate Metrics
        total_hours_lost = sum(signal.estimated_hours_lost for signal in signals)
        total_revenue_leakage = sum(signal.estimated_revenue_leakage for signal in signals)
        bottleneck_count = sum(1 for signal in signals if signal.category == "workflow_bottlenecks")
        fragmentation_score = max((signal.score_impact for signal in signals if signal.category == "operational_fragmentation"), default=0.0)
        
        lead_drop_off_rate = self._calculate_drop_off_rate(records)
        avg_delay_days = self._calculate_avg_delay(records)
        
        # Calculate Automation Potential Score (0-100)
        automation_potential = min((total_hours_lost * 10) + (bottleneck_count * 5), 100)

        # Calculate Operational Health Score (0-100)
        # 100 - penalties
        penalties = (total_revenue_leakage > 0) * 15 + (bottleneck_count * 2) + fragmentation_score + (automation_potential * 0.2)
        operational_health_score = max(100 - penalties, 0)

        return AnalyzeResponse(
            operational_health_score=round(operational_health_score, 1),
            lead_drop_off_rate=round(lead_drop_off_rate, 2),
            revenue_leakage_amount=round(total_revenue_leakage, 2),
            average_follow_up_delay_days=round(avg_delay_days, 1),
            bottleneck_count=bottleneck_count,
            fragmentation_score=round(fragmentation_score, 1),
            manual_workload_hours=round(total_hours_lost, 1),
            automation_potential_score=round(automation_potential, 1),
            findings=self._build_findings(signals),
            risks=self._build_risks(signals),
            opportunities=self._build_opportunities(signals),
        )

    def _run_analyzers(self, records: list[CanonicalRecord]) -> list[IntelligenceSignal]:
        signals: list[IntelligenceSignal] = []
        for analyzer in self.analyzers:
            signals.extend(analyzer.analyze(records))
        return sorted(signals, key=lambda signal: signal.score_impact, reverse=True)

    def _calculate_drop_off_rate(self, records: list[CanonicalRecord]) -> float:
        if not records:
            return 0.0
        dropped = sum(1 for r in records if str(r.status).lower() in ["dropped", "lost", "closed lost", "cancelled"])
        return (dropped / len(records)) * 100

    def _calculate_avg_delay(self, records: list[CanonicalRecord]) -> float:
        delays = []
        now = pd.Timestamp.utcnow().tz_localize(None)
        for r in records:
            if str(r.status).lower() in ["open", "pending", "in progress"]:
                ref_date = r.last_followup or r.updated_at or r.created_at
                if ref_date:
                    try:
                        dt = pd.to_datetime(ref_date).tz_localize(None)
                        days = (now - dt).days
                        if days > 0:
                            delays.append(days)
                    except Exception:
                        pass
        if not delays:
            return 0.0
        return sum(delays) / len(delays)

    def _build_findings(self, signals: list[IntelligenceSignal]) -> list[IntelligenceFinding]:
        return [
            IntelligenceFinding(
                category=signal.category,
                title=signal.title,
                description=signal.description,
                severity=signal.severity,
                evidence=signal.evidence,
            )
            for signal in signals
        ]

    def _build_risks(self, signals: list[IntelligenceSignal]) -> list[RiskInsight]:
        risk_categories = {
            "workflow_bottlenecks",
            "revenue_leakage",
        }

        return [
            RiskInsight(
                title=signal.title,
                description=signal.description,
                severity=signal.severity,
                estimated_revenue_leakage=round(signal.estimated_revenue_leakage, 2),
            )
            for signal in signals
            if signal.category in risk_categories or signal.severity in {"critical", "high"}
        ]

    def _build_opportunities(self, signals: list[IntelligenceSignal]) -> list[OpportunityInsight]:
        opportunity_categories = {
            "repeated_manual_tasks",
            "operational_fragmentation",
        }

        return [
            OpportunityInsight(
                title=signal.title,
                description=signal.description,
                category=signal.category,
                estimated_hours_saved=round(signal.estimated_hours_lost * 0.65, 1),
            )
            for signal in signals
            if signal.category in opportunity_categories or signal.estimated_hours_lost > 0
        ]
