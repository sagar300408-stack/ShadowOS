from pydantic import BaseModel, Field
from backend.schemas.recommendation_schema import AutomationRecommendation

class ReactFlowPosition(BaseModel):
    x: float
    y: float


class ReactFlowNodeData(BaseModel):
    label: str
    node_type: str = Field(examples=["manual_task", "automation", "outcome"])
    category: str | None = None
    severity: str | None = None
    owner: str | None = None
    description: str | None = None


class ReactFlowNode(BaseModel):
    id: str
    type: str = Field(default="shadowNode")
    position: ReactFlowPosition
    data: ReactFlowNodeData


class ReactFlowEdgeData(BaseModel):
    label: str | None = None
    delay_hours: float = Field(default=0, ge=0)
    risk: str | None = None


class ReactFlowEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str = Field(default="smoothstep")
    label: str | None = None
    animated: bool = False
    data: ReactFlowEdgeData = Field(default_factory=ReactFlowEdgeData)


class WorkflowGraph(BaseModel):
    nodes: list[ReactFlowNode]
    edges: list[ReactFlowEdge]


class WorkflowFindingInput(BaseModel):
    category: str = Field(examples=["missed_follow_ups"])
    title: str = Field(examples=["Missed customer follow-ups"])
    description: str
    severity: str = Field(default="medium", examples=["high"])
    estimated_hours_lost: float = Field(default=0, ge=0)
    estimated_revenue_leakage: float = Field(default=0, ge=0)




class WorkflowGenerationResponse(BaseModel):
    before: WorkflowGraph
    after: WorkflowGraph
    automation_recommendations: list[AutomationRecommendation]


WorkflowResponse = WorkflowGenerationResponse
