import asyncio
import json
import uuid
from backend.services.data_ingestion_service import DataIngestionService
from backend.schemas.upload_schema import UploadType
from backend.store import STORE

from backend.routes.dashboard import get_dashboard_metrics

async def run_test():
    # 1. Create fake data and put into store
    data = [
        {
            "record_id": f"REC-{i}",
            "status": "dropped",
            "created_at": "2024-01-01T10:00:00Z",
            "updated_at": "2024-01-01T10:00:00Z",
            "last_followup": None,
            "owner": None,
            "assigned_to": None,
            "source": "facebook",
            "lead_value": 50000.0,
            "revenue": 0.0,
            "stage": "new",
            "task_type": "manual entry",
            "system": "excel",
            "notes": "duplicate record"
        }
        for i in range(10)
    ]
    
    upload_id = str(uuid.uuid4())
    STORE[upload_id] = {"normalized_data": data}
    
    print(f"Stored mock data under upload_id: {upload_id}")
    
    # 2. Call Dashboard endpoint
    try:
        response = await get_dashboard_metrics(upload_id=upload_id)
        print("SUCCESS! Dashboard response generated:")
        print(response.model_dump_json(indent=2))
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    asyncio.run(run_test())
