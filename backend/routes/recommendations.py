from fastapi import APIRouter

from backend.schemas.recommendation_schema import (
    AutomationOpportunity,
    EfficiencyImprovement,
    Priority,
    RecommendationsResponse,
    RiskAlert,
)


router = APIRouter(tags=["Recommendations"])


@router.get("/recommendations", response_model=RecommendationsResponse)
async def get_recommendations() -> RecommendationsResponse:
    return RecommendationsResponse(
        automation_opportunities=[
            AutomationOpportunity(
                title="Automated lead routing",
                current_problem="Leads are manually assigned, causing slow first response times.",
                proposed_automation="Route leads automatically by property location, broker availability, and lead value.",
                priority=Priority.high,
                estimated_hours_saved_per_week=14.0,
                implementation_effort="medium",
            ),
            AutomationOpportunity(
                title="Document follow-up assistant",
                current_problem="Operations teams repeatedly chase buyers for missing documents.",
                proposed_automation="Send scheduled document reminders and escalate incomplete cases.",
                priority=Priority.medium,
                estimated_hours_saved_per_week=9.5,
                implementation_effort="low",
            ),
        ],
        risk_alerts=[
            RiskAlert(
                title="Revenue leakage from delayed responses",
                description="High-intent leads are at risk when first response exceeds 6 hours.",
                severity=Priority.high,
            )
        ],
        efficiency_improvements=[
            EfficiencyImprovement(
                area="Lead response",
                expected_improvement_percent=61.0,
                explanation="Automation reduces assignment and first-contact delay.",
            ),
            EfficiencyImprovement(
                area="Back-office coordination",
                expected_improvement_percent=38.0,
                explanation="Fewer manual handoffs are needed for document follow-up.",
            ),
        ],
    )

