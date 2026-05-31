from datetime import datetime
from typing import List

import pandas as pd

from backend.analyzers.base_analyzer import BaseOperationalAnalyzer
from backend.models.operational_intelligence import IntelligenceSignal
from backend.schemas.upload_schema import CanonicalRecord


class BottleneckAnalyzer(BaseOperationalAnalyzer):
    category = "workflow_bottlenecks"

    def analyze(self, records: List[CanonicalRecord]) -> List[IntelligenceSignal]:
        signals = []
        stuck_records = []
        unassigned_records = []

        now = pd.Timestamp.utcnow().tz_localize(None)

        for rec in records:
            status = str(rec.status).lower() if rec.status else ""
            if status in ["open", "pending", "in progress", "review", "new"]:
                if not rec.owner and not rec.assigned_to:
                    unassigned_records.append(rec)
                
                ref_date = rec.updated_at or rec.created_at
                if ref_date:
                    try:
                        dt = pd.to_datetime(ref_date)
                        if dt.tzinfo:
                            dt = dt.tz_convert(None)
                        
                        days_stuck = (now - dt).days
                        if days_stuck > 7:
                            stuck_records.append(rec)
                    except Exception:
                        pass
        
        if stuck_records:
            signals.append(
                IntelligenceSignal(
                    category=self.category,
                    title="Aged Workflow Bottlenecks Detected",
                    description=f"{len(stuck_records)} records have been stuck in an open state for over 7 days.",
                    severity="high",
                    score_impact=15.0,
                    evidence=[f"Record ID: {r.record_id}" for r in stuck_records[:3]]
                )
            )

        if unassigned_records:
            signals.append(
                IntelligenceSignal(
                    category=self.category,
                    title="Unassigned Work Items",
                    description=f"{len(unassigned_records)} records are open but lack an assigned owner.",
                    severity="medium",
                    score_impact=10.0,
                    evidence=[f"Record ID: {r.record_id}" for r in unassigned_records[:3]]
                )
            )

        return signals
