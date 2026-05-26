from backend.generators.automation_recommendation_generator import AutomationRecommendationGenerator
from backend.generators.workflow_graph_builder import WorkflowGraphBuilder
from backend.models.operational_intelligence import IntelligenceSignal
from backend.schemas.workflow_schema import WorkflowFindingInput, WorkflowGenerationResponse


class WorkflowGenerationService:
    def __init__(
        self,
        graph_builder: WorkflowGraphBuilder | None = None,
        recommendation_generator: AutomationRecommendationGenerator | None = None,
    ) -> None:
        self.graph_builder = graph_builder or WorkflowGraphBuilder()
        self.recommendation_generator = recommendation_generator or AutomationRecommendationGenerator()

    def generate(self, findings: list[WorkflowFindingInput] | None = None) -> WorkflowGenerationResponse:
        recommendation_inputs = self._to_signals(findings) if findings else None
        recommendations = (
            self.recommendation_generator.generate(recommendation_inputs)
            if recommendation_inputs
            else self.recommendation_generator.generate_default()
        )

        return WorkflowGenerationResponse(
            before=self.graph_builder.build_before_graph(findings),
            after=self.graph_builder.build_after_graph(recommendations if findings else None),
            automation_recommendations=recommendations,
        )

    def _to_signals(self, findings: list[WorkflowFindingInput] | None) -> list[IntelligenceSignal]:
        if not findings:
            return []

        return [
            IntelligenceSignal(
                category=finding.category,
                title=finding.title,
                description=finding.description,
                severity=finding.severity,
                score_impact=10,
                estimated_hours_lost=finding.estimated_hours_lost,
                estimated_revenue_leakage=finding.estimated_revenue_leakage,
            )
            for finding in findings
        ]
