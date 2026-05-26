from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from backend.schemas.upload_schema import UploadMetadata, UploadResponse, UploadType


router = APIRouter(tags=["Upload"])

ALLOWED_EXTENSIONS = {
    ".csv": UploadType.csv,
    ".xls": UploadType.excel,
    ".xlsx": UploadType.excel,
}


@router.post("/upload", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(file: UploadFile = File(...)) -> UploadResponse:
    extension = Path(file.filename or "").suffix.lower()
    file_type = ALLOWED_EXTENSIONS.get(extension)

    if file_type is None:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only CSV and Excel files are supported.",
        )

    contents = await file.read()
    if not contents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    metadata = UploadMetadata(
        upload_id=uuid4(),
        filename=file.filename or "uploaded_file",
        content_type=file.content_type or "application/octet-stream",
        file_type=file_type,
        size_bytes=len(contents),
    )

    return UploadResponse(
        message="File uploaded and validated successfully.",
        metadata=metadata,
    )

