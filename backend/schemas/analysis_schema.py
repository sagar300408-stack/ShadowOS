from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


class AnalysisDepth(str, Enum):
    quick = "quick"
    standard = "standard"
    deep = "deep"


class AnalyzeRequest(BaseModel):
    upload_id: UUID
    industry: str = Field(default="Real Estate", examples=["Real Estate"])
    analysis_depth: AnalysisDepth = AnalysisDepth.standard


class BottleneckFinding(BaseModel):
    area: str = Field(examples=["Lead follow-up"])
    description: str
    severity: str = Field(examples=["high"])
    estimated_delay_hours: float = Field(ge=0)


class AnalyzeResponse(BaseModel):
    analysis_id: UUID
    upload_id: UUID
    status: str = Field(default="completed")
    summary: str
    bottlenecks: list[BottleneckFinding]
    detected_workflows: list[str]
    completed_at: datetime = Field(default_factory=datetime.utcnow)

