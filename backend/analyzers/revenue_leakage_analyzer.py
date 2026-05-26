from backend.analyzers.base_analyzer import BaseOperationalAnalyzer
from backend.models.operational_intelligence import IntelligenceSignal, WorkflowRecord


class RevenueLeakageAnalyzer(BaseOperationalAnalyzer):
    category = "revenue_leakage_opportunities"

    def analyze(self, records: list[WorkflowRecord]) -> list[IntelligenceSignal]:
        leakage_records: list[WorkflowRecord] = []

        for record in records:
            status = (record.status or "").lower()
            workflow_name = record.workflow_name.lower()
            is_revenue_workflow = any(keyword in workflow_name for keyword in ["lead", "deal", "buyer", "site visit", "booking"])
            has_delay = record.handoff_count >= 3 or record.repeat_count >= 3
            is_open = status not in {"closed", "completed", "won"}

            if is_revenue_workflow and is_open and has_delay and record.customer_value > 0:
                leakage_records.append(record)

        if not leakage_records:
            return []

        estimated_leakage = sum(record.customer_value for record in leakage_records) * 0.12

        return [
            IntelligenceSignal(
                category=self.category,
                title="Revenue leakage from delayed revenue workflows",
                description=(
                    f"{len(leakage_records)} revenue-linked records show repeated delays, "
                    "handoffs, or unresolved status."
                ),
                severity="critical" if estimated_leakage >= 100000 else "high",
                score_impact=min(24, len(leakage_records) * 5),
                evidence=[record.record_id for record in leakage_records[:8]],
                estimated_revenue_leakage=estimated_leakage,
            )
        ]

