from typing import List

from backend.analyzers.base_analyzer import BaseOperationalAnalyzer
from backend.models.operational_intelligence import IntelligenceSignal
from backend.schemas.upload_schema import CanonicalRecord


class ManualTaskAnalyzer(BaseOperationalAnalyzer):
    category = "repeated_manual_tasks"

    def analyze(self, records: List[CanonicalRecord]) -> List[IntelligenceSignal]:
        signals = []
        manual_records = []

        manual_keywords = ["manual", "data entry", "upload", "copy", "paste", "check", "verify", "spreadsheet", "excel"]

        for rec in records:
            is_manual = False
            
            # Check empty system or generic system
            sys = str(rec.system).lower() if rec.system else ""
            if not sys or "excel" in sys or "spreadsheet" in sys:
                is_manual = True

            # Check task type and notes for keywords
            combined_text = f"{rec.task_type or ''} {rec.notes or ''}".lower()
            if any(keyword in combined_text for keyword in manual_keywords):
                is_manual = True
            
            if is_manual:
                manual_records.append(rec)

        if manual_records:
            # Estimate 0.5 hours lost per manual task
            hours_lost = len(manual_records) * 0.5
            signals.append(
                IntelligenceSignal(
                    category=self.category,
                    title="High Volume of Manual Work",
                    description=f"Identified {len(manual_records)} records indicating manual data entry or verification.",
                    severity="medium",
                    score_impact=10.0,
                    estimated_hours_lost=hours_lost,
                    evidence=[f"Record ID: {r.record_id}" for r in manual_records[:3]]
                )
            )

        return signals
