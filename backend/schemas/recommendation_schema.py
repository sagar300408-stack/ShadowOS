from enum import Enum

from pydantic import BaseModel, Field


class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class AutomationOpportunity(BaseModel):
    title: str
    current_problem: str
    proposed_automation: str
    priority: Priority
    estimated_hours_saved_per_week: float = Field(ge=0)
    implementation_effort: str = Field(examples=["low", "medium", "high"])


class RiskAlert(BaseModel):
    title: str
    description: str
    severity: Priority


class EfficiencyImprovement(BaseModel):
    area: str
    expected_improvement_percent: float = Field(ge=0, le=100)
    explanation: str


class RecommendationsResponse(BaseModel):
    automation_opportunities: list[AutomationOpportunity]
    risk_alerts: list[RiskAlert]
    efficiency_improvements: list[EfficiencyImprovement]

