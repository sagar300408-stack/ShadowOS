from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


class UploadType(str, Enum):
    csv = "csv"
    excel = "excel"


class UploadStatus(str, Enum):
    received = "received"
    validated = "validated"
    rejected = "rejected"


class UploadMetadata(BaseModel):
    upload_id: UUID
    filename: str
    content_type: str
    file_type: UploadType
    size_bytes: int
    status: UploadStatus = UploadStatus.validated
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)


class UploadResponse(BaseModel):
    message: str = Field(examples=["File uploaded and validated successfully."])
    metadata: UploadMetadata

