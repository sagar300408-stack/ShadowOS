import uuid
from backend.services.operational_intelligence_service import OperationalIntelligenceEngine
from backend.schemas.analysis_schema import AnalyzeRequest
from backend.schemas.upload_schema import CanonicalRecord

def test_engine():
    # Mock records
    records = [
        CanonicalRecord(record_id="1", status="Open", lead_value=10000, created_at="2026-05-01T00:00:00Z"),
        CanonicalRecord(record_id="2", status="Dropped", lead_value=5000, created_at="2026-05-10T00:00:00Z", system="Excel"),
        CanonicalRecord(record_id="3", status="Open", lead_value=15000, created_at="2026-05-20T00:00:00Z", system="Salesforce", notes="Manual entry required"),
    ]
    
    req = AnalyzeRequest(
        upload_id=uuid.uuid4(),
        records=records
    )

    engine = OperationalIntelligenceEngine()
    response = engine.analyze(req)
    
    print(response.model_dump_json(indent=2))

if __name__ == "__main__":
    test_engine()
