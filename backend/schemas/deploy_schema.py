from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


class DeploymentMode(str, Enum):
    simulate = "simulate"
    dry_run = "dry_run"


class DeployRequest(BaseModel):
    recommendation_ids: list[UUID] = Field(default_factory=list)
    mode: DeploymentMode = DeploymentMode.simulate


class DeploymentLog(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    level: str = Field(examples=["info"])
    message: str


class DeployResponse(BaseModel):
    deployment_id: UUID
    status: str = Field(default="simulation_completed")
    simulation_logs: list[DeploymentLog]
    estimated_impact: dict[str, float]

