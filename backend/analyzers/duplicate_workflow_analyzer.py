from collections import defaultdict

from backend.analyzers.base_analyzer import BaseOperationalAnalyzer
from backend.models.operational_intelligence import IntelligenceSignal, WorkflowRecord


class DuplicateWorkflowAnalyzer(BaseOperationalAnalyzer):
    category = "duplicate_workflows"

    def analyze(self, records: list[WorkflowRecord]) -> list[IntelligenceSignal]:
        signatures: dict[tuple[str, str, str], list[WorkflowRecord]] = defaultdict(list)

        for record in records:
            owner_key = (record.owner or record.team or "unassigned").lower()
            signatures[(record.workflow_name.lower(), record.task_name.lower(), owner_key)].append(record)

        signals: list[IntelligenceSignal] = []
        for signature, duplicates in signatures.items():
            if len(duplicates) < 3:
                continue

            workflow_name, task_name, owner = signature
            signals.append(
                IntelligenceSignal(
                    category=self.category,
                    title=f"Duplicate workflow activity: {task_name.title()}",
                    description=(
                        f"The same task appears {len(duplicates)} times in {workflow_name.title()} "
                        f"for {owner}, suggesting duplicate tracking or rework."
                    ),
                    severity="medium",
                    score_impact=min(14, len(duplicates) * 1.4),
                    evidence=[record.record_id for record in duplicates[:5]],
                    estimated_hours_lost=len(duplicates) * 0.4,
                )
            )

        return signals

