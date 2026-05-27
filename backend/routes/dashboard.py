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
        inefficiency_score=72.0,
        revenue_leakage_estimate=1240000.0,
        time_waste_estimate=18.0,
        repeated_task_count=18,
        workflow_fragmentation_score=68.0,
        automation_potential=85.0,
        automation_opportunities=[
            DashboardAutomationOpportunity(
                title="Lead Follow-Up Agent",
                description="Trigger scheduled WhatsApp reminders and initial replies when high-value leads sit idle.",
                priority="critical",
                impact="Cuts response time to <3 mins and recovers delayed leads, saving 18h/week.",
            ),
            DashboardAutomationOpportunity(
                title="CRM Sync Agent",
                description="Unify WhatsApp, Excel, and lead tracker updates automatically in real-time.",
                priority="critical",
                impact="Eliminates manual entry errors and double-entry entirely, creating a unified timeline.",
            ),
            DashboardAutomationOpportunity(
                title="Lead Qualification Agent",
                description="Automatically filter and score incoming buyer requests based on territory, budget, and urgency.",
                priority="high",
                impact="Saves hours of manual broker filtering by routing only warm, qualified prospects.",
            ),
        ],
        ai_findings=[
            DashboardAIFinding(
                title="Delayed Lead Response Handoff",
                summary="Leads sit uncontacted for an average of 12+ hours due to manual WhatsApp-to-Excel coordination.",
                severity="critical",
            ),
            DashboardAIFinding(
                title="Severe Communication Fragmentation",
                summary="Lead capture, broker status updates, and client communications are scattered across local files.",
                severity="high",
            ),
            DashboardAIFinding(
                title="High Broker Manual Overhead",
                summary="Brokers spend up to 18 hours per week manually typing status updates and chasing documents.",
                severity="medium",
            ),
        ],
    )
