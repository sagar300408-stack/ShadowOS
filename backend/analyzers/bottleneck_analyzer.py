from statistics import mean

from backend.analyzers.base_analyzer import BaseOperationalAnalyzer
from backend.models.operational_intelligence import IntelligenceSignal, WorkflowRecord


class BottleneckAnalyzer(BaseOperationalAnalyzer):
    category = "workflow_bottlenecks"

    def analyze(self, records: list[WorkflowRecord]) -> list[IntelligenceSignal]:
        grouped: dict[str, list[float]] = {}

        for record in records:
            if record.started_at and record.completed_at:
                duration_hours = (record.completed_at - record.started_at).total_seconds() / 3600
            elif record.created_at and record.completed_at:
                duration_hours = (record.completed_at - record.created_at).total_seconds() / 3600
            else:
                duration_hours = 0

            if duration_hours > 0:
                grouped.setdefault(record.workflow_name, []).append(duration_hours)

        signals: list[IntelligenceSignal] = []
        for workflow_name, durations in grouped.items():
            if len(durations) < 2:
                continue

            average_duration = mean(durations)
            if average_duration < 8:
                continue

            signals.append(
                IntelligenceSignal(
                    category=self.category,
                    title=f"Slow workflow stage: {workflow_name}",
                    description=(
                        f"Average completion time is {average_duration:.1f} hours, "
                        "which suggests a process bottleneck or stalled handoff."
                    ),
                    severity="critical" if average_duration >= 24 else "high",
                    score_impact=min(22, average_duration / 2),
                    evidence=[f"{len(durations)} records averaged"],
                    estimated_hours_lost=max(average_duration - 4, 0) * len(durations),
                )
            )

        return signals

