from collections import Counter

from backend.analyzers.base_analyzer import BaseOperationalAnalyzer
from backend.models.operational_intelligence import IntelligenceSignal, WorkflowRecord


class ManualTaskAnalyzer(BaseOperationalAnalyzer):
    category = "repeated_manual_tasks"

    def analyze(self, records: list[WorkflowRecord]) -> list[IntelligenceSignal]:
        manual_records = [record for record in records if record.is_manual or record.repeat_count > 2]
        task_counts = Counter(record.task_name.lower().strip() for record in manual_records)
        signals: list[IntelligenceSignal] = []

        for task_name, count in task_counts.items():
            if count < 3:
                continue

            affected = [record for record in manual_records if record.task_name.lower().strip() == task_name]
            hours_lost = sum(max(record.repeat_count, 1) for record in affected) * 0.25

            signals.append(
                IntelligenceSignal(
                    category=self.category,
                    title=f"Repeated manual task: {task_name.title()}",
                    description=(
                        f"{count} records show repeated manual execution of '{task_name}', "
                        "indicating a strong automation candidate."
                    ),
                    severity="high" if count >= 8 else "medium",
                    score_impact=min(18, count * 1.8),
                    evidence=[record.record_id for record in affected[:5]],
                    estimated_hours_lost=hours_lost,
                )
            )

        return signals

