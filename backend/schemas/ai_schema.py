from pydantic import BaseModel, Field


class AITextResult(BaseModel):
    capability: str
    content: str
    model: str
    used_fallback: bool = False


class AIOrchestrationRequest(BaseModel):
    analysis: dict = Field(default_factory=dict)
    workflow: dict = Field(default_factory=dict)
    recommendations: list[dict] = Field(default_factory=list)
    deployment: dict = Field(default_factory=dict)


class AIOrchestrationResponse(BaseModel):
    workflow_summary: AITextResult
    operational_risks: AITextResult
    enhanced_recommendations: AITextResult
    executive_summary: AITextResult
    deployment_narrative: AITextResult

