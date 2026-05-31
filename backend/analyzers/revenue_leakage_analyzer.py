from datetime import datetime
from typing import List

import pandas as pd

from backend.analyzers.base_analyzer import BaseOperationalAnalyzer
from backend.models.operational_intelligence import IntelligenceSignal
from backend.schemas.upload_schema import CanonicalRecord


class RevenueLeakageAnalyzer(BaseOperationalAnalyzer):
    category = "revenue_leakage"

    def analyze(self, records: List[CanonicalRecord]) -> List[IntelligenceSignal]:
        signals = []
        dropped_records = []
        neglected_records = []

        now = pd.Timestamp.utcnow().tz_localize(None)

        for rec in records:
            status = str(rec.status).lower() if rec.status else ""
            value = float(rec.revenue or rec.lead_value or 0.0)

            # Dropped/Lost Leads
            if status in ["dropped", "lost", "closed lost", "cancelled"]:
                if value > 0:
                    dropped_records.append((rec, value))
            
            # Neglected Open Leads (>30 days since last followup)
            elif status in ["open", "new", "in progress"]:
                ref_date = rec.last_followup or rec.updated_at or rec.created_at
                if ref_date and value > 0:
                    try:
                        dt = pd.to_datetime(ref_date)
                        if dt.tzinfo:
                            dt = dt.tz_convert(None)
                        
                        days_neglected = (now - dt).days
                        if days_neglected > 30:
                            neglected_records.append((rec, value))
                    except Exception:
                        pass

        if dropped_records:
            total_lost = sum(v for _, v in dropped_records)
            signals.append(
                IntelligenceSignal(
                    category=self.category,
                    title="Direct Revenue Loss",
                    description=f"Detected {len(dropped_records)} lost/dropped records with identifiable value.",
                    severity="high",
                    score_impact=20.0,
                    estimated_revenue_leakage=total_lost,
                    evidence=[f"Record ID: {r.record_id} (Value: {v})" for r, v in dropped_records[:3]]
                )
            )
            
        if neglected_records:
            total_at_risk = sum(v for _, v in neglected_records)
            signals.append(
                IntelligenceSignal(
                    category=self.category,
                    title="Revenue At Risk (Neglected)",
                    description=f"{len(neglected_records)} high-value records haven't had a follow-up in over 30 days.",
                    severity="high",
                    score_impact=15.0,
                    estimated_revenue_leakage=total_at_risk,
                    evidence=[f"Record ID: {r.record_id} (Value: {v})" for r, v in neglected_records[:3]]
                )
            )

        return signals
