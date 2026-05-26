from datetime import datetime
from typing import Generic, TypeVar
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


T = TypeVar("T")


class ErrorDetail(BaseModel):
    code: str = Field(..., examples=["UNSUPPORTED_FILE_TYPE"])
    message: str = Field(..., examples=["Only CSV and Excel files are supported."])


class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: T | None = None
    error: ErrorDetail | None = None
    generated_at: datetime = Field(default_factory=datetime.utcnow)


class EntityRef(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    type: str = Field(..., examples=["upload", "analysis", "workflow"])

