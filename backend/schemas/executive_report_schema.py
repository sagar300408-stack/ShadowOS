from pydantic import BaseModel, Field
from backend.schemas.analysis_schema import AnalyzeResponse


class ExecutiveReportRequest(BaseModel):
    intelligence_report: AnalyzeResponse = Field(
        description="The structured metrics outputted by the Operational Intelligence Engine."
    )


class ChartDataPoint(BaseModel):
    name: str
    before: float
    after: float
    unit: str

class ExecutiveImpactReport(BaseModel):
    revenue_recovery_estimate: float = Field(ge=0)
    manual_work_reduction_percent: float = Field(ge=0, le=100)
    lead_recovery_conversion_increase: float = Field(ge=0, le=100)
    automation_opportunities_count: int = Field(ge=0)
    workflow_efficiency_increase: float = Field(ge=0, le=100)
    operational_risk_reduction: float = Field(ge=0, le=100)
    chart_data: list[ChartDataPoint] = Field(default_factory=list)
