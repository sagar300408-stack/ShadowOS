import asyncio

from backend.ai.clients.openai_client import OpenAIService, OpenAIServiceUnavailable
from backend.ai.prompts.loader import PromptTemplateLoader
from backend.config.settings import Settings, get_settings
from backend.schemas.ai_schema import AIOrchestrationRequest, AIOrchestrationResponse, AITextResult


class OperationalAIOrchestrator:
    system_instructions = (
        "You are ShadowOS, an AI operational intelligence copilot for real estate teams. "
        "Use the provided operational data only. Be concise, credible, and business-focused."
    )

    def __init__(
        self,
        openai_service: OpenAIService | None = None,
        prompt_loader: PromptTemplateLoader | None = None,
        settings: Settings | None = None,
    ) -> None:
        self.settings = settings or get_settings()
        self.openai_service = openai_service or OpenAIService(self.settings)
        self.prompt_loader = prompt_loader or PromptTemplateLoader()

    async def run(self, payload: AIOrchestrationRequest) -> AIOrchestrationResponse:
        workflow_summary, operational_risks, enhanced_recommendations, executive_summary, deployment_narrative = (
            await asyncio.gather(
                self.generate_workflow_summary(payload.analysis),
                self.detect_operational_risks(payload.analysis, payload.workflow),
                self.enhance_automation_recommendations(payload.recommendations, payload.analysis),
                self.generate_executive_summary(payload.analysis, payload.workflow, payload.recommendations),
                self.generate_deployment_narrative(payload.deployment, payload.analysis),
            )
        )

        return AIOrchestrationResponse(
            workflow_summary=workflow_summary,
            operational_risks=operational_risks,
            enhanced_recommendations=enhanced_recommendations,
            executive_summary=executive_summary,
            deployment_narrative=deployment_narrative,
        )

    async def generate_workflow_summary(self, analysis: dict) -> AITextResult:
        prompt = self.prompt_loader.render("workflow_summary.txt", analysis=analysis)
        return await self._complete_or_fallback(
            capability="workflow_summary_generation",
            prompt=prompt,
            fallback=self._fallback_workflow_summary(analysis),
        )

    async def detect_operational_risks(self, analysis: dict, workflow: dict) -> AITextResult:
        prompt = self.prompt_loader.render("operational_risk_detection.txt", analysis=analysis, workflow=workflow)
        return await self._complete_or_fallback(
            capability="operational_risk_detection",
            prompt=prompt,
            fallback=self._fallback_operational_risks(analysis),
        )

    async def enhance_automation_recommendations(
        self,
        recommendations: list[dict],
        analysis: dict,
    ) -> AITextResult:
        prompt = self.prompt_loader.render(
            "automation_recommendation_enhancement.txt",
            recommendations=recommendations,
            analysis=analysis,
        )
        return await self._complete_or_fallback(
            capability="automation_recommendation_enhancement",
            prompt=prompt,
            fallback=self._fallback_recommendation_enhancement(recommendations),
        )

    async def generate_executive_summary(
        self,
        analysis: dict,
        workflow: dict,
        recommendations: list[dict],
    ) -> AITextResult:
        prompt = self.prompt_loader.render(
            "executive_summary.txt",
            analysis=analysis,
            workflow=workflow,
            recommendations=recommendations,
        )
        return await self._complete_or_fallback(
            capability="executive_summary_generation",
            prompt=prompt,
            fallback=self._fallback_executive_summary(analysis),
        )

    async def generate_deployment_narrative(self, deployment: dict, analysis: dict) -> AITextResult:
        prompt = self.prompt_loader.render("deployment_narrative.txt", deployment=deployment, analysis=analysis)
        return await self._complete_or_fallback(
            capability="deployment_narrative_generation",
            prompt=prompt,
            fallback=self._fallback_deployment_narrative(deployment),
        )

    async def _complete_or_fallback(self, *, capability: str, prompt: str, fallback: str) -> AITextResult:
        try:
            content = await self.openai_service.generate_text(
                instructions=self.system_instructions,
                prompt=prompt,
            )
            return AITextResult(
                capability=capability,
                content=content,
                model=self.settings.openai_model,
                used_fallback=False,
            )
        except OpenAIServiceUnavailable:
            return AITextResult(
                capability=capability,
                content=fallback,
                model=self.settings.openai_model,
                used_fallback=True,
            )

    def _fallback_workflow_summary(self, analysis: dict) -> str:
        score = analysis.get("inefficiency_score", "an elevated")
        return (
            "ShadowOS detected workflow fragmentation between lead capture and follow-up systems, "
            f"resulting in an inefficiency score of {score}."
        )

    def _fallback_operational_risks(self, analysis: dict) -> str:
        leakage = analysis.get("revenue_leakage", "revenue leakage risk")
        return f"Operational risk is concentrated around missed follow-ups, duplicate work, and {leakage}."

    def _fallback_recommendation_enhancement(self, recommendations: list[dict]) -> str:
        count = len(recommendations)
        return (
            f"ShadowOS identified {count} automation opportunities. Prioritize CRM sync, lead routing, "
            "follow-up automation, duplicate detection, reminder systems, and escalation systems."
        )

    def _fallback_executive_summary(self, analysis: dict) -> str:
        score = analysis.get("inefficiency_score", "high")
        time_waste = analysis.get("time_waste", "avoidable manual work")
        return (
            f"ShadowOS found a {score} operational inefficiency profile driven by fragmented workflows and {time_waste}. "
            "The fastest path to value is automating lead intake, CRM sync, follow-ups, and escalation triggers."
        )

    def _fallback_deployment_narrative(self, deployment: dict) -> str:
        status = deployment.get("status", "simulation completed")
        return (
            f"Deployment narrative: {status}. ShadowOS simulates replacing manual handoffs with automated routing, "
            "reminders, and escalation checks so stalled leads can be recovered earlier."
        )
