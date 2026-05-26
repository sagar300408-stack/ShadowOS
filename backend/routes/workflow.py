from fastapi import APIRouter

from backend.schemas.workflow_schema import WorkflowResponse
from backend.services.workflow_generation_service import WorkflowGenerationService


router = APIRouter(tags=["Workflow"])
workflow_service = WorkflowGenerationService()


@router.get("/workflow", response_model=WorkflowResponse)
async def get_workflow() -> WorkflowResponse:
    return workflow_service.generate()
