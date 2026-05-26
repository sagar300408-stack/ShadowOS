from datetime import datetime, timezone

from backend.analyzers.base_analyzer import BaseOperationalAnalyzer
from backend.analyzers.bottleneck_analyzer import BottleneckAnalyzer
from backend.analyzers.duplicate_workflow_analyzer import DuplicateWorkflowAnalyzer
from backend.analyzers.follow_up_analyzer import FollowUpAnalyzer
from backend.analyzers.fragmentation_analyzer import FragmentationAnalyzer
from backend.analyzers.manual_task_analyzer import ManualTaskAnalyzer
from backend.analyzers.revenue_leakage_analyzer import RevenueLeakageAnalyzer
from backend.analyzers.time_waste_analyzer import TimeWasteAnalyzer
from backend.models.operational_intelligence import IntelligenceSignal, WorkflowRecord
from backend.schemas.analysis_schema import (
    AnalyzeRequest,
    AnalyzeResponse,
    IntelligenceFinding,
    OpportunityInsight,
    RiskInsight,
    WorkflowRecordInput,
)


class OperationalIntelligenceEngine:
    def __init__(self, analyzers: list[BaseOperationalAnalyzer] | None = None) -> None:
        self.analyzers = analyzers or [
            ManualTaskAnalyzer(),
            BottleneckAnalyzer(),
            DuplicateWorkflowAnalyzer(),
            FollowUpAnalyzer(),
            FragmentationAnalyzer(),
            RevenueLeakageAnalyzer(),
            TimeWasteAnalyzer(),
        ]

    def analyze(self, payload: AnalyzeRequest) -> AnalyzeResponse:
        records = [self._to_workflow_record(record) for record in payload.records]
        signals = self._run_analyzers(records)
        total_hours_lost = sum(signal.estimated_hours_lost for signal in signals)
        total_revenue_leakage = sum(signal.estimated_revenue_leakage for signal in signals)

        return AnalyzeResponse(
            inefficiency_score=self._calculate_inefficiency_score(signals, records),
            revenue_leakage=self._format_revenue_leakage(total_revenue_leakage, signals),
            time_waste=self._format_time_waste(total_hours_lost),
            findings=self._build_findings(signals),
            risks=self._build_risks(signals),
            opportunities=self._build_opportunities(signals),
        )

    def _run_analyzers(self, records: list[WorkflowRecord]) -> list[IntelligenceSignal]:
        signals: list[IntelligenceSignal] = []
        for analyzer in self.analyzers:
            signals.extend(analyzer.analyze(records))
        return sorted(signals, key=lambda signal: signal.score_impact, reverse=True)

    def _to_workflow_record(self, record: WorkflowRecordInput) -> WorkflowRecord:
        return WorkflowRecord(
            record_id=record.record_id,
            workflow_name=record.workflow_name,
            task_name=record.task_name,
            owner=record.owner,
            team=record.team,
            status=record.status,
            channel=record.channel,
            source_system=record.source_system,
            is_manual=record.is_manual,
            repeat_count=record.repeat_count,
            handoff_count=record.handoff_count,
            customer_value=record.customer_value,
            created_at=self._normalize_datetime(record.created_at),
            started_at=self._normalize_datetime(record.started_at),
            completed_at=self._normalize_datetime(record.completed_at),
            due_at=self._normalize_datetime(record.due_at),
            follow_up_due_at=self._normalize_datetime(record.follow_up_due_at),
            last_contact_at=self._normalize_datetime(record.last_contact_at),
            metadata=record.metadata,
        )

    def _normalize_datetime(self, value: datetime | None) -> datetime | None:
        if value is None:
            return None
        if value.tzinfo is None:
            return value
        return value.astimezone(timezone.utc).replace(tzinfo=None)

    def _calculate_inefficiency_score(
        self,
        signals: list[IntelligenceSignal],
        records: list[WorkflowRecord],
    ) -> float:
        if not records:
            return 0

        signal_score = sum(signal.score_impact for signal in signals)
        manual_density = sum(1 for record in records if record.is_manual) / len(records)
        handoff_pressure = min(sum(record.handoff_count for record in records) / max(len(records), 1), 6)
        repeat_pressure = min(sum(max(record.repeat_count - 1, 0) for record in records) / max(len(records), 1), 6)

        score = signal_score + (manual_density * 18) + (handoff_pressure * 4) + (repeat_pressure * 4)
        return round(min(score, 100), 1)

    def _format_revenue_leakage(self, leakage: float, signals: list[IntelligenceSignal]) -> str:
        if leakage <= 0:
            has_risk = any(signal.category in {"missed_follow_ups", "workflow_bottlenecks"} for signal in signals)
            if has_risk:
                return "Revenue leakage risk detected, but no customer value was provided for estimation."
            return "No measurable revenue leakage detected from the provided records."

        return f"{leakage:,.0f} estimated revenue at risk from delayed or fragmented workflows."

    def _format_time_waste(self, hours: float) -> str:
        if hours <= 0:
            return "No significant avoidable time waste detected."
        return f"{hours:.1f} hours of avoidable operational work estimated."

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
            "missed_follow_ups",
            "workflow_bottlenecks",
            "operational_fragmentation",
            "revenue_leakage_opportunities",
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
            "duplicate_workflows",
            "time_waste_opportunities",
            "operational_fragmentation",
        }

        return [
            OpportunityInsight(
                title=self._opportunity_title(signal),
                description=self._opportunity_description(signal),
                category=signal.category,
                estimated_hours_saved=round(signal.estimated_hours_lost * 0.65, 1),
            )
            for signal in signals
            if signal.category in opportunity_categories or signal.estimated_hours_lost > 0
        ]

    def _opportunity_title(self, signal: IntelligenceSignal) -> str:
        if signal.category == "repeated_manual_tasks":
            return signal.title.replace("Repeated manual task", "Automate manual task")
        if signal.category == "duplicate_workflows":
            return signal.title.replace("Duplicate workflow activity", "Consolidate duplicate workflow")
        if signal.category == "operational_fragmentation":
            return signal.title.replace("Fragmented workflow", "Unify fragmented workflow")
        return signal.title

    def _opportunity_description(self, signal: IntelligenceSignal) -> str:
        return (
            f"{signal.description} ShadowOS can convert this into a monitored automation, "
            "routing rule, or reminder workflow."
        )

