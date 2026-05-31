from enum import Enum
from pydantic import BaseModel, Field

from backend.schemas.analysis_schema import AnalyzeResponse


class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class RecommendationRequest(BaseModel):
    intelligence_report: AnalyzeResponse = Field(
        description="The operational intelligence report outputted by the Analyze Engine."
    )


class AutomationRecommendation(BaseModel):
    # Unified fields
    id: str = Field(default="")
    title: str = Field(examples=["Lead Follow-Up Agent"])
    type: str = Field(default="unknown", examples=["crm_sync"])
    description: str = Field(default="")
    solves: list[str] = Field(default_factory=list)
    priority: Priority = Field(examples=["high"])
    expected_impact: str = Field(default="")
    
    # Original recommendation fields
    current_problem: str | None = Field(default=None, examples=["High follow-up delay causing revenue leakage."])
    proposed_automation: str | None = Field(default=None, examples=["Trigger scheduled WhatsApp reminders."])
    confidence_score: float | None = Field(default=None, ge=0, le=100, description="Confidence in this recommendation based on heuristic signals.")
    estimated_business_impact: str | None = Field(default=None, examples=["High: Recovers lost leads and reduces drop-off."])
    implementation_complexity: str | None = Field(default=None, examples=["low", "medium", "high"])
    potential_recovery_value: float | None = Field(default=None, ge=0, description="Estimated dollar value recovered per month (revenue or saved labor costs).")


class RecommendationsResponse(BaseModel):
    automation_recommendations: list[AutomationRecommendation]
