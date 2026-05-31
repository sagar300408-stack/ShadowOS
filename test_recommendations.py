import json
from backend.schemas.analysis_schema import AnalyzeResponse
from backend.schemas.recommendation_schema import RecommendationRequest
from backend.services.recommendation_service import RecommendationEngine

def test_engine():
    report = AnalyzeResponse(
        operational_health_score=60.0,
        lead_drop_off_rate=15.0,
        revenue_leakage_amount=10000.0,
        average_follow_up_delay_days=2.5,
        bottleneck_count=3,
        fragmentation_score=15.0,
        manual_workload_hours=10.0,
        automation_potential_score=85.0,
        findings=[],
        risks=[],
        opportunities=[]
    )
    
    req = RecommendationRequest(intelligence_report=report)
    engine = RecommendationEngine()
    response = engine.generate(req.intelligence_report)
    
    print(response.model_dump_json(indent=2))

if __name__ == "__main__":
    test_engine()
