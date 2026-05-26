from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


class AnalysisDepth(str, Enum):
    quick = "quick"
    standard = "standard"
    deep = "deep"


class WorkflowRecordInput(BaseModel):
    record_id: str = Field(examples=["lead-1042"])
    workflow_name: str = Field(examples=["Lead intake"])
    task_name: str = Field(examples=["Broker follow-up"])
    owner: str | None = Field(default=None, examples=["Aisha"])
    team: str | None = Field(default=None, examples=["Sales"])
    status: str | None = Field(default=None, examples=["open"])
    channel: str | None = Field(default=None, examples=["WhatsApp"])
    source_system: str | None = Field(default=None, examples=["CRM"])
    is_manual: bool = False
    repeat_count: int = Field(default=1, ge=0)
    handoff_count: int = Field(default=0, ge=0)
    customer_value: float = Field(default=0, ge=0)
    created_at: datetime | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None
    due_at: datetime | None = None
    follow_up_due_at: datetime | None = None
    last_contact_at: datetime | None = None
    metadata: dict[str, str | int | float | bool] = Field(default_factory=dict)


class AnalyzeRequest(BaseModel):
    upload_id: UUID
    industry: str = Field(default="Real Estate", examples=["Real Estate"])
    analysis_depth: AnalysisDepth = AnalysisDepth.standard
    records: list[WorkflowRecordInput] = Field(
        min_length=1,
        description="Structured business workflow records extracted from an uploaded file.",
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
    inefficiency_score: float = Field(ge=0, le=100)
    revenue_leakage: str
    time_waste: str
    findings: list[IntelligenceFinding]
    risks: list[RiskInsight]
    opportunities: list[OpportunityInsight]
