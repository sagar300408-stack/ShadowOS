from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field

from backend.schemas.analysis_schema import IntelligenceFinding
from backend.schemas.dashboard_schema import DashboardMetricsResponse
from backend.schemas.workflow_schema import WorkflowResponse
from backend.schemas.recommendation_schema import AutomationRecommendation
from backend.schemas.executive_report_schema import ExecutiveImpactReport

class UnifiedAnalysisResult(BaseModel):
    analysis_id: str
    upload_id: str
    created_at: str
    dataset_type: str = Field(description="e.g. Lead Management, CRM Export")
    confidence_score: float = Field(ge=0.0, le=1.0)
    supported_analyzers: list[str] = Field(default_factory=list)
    analysis_explanations: list[str] = Field(default_factory=list)
    
    primary_finding: IntelligenceFinding
    dashboard: DashboardMetricsResponse
    workflow: WorkflowResponse
    recommendations: list[AutomationRecommendation]
    executive_impact: ExecutiveImpactReport
