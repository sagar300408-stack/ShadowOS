from datetime import datetime

from fastapi import APIRouter
from pydantic import BaseModel, Field


router = APIRouter(tags=["Health"])


class HealthResponse(BaseModel):
    status: str = Field(default="ok")
    service: str = Field(default="ShadowOS API")
    version: str = Field(default="0.1.0")
    checked_at: datetime = Field(default_factory=datetime.utcnow)


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    return HealthResponse()

