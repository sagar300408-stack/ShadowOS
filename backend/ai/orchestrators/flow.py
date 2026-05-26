from backend.ai.orchestrators.operational_ai_orchestrator import OperationalAIOrchestrator
from backend.schemas.ai_schema import AIOrchestrationRequest, AIOrchestrationResponse


async def enhance_operational_intelligence(payload: AIOrchestrationRequest) -> AIOrchestrationResponse:
    orchestrator = OperationalAIOrchestrator()
    return await orchestrator.run(payload)

