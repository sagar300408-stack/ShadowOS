from typing import List

from backend.analyzers.base_analyzer import BaseOperationalAnalyzer
from backend.models.operational_intelligence import IntelligenceSignal
from backend.schemas.upload_schema import CanonicalRecord


class FragmentationAnalyzer(BaseOperationalAnalyzer):
    category = "operational_fragmentation"

    def analyze(self, records: List[CanonicalRecord]) -> List[IntelligenceSignal]:
        signals = []
        systems_used = set()
        sources_used = set()

        for rec in records:
            if rec.system:
                systems_used.add(str(rec.system).lower())
            if rec.source:
                sources_used.add(str(rec.source).lower())

        num_systems = len(systems_used)
        num_sources = len(sources_used)

        fragmentation_score = 0.0
        # A simple heuristic: using more than 2 distinct systems for a single workflow type indicates fragmentation.
        if num_systems > 2:
            fragmentation_score += (num_systems - 2) * 10
            signals.append(
                IntelligenceSignal(
                    category=self.category,
                    title="High System Fragmentation",
                    description=f"Workflow is split across {num_systems} unique systems, increasing context switching.",
                    severity="medium",
                    score_impact=min(fragmentation_score, 20.0),
                    evidence=[f"Identified systems: {', '.join(list(systems_used)[:5])}"]
                )
            )

        if num_sources > 5:
            signals.append(
                IntelligenceSignal(
                    category=self.category,
                    title="Fragmented Intake Channels",
                    description=f"Records originate from {num_sources} distinct sources, suggesting a lack of standardized intake.",
                    severity="low",
                    score_impact=5.0,
                    evidence=[f"Top sources: {', '.join(list(sources_used)[:5])}"]
                )
            )

        return signals
