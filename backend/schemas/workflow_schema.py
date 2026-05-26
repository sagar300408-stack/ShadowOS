from enum import Enum

from pydantic import BaseModel, Field


class WorkflowNodeType(str, Enum):
    trigger = "trigger"
    task = "task"
    decision = "decision"
    automation = "automation"
    outcome = "outcome"


class WorkflowNode(BaseModel):
    id: str
    label: str
    type: WorkflowNodeType
    owner: str | None = None
    bottleneck: bool = False


class WorkflowEdge(BaseModel):
    source: str
    target: str
    label: str | None = None
    average_delay_hours: float = Field(default=0, ge=0)


class WorkflowGraph(BaseModel):
    nodes: list[WorkflowNode]
    edges: list[WorkflowEdge]


class WorkflowResponse(BaseModel):
    workflow_graph: WorkflowGraph
    nodes: list[WorkflowNode]
    edges: list[WorkflowEdge]
    before_workflow: WorkflowGraph
    after_workflow: WorkflowGraph

