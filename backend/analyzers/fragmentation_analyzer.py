from collections import defaultdict

from backend.analyzers.base_analyzer import BaseOperationalAnalyzer
from backend.models.operational_intelligence import IntelligenceSignal, WorkflowRecord


class FragmentationAnalyzer(BaseOperationalAnalyzer):
    category = "operational_fragmentation"

    def analyze(self, records: list[WorkflowRecord]) -> list[IntelligenceSignal]:
        workflow_channels: dict[str, set[str]] = defaultdict(set)
        workflow_systems: dict[str, set[str]] = defaultdict(set)
        workflow_handoffs: dict[str, int] = defaultdict(int)

        for record in records:
            key = record.workflow_name
            if record.channel:
                workflow_channels[key].add(record.channel)
            if record.source_system:
                workflow_systems[key].add(record.source_system)
            workflow_handoffs[key] += record.handoff_count

        signals: list[IntelligenceSignal] = []
        for workflow_name in {record.workflow_name for record in records}:
            channel_count = len(workflow_channels[workflow_name])
            system_count = len(workflow_systems[workflow_name])
            handoffs = workflow_handoffs[workflow_name]
            fragmentation_score = channel_count + system_count + handoffs

            if fragmentation_score < 6:
                continue

            signals.append(
                IntelligenceSignal(
                    category=self.category,
                    title=f"Fragmented workflow: {workflow_name}",
                    description=(
                        f"{workflow_name} spans {channel_count} channels, {system_count} systems, "
                        f"and {handoffs} handoffs. This increases delay and ownership ambiguity."
                    ),
                    severity="high" if fragmentation_score >= 10 else "medium",
                    score_impact=min(18, fragmentation_score * 1.5),
                    evidence=[
                        f"channels={channel_count}",
                        f"systems={system_count}",
                        f"handoffs={handoffs}",
                    ],
                    estimated_hours_lost=handoffs * 0.35,
                )
            )

        return signals

