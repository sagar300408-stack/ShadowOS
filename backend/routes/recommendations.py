from fastapi import APIRouter, status

from backend.schemas.recommendation_schema import RecommendationRequest, RecommendationsResponse
from backend.services.recommendation_service import RecommendationEngine


router = APIRouter(tags=["Recommendations"])
engine = RecommendationEngine()


@router.post("/recommendations", response_model=RecommendationsResponse, status_code=status.HTTP_200_OK)
async def generate_recommendations(payload: RecommendationRequest) -> RecommendationsResponse:
    """
    Generate dynamic automation recommendations based on the Operational Intelligence Report.
    """
    return engine.generate(payload.intelligence_report)
