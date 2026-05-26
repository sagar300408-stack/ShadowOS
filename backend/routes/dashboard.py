from fastapi import APIRouter

from backend.schemas.dashboard_schema import DashboardMetricsResponse


router = APIRouter(tags=["Dashboard"])


@router.get("/dashboard", response_model=DashboardMetricsResponse)
async def get_dashboard_metrics() -> DashboardMetricsResponse:
    return DashboardMetricsResponse(
        inefficiency_score=72.4,
        revenue_leakage_estimate=185000.0,
        time_waste_estimate=42.5,
        repeated_task_count=18,
        workflow_fragmentation_score=68.0,
    )

