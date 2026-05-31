from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field
from backend.schemas.upload_schema import CanonicalRecord


class AnalysisDepth(str, Enum):
    quick = "quick"
    standard = "standard"
    deep = "deep"


class AnalyzeRequest(BaseModel):
    upload_id: UUID
    industry: str = Field(default="Real Estate", examples=["Real Estate"])
    analysis_depth: AnalysisDepth = AnalysisDepth.standard
    records: list[CanonicalRecord] = Field(
        min_length=1,
        description="Structured canonical workflow records extracted from an uploaded file.",
    )


class IntelligenceFinding(BaseModel):
    category: str = Field(examples=["missed_follow_ups"])
    title: str = Field(examples=["Missed or delayed customer follow-ups"])
    description: str
    severity: str = Field(examples=["high"])
    evidence: list[str] = Field(default_factory=list)


class RiskInsight(BaseModel):
    title: str
    description: str
    severity: str
    estimated_revenue_leakage: float = Field(default=0, ge=0)


class OpportunityInsight(BaseModel):
    title: str
    description: str
    category: str
    estimated_hours_saved: float = Field(default=0, ge=0)


class AnalyzeResponse(BaseModel):
    operational_health_score: float = Field(ge=0, le=100)
    lead_drop_off_rate: float
    revenue_leakage_amount: float
    average_follow_up_delay_days: float
    bottleneck_count: int
    fragmentation_score: float
    manual_workload_hours: float
    automation_potential_score: float

    # Legacy aggregations for UI compatibility if needed, but we can replace or keep them
    findings: list[IntelligenceFinding]
    risks: list[RiskInsight]
    opportunities: list[OpportunityInsight]
