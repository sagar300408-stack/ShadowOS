from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
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


class ParsingDiagnostic(BaseModel):
    total_rows: int
    processed_rows: int
    dropped_empty_rows: int
    missing_data_percentages: Dict[str, float]
    unmapped_columns: List[str]


class UploadSummary(BaseModel):
    dataset_type: str = "Unknown"
    confidence_score: float = 0.0
    total_records: int
    error_count: int = 0


class CanonicalRecord(BaseModel):
    record_id: Optional[str] = None
    status: Optional[str] = None
    created_at: Optional[Any] = None
    updated_at: Optional[Any] = None
    last_followup: Optional[Any] = None
    owner: Optional[str] = None
    assigned_to: Optional[str] = None
    source: Optional[str] = None
    lead_value: Optional[float] = None
    revenue: Optional[float] = None
    stage: Optional[str] = None
    task_type: Optional[str] = None
    system: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        extra = "allow"


class UploadResponse(BaseModel):
    message: str = Field(examples=["File uploaded and validated successfully."])
    metadata: UploadMetadata
    summary: Optional[UploadSummary] = None
    diagnostics: Optional[ParsingDiagnostic] = None
    dataset_type: Optional[str] = None
    confidence_score: Optional[float] = None
    normalized_data: Optional[List[CanonicalRecord]] = None
