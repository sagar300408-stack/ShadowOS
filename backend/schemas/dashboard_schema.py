from pydantic import BaseModel, Field


class DashboardAutomationOpportunity(BaseModel):
    title: str
    description: str
    priority: str = Field(examples=["high"])
    impact: str


class DashboardAIFinding(BaseModel):
    title: str
    summary: str
    severity: str = Field(examples=["critical"])


class DashboardMetricsResponse(BaseModel):
    inefficiency_score: float = Field(ge=0, le=100)
    revenue_leakage_estimate: float = Field(ge=0, description="Estimated leakage in local currency.")
    time_waste_estimate: float = Field(ge=0, description="Estimated wasted hours per week.")
    repeated_task_count: int = Field(ge=0)
    workflow_fragmentation_score: float = Field(ge=0, le=100)
    automation_opportunities: list[DashboardAutomationOpportunity] = Field(default_factory=list)
    ai_findings: list[DashboardAIFinding] = Field(default_factory=list)
