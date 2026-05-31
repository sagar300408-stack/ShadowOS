from fastapi import APIRouter, HTTPException, status

from backend.schemas.executive_report_schema import ExecutiveReportRequest, ExecutiveImpactReport
from backend.services.executive_report_service import ExecutiveReportGenerator

router = APIRouter(tags=["Executive Report"])
generator = ExecutiveReportGenerator()

@router.post(
    "/executive-report",
    response_model=ExecutiveImpactReport,
    status_code=status.HTTP_200_OK,
)
async def generate_executive_report(payload: ExecutiveReportRequest) -> ExecutiveImpactReport:
    """
    Generate an OpenAI-powered executive summary and narrative from the operational metrics.
    """
    try:
        response = await generator.generate(payload.intelligence_report)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate executive report: {str(e)}",
        )
