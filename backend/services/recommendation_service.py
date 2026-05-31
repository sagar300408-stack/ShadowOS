from backend.schemas.analysis_schema import AnalyzeResponse
from backend.schemas.recommendation_schema import (
    AutomationRecommendation,
    Priority,
    RecommendationsResponse,
)


class RecommendationEngine:
    HOURLY_RATE = 50.0  # $50/hour for manual work recovery

    def generate(self, report: AnalyzeResponse) -> RecommendationsResponse:
        recommendations = []

        # Rule 1: Lead Follow-Up Agent
        if report.average_follow_up_delay_days > 1 or report.lead_drop_off_rate > 10.0:
            confidence = min(
                (report.average_follow_up_delay_days * 10) + (report.lead_drop_off_rate * 2), 100
            )
            recovery = report.revenue_leakage_amount * 0.25  # Assume 25% recovery of leaked revenue
            recommendations.append(
                AutomationRecommendation(
                    title="Lead Follow-Up Agent",
                    current_problem=f"Average follow-up delay is {report.average_follow_up_delay_days} days with a {report.lead_drop_off_rate}% drop-off rate.",
                    proposed_automation="Deploy an agent to trigger immediate automated responses and periodic check-ins.",
                    priority=Priority.high if confidence > 50 else Priority.medium,
                    confidence_score=round(confidence, 1),
                    estimated_business_impact="High: Recovers lost leads by engaging prospects within 5 minutes.",
                    implementation_complexity="medium",
                    potential_recovery_value=round(recovery, 2),
                )
            )

        # Rule 2: CRM Sync Agent / Duplicate Detection
        if report.fragmentation_score > 0:
            confidence = min(report.fragmentation_score * 5 + 40, 100)
            # Assume recovering 30% of manual hours due to eliminating double data entry across systems
            recovery = (report.manual_workload_hours * 0.3) * self.HOURLY_RATE
            recommendations.append(
                AutomationRecommendation(
                    title="CRM Sync Agent",
                    current_problem=f"High system fragmentation (Score: {report.fragmentation_score}) causing duplicate entry and data silos.",
                    proposed_automation="Implement real-time sync across systems to maintain a single source of truth.",
                    priority=Priority.medium,
                    confidence_score=round(confidence, 1),
                    estimated_business_impact="Medium: Eliminates double entry and improves data consistency.",
                    implementation_complexity="high",
                    potential_recovery_value=round(recovery, 2),
                )
            )

        # Rule 3: Escalation Workflow
        if report.bottleneck_count > 0:
            confidence = min(report.bottleneck_count * 20 + 30, 100)
            # Assume unblocking a bottleneck recovers $500 of potential value or time
            recovery = report.bottleneck_count * 500.0
            recommendations.append(
                AutomationRecommendation(
                    title="Escalation Workflow",
                    current_problem=f"Detected {report.bottleneck_count} workflow bottlenecks stuck without progress.",
                    proposed_automation="Automatically escalate aged tasks to managers or re-assign based on capacity.",
                    priority=Priority.high if report.bottleneck_count > 2 else Priority.medium,
                    confidence_score=round(confidence, 1),
                    estimated_business_impact="High: Reduces SLA breaches and unblocks frozen revenue.",
                    implementation_complexity="low",
                    potential_recovery_value=round(recovery, 2),
                )
            )

        # Rule 4: Data Entry Automation
        if report.manual_workload_hours > 0:
            confidence = min(report.manual_workload_hours * 10 + 50, 100)
            # Assume we can automate 70% of the manual data entry
            recovery = (report.manual_workload_hours * 0.7) * self.HOURLY_RATE
            recommendations.append(
                AutomationRecommendation(
                    title="Data Entry Automation",
                    current_problem=f"Estimated {report.manual_workload_hours} hours wasted on manual repetitive tasks.",
                    proposed_automation="Use OCR or direct API ingestions to parse inputs and fill out tracking sheets automatically.",
                    priority=Priority.high if report.manual_workload_hours > 5 else Priority.low,
                    confidence_score=round(confidence, 1),
                    estimated_business_impact="Medium: Frees up staff to focus on high-value closing activities.",
                    implementation_complexity="medium",
                    potential_recovery_value=round(recovery, 2),
                )
            )

        # Sort recommendations by highest recovery value, then confidence
        recommendations.sort(key=lambda x: (x.potential_recovery_value, x.confidence_score), reverse=True)

        return RecommendationsResponse(automation_recommendations=recommendations)
