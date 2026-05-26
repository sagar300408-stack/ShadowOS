from pydantic import BaseModel, Field


class DashboardMetricsResponse(BaseModel):
    inefficiency_score: float = Field(ge=0, le=100)
    revenue_leakage_estimate: float = Field(ge=0, description="Estimated leakage in local currency.")
    time_waste_estimate: float = Field(ge=0, description="Estimated wasted hours per week.")
    repeated_task_count: int = Field(ge=0)
    workflow_fragmentation_score: float = Field(ge=0, le=100)

