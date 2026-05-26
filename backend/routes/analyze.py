from fastapi import APIRouter, status

from backend.schemas.analysis_schema import AnalyzeRequest, AnalyzeResponse
from backend.services.operational_intelligence_service import OperationalIntelligenceEngine


router = APIRouter(tags=["Analysis"])
engine = OperationalIntelligenceEngine()


@router.post("/analyze", response_model=AnalyzeResponse, status_code=status.HTTP_202_ACCEPTED)
async def analyze_workflow(payload: AnalyzeRequest) -> AnalyzeResponse:
    return engine.analyze(payload)
