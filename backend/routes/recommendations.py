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
                title="Lead Follow-Up Agent",
                current_problem="High-intent leads decay when manual follow-ups are delayed by up to 12 hours.",
                proposed_automation="Trigger scheduled WhatsApp reminders and initial replies when high-value leads sit idle.",
                priority=Priority.high,
                estimated_hours_saved_per_week=18.0,
                implementation_effort="low",
            ),
            AutomationOpportunity(
                title="CRM Sync Agent",
                current_problem="Customer profiles and transaction logs are scattered across WhatsApp, Excel, and local files.",
                proposed_automation="Unify inbound channel events and broker data in real-time, removing manual double entry.",
                priority=Priority.high,
                estimated_hours_saved_per_week=14.5,
                implementation_effort="medium",
            ),
            AutomationOpportunity(
                title="Lead Qualification Agent",
                current_problem="Brokers waste hours manually checking budget, location, and intent of incoming prospects.",
                proposed_automation="Automatically profile and score leads via instant WhatsApp qualification chats.",
                priority=Priority.medium,
                estimated_hours_saved_per_week=10.0,
                implementation_effort="medium",
            ),
        ],
        risk_alerts=[
            RiskAlert(
                title="Revenue leakage from delayed response loops",
                description="Delayed manual responses lead to 68% of total pipeline conversion loss.",
                severity=Priority.high,
            )
        ],
        efficiency_improvements=[
            EfficiencyImprovement(
                area="Lead response time",
                expected_improvement_percent=99.0,
                explanation="Automation reduces response delays from 6 hours to under 3 minutes.",
            ),
            EfficiencyImprovement(
                area="Back-office manual overhead",
                expected_improvement_percent=62.0,
                explanation="Real-time syncing and automated triggers cut chasing efforts by 18 hours/week.",
            ),
        ],
    )

