from dataclasses import dataclass, field
from datetime import datetime


@dataclass(frozen=True)
class WorkflowRecord:
    record_id: str
    workflow_name: str
    task_name: str
    owner: str | None = None
    team: str | None = None
    status: str | None = None
    channel: str | None = None
    source_system: str | None = None
    is_manual: bool = False
    repeat_count: int = 1
    handoff_count: int = 0
    customer_value: float = 0
    created_at: datetime | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None
    due_at: datetime | None = None
    follow_up_due_at: datetime | None = None
    last_contact_at: datetime | None = None
    metadata: dict[str, str | int | float | bool] = field(default_factory=dict)


@dataclass(frozen=True)
class IntelligenceSignal:
    category: str
    title: str
    description: str
    severity: str
    score_impact: float
    evidence: list[str] = field(default_factory=list)
    estimated_hours_lost: float = 0
    estimated_revenue_leakage: float = 0

