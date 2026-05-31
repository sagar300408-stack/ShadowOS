import asyncio
import json
from backend.schemas.analysis_schema import AnalyzeResponse
from backend.services.executive_report_service import ExecutiveReportGenerator
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

async def run_test():
    # Mock report
    mock_report = AnalyzeResponse(
        operational_health_score=68.0,
        lead_drop_off_rate=32.0,
        revenue_leakage_amount=1240000.0,
        average_follow_up_delay_days=0.5,
        bottleneck_count=18,
        fragmentation_score=74.0,
        manual_workload_hours=18.0,
        automation_potential_score=85.0,
        findings=[],
        risks=[],
        opportunities=[],
    )
    
    generator = ExecutiveReportGenerator()
    try:
        print("Generating Executive Report via OpenAI...")
        response = await generator.generate(mock_report)
        print("SUCCESS! Output:")
        print(response.model_dump_json(indent=2))
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    asyncio.run(run_test())
