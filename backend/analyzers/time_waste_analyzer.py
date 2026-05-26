from backend.analyzers.base_analyzer import BaseOperationalAnalyzer
from backend.models.operational_intelligence import IntelligenceSignal, WorkflowRecord


class TimeWasteAnalyzer(BaseOperationalAnalyzer):
    category = "time_waste_opportunities"

    def analyze(self, records: list[WorkflowRecord]) -> list[IntelligenceSignal]:
        repeated_minutes = sum(max(record.repeat_count - 1, 0) * 15 for record in records)
        handoff_minutes = sum(record.handoff_count * 12 for record in records)
        manual_minutes = sum(10 for record in records if record.is_manual)
        total_hours = (repeated_minutes + handoff_minutes + manual_minutes) / 60

        if total_hours < 2:
            return []

        return [
            IntelligenceSignal(
                category=self.category,
                title="Recoverable time waste across manual operations",
                description=(
                    f"Rules estimate {total_hours:.1f} hours of avoidable effort from repeats, "
                    "handoffs, and manual status work."
                ),
                severity="high" if total_hours >= 20 else "medium",
                score_impact=min(20, total_hours),
                evidence=[
                    f"repeat_minutes={repeated_minutes}",
                    f"handoff_minutes={handoff_minutes}",
                    f"manual_minutes={manual_minutes}",
                ],
                estimated_hours_lost=total_hours,
            )
        ]

