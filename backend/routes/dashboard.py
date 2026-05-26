from fastapi import APIRouter

from backend.schemas.dashboard_schema import (
    DashboardAIFinding,
    DashboardAutomationOpportunity,
    DashboardMetricsResponse,
)


router = APIRouter(tags=["Dashboard"])


@router.get("/dashboard", response_model=DashboardMetricsResponse)
async def get_dashboard_metrics() -> DashboardMetricsResponse:
    return DashboardMetricsResponse(
        inefficiency_score=72.4,
        revenue_leakage_estimate=185000.0,
        time_waste_estimate=42.5,
        repeated_task_count=18,
        workflow_fragmentation_score=68.0,
        automation_opportunities=[
            DashboardAutomationOpportunity(
                title="CRM sync",
                description="Unify WhatsApp, Excel, and lead tracker updates into a single operational record.",
                priority="critical",
                impact="Reduces duplicate entry and makes lead ownership visible.",
            ),
            DashboardAutomationOpportunity(
                title="Follow-up automation",
                description="Trigger reminders and buyer messages when high-value leads sit idle.",
                priority="high",
                impact="Recovers delayed leads before they become revenue leakage.",
            ),
            DashboardAutomationOpportunity(
                title="Escalation system",
                description="Escalate stalled document collection and site-visit workflows after SLA breaches.",
                priority="high",
                impact="Prevents silent handoff failure between sales and operations.",
            ),
        ],
        ai_findings=[
            DashboardAIFinding(
                title="Workflow fragmentation detected",
                summary="Lead capture and follow-up activity are split across WhatsApp, spreadsheets, and manual broker updates.",
                severity="critical",
            ),
            DashboardAIFinding(
                title="Revenue leakage opportunity",
                summary="Delayed follow-ups and repeated handoffs indicate measurable conversion risk in active buyer workflows.",
                severity="high",
            ),
            DashboardAIFinding(
                title="Manual repetition cluster",
                summary="Repeated status checks and reminders are strong candidates for routing rules and reminder automation.",
                severity="medium",
            ),
        ],
    )
