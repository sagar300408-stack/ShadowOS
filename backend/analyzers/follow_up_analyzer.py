from datetime import datetime, timezone

from backend.analyzers.base_analyzer import BaseOperationalAnalyzer
from backend.models.operational_intelligence import IntelligenceSignal, WorkflowRecord


class FollowUpAnalyzer(BaseOperationalAnalyzer):
    category = "missed_follow_ups"

    def analyze(self, records: list[WorkflowRecord]) -> list[IntelligenceSignal]:
        now = datetime.now(timezone.utc).replace(tzinfo=None)
        missed = []

        for record in records:
            status = (record.status or "").lower()
            if status in {"closed", "completed", "won", "lost"}:
                continue

            if record.follow_up_due_at and record.follow_up_due_at < now:
                missed.append(record)
                continue

            if record.last_contact_at:
                idle_hours = (now - record.last_contact_at).total_seconds() / 3600
                if idle_hours > 48 and any(keyword in record.workflow_name.lower() for keyword in ["lead", "buyer", "site visit"]):
                    missed.append(record)

        if not missed:
            return []

        potential_leakage = sum(record.customer_value for record in missed) * 0.08

        return [
            IntelligenceSignal(
                category=self.category,
                title="Missed or delayed customer follow-ups",
                description=(
                    f"{len(missed)} active records appear overdue for follow-up, "
                    "creating conversion and customer experience risk."
                ),
                severity="critical" if len(missed) >= 5 else "high",
                score_impact=min(24, len(missed) * 4),
                evidence=[record.record_id for record in missed[:8]],
                estimated_hours_lost=len(missed) * 0.5,
                estimated_revenue_leakage=potential_leakage,
            )
        ]
