from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from backend.schemas.analysis_schema import AnalyzeRequest
from backend.schemas.dashboard_schema import (
    DashboardAIFinding,
    DashboardAutomationOpportunity,
    DashboardMetricsResponse,
)
from backend.services.operational_intelligence_service import OperationalIntelligenceEngine
from backend.services.recommendation_service import RecommendationEngine
from backend.store import STORE

router = APIRouter(tags=["Dashboard"])


@router.get("/dashboard", response_model=DashboardMetricsResponse)
async def get_dashboard_metrics(
    upload_id: Optional[str] = Query(None, description="The ID of the uploaded dataset")
) -> DashboardMetricsResponse:
    if not upload_id or upload_id not in STORE:
        raise HTTPException(
            status_code=404,
            detail="No intelligence payload found. Please upload a dataset first.",
        )

    # 1. Retrieve raw canonical records from store
    normalized_data = STORE[upload_id]["normalized_data"]

    # 2. Run Operational Intelligence Engine
    from uuid import UUID
    analysis_request = AnalyzeRequest(upload_id=UUID(upload_id), records=normalized_data)
    engine = OperationalIntelligenceEngine()
    report = engine.analyze(analysis_request)

    # 3. Run Recommendation Engine
    rec_engine = RecommendationEngine()
    recommendations_response = rec_engine.generate(report)

    # 4. Map to Dashboard UI Schema
    ai_findings = [
        DashboardAIFinding(
            title=finding.title,
            summary=finding.description,
            severity=finding.severity,
        )
        for finding in report.findings
    ]

    automation_opportunities = [
        DashboardAutomationOpportunity(
            title=rec.title,
            description=rec.proposed_automation,
            priority=rec.priority,
            impact=rec.estimated_business_impact,
        )
        for rec in recommendations_response.automation_recommendations
    ]

    return DashboardMetricsResponse(
        inefficiency_score=100.0 - report.operational_health_score,
        revenue_leakage_estimate=report.revenue_leakage_amount,
        time_waste_estimate=report.manual_workload_hours,
        repeated_task_count=report.bottleneck_count,
        workflow_fragmentation_score=report.fragmentation_score,
        automation_potential=report.automation_potential_score,
        automation_opportunities=automation_opportunities,
        ai_findings=ai_findings,
    )
