import io
from typing import Dict, List, Tuple

import pandas as pd

from backend.schemas.upload_schema import (
    CanonicalRecord,
    ParsingDiagnostic,
    UploadSummary,
    UploadType,
)

CANONICAL_MAPPING = {
    "lead id": "record_id",
    "id": "record_id",
    "record id": "record_id",
    "lead amount": "lead_value",
    "deal value": "lead_value",
    "value": "lead_value",
    "sales rep": "owner",
    "owner": "owner",
    "agent": "owner",
    "assigned agent": "assigned_to",
    "assigned to": "assigned_to",
    "follow up date": "last_followup",
    "last followup": "last_followup",
    "followup": "last_followup",
    "created date": "created_at",
    "created at": "created_at",
    "created": "created_at",
    "date created": "created_at",
    "updated date": "updated_at",
    "updated at": "updated_at",
    "last modified": "updated_at",
    "lead source": "source",
    "source": "source",
    "status": "status",
    "state": "status",
    "pipeline stage": "stage",
    "stage": "stage",
    "task type": "task_type",
    "type": "task_type",
    "system": "system",
    "notes": "notes",
    "description": "notes",
}

DATASET_PROFILES = {
    "Lead Management Dataset": {"lead_value", "status", "stage", "source", "owner"},
    "CRM Export": {"record_id", "created_at", "updated_at", "owner", "revenue"},
    "Task Tracker": {"task_type", "status", "assigned_to", "created_at", "last_followup"},
    "Revenue Sheet": {"revenue", "record_id", "status", "stage"},
    "Operational Workflow Log": {"system", "status", "created_at", "updated_at", "task_type"}
}

class DataIngestionService:
    @staticmethod
    def clean_column_name(col: str) -> str:
        return str(col).strip().lower()

    @staticmethod
    def map_to_canonical(columns: List[str]) -> Dict[str, str]:
        mapping = {}
        for col in columns:
            clean_col = DataIngestionService.clean_column_name(col)
            mapped = CANONICAL_MAPPING.get(clean_col)
            if not mapped:
                mapped = CANONICAL_MAPPING.get(clean_col.replace("_", " "))
            
            if mapped:
                mapping[col] = mapped
            else:
                mapping[col] = clean_col.replace(" ", "_")
        return mapping

    @staticmethod
    def detect_dataset_type(mapped_columns: List[str]) -> Tuple[str, float]:
        col_set = set(mapped_columns)
        best_match = "Unknown"
        highest_score = 0.0

        for profile_name, expected_cols in DATASET_PROFILES.items():
            if not expected_cols:
                continue
            intersection = col_set.intersection(expected_cols)
            score = len(intersection) / len(expected_cols)
            if score > highest_score:
                highest_score = score
                best_match = profile_name

        return best_match, round(highest_score, 2)

    @staticmethod
    async def process_file(
        contents: bytes, filename: str, file_type: UploadType
    ) -> Tuple[List[CanonicalRecord], UploadSummary, ParsingDiagnostic]:
        
        try:
            if file_type == UploadType.csv:
                df = pd.read_csv(io.BytesIO(contents))
            elif file_type == UploadType.excel:
                df = pd.read_excel(io.BytesIO(contents))
            else:
                raise ValueError("Unsupported file type")
        except Exception as e:
            raise ValueError(f"Failed to parse file: {str(e)}")

        original_row_count = len(df)
        
        df.dropna(how="all", inplace=True)
        processed_row_count = len(df)
        dropped_empty_rows = original_row_count - processed_row_count

        missing_data_percentages = {}
        if processed_row_count > 0:
            missing_series = df.isnull().mean() * 100
            for col, pct in missing_series.items():
                missing_data_percentages[str(col)] = round(pct, 2)

        original_cols = list(df.columns)
        mapping = DataIngestionService.map_to_canonical(original_cols)
        df.rename(columns=mapping, inplace=True)

        mapped_cols = list(df.columns)
        
        canonical_values = set(CANONICAL_MAPPING.values())
        unmapped_columns = [col for col in mapped_cols if col not in canonical_values]

        dataset_type, confidence = DataIngestionService.detect_dataset_type(mapped_cols)

        df = df.replace({float("nan"): None, float("inf"): None, float("-inf"): None})
        
        for col in df.select_dtypes(include=['datetime64']).columns:
            df[col] = df[col].apply(lambda x: None if pd.isna(x) else x)
        
        df = df.where(pd.notnull(df), None)

        records_dicts = df.to_dict(orient="records")
        normalized_data = []
        error_count = 0

        for r in records_dicts:
            try:
                record = CanonicalRecord(**r)
                normalized_data.append(record)
            except Exception:
                error_count += 1

        summary = UploadSummary(
            dataset_type=dataset_type,
            confidence_score=confidence,
            total_records=len(normalized_data),
            error_count=error_count,
        )

        diagnostics = ParsingDiagnostic(
            total_rows=original_row_count,
            processed_rows=processed_row_count,
            dropped_empty_rows=dropped_empty_rows,
            missing_data_percentages=missing_data_percentages,
            unmapped_columns=unmapped_columns,
        )

        return normalized_data, summary, diagnostics
