from backend.models.operational_intelligence import IntelligenceSignal
from backend.schemas.workflow_schema import AutomationRecommendation


class AutomationRecommendationGenerator:
    def generate(self, findings: list[IntelligenceSignal]) -> list[AutomationRecommendation]:
        categories = {finding.category for finding in findings}
        recommendations: list[AutomationRecommendation] = []

        if {"operational_fragmentation", "duplicate_workflows"} & categories:
            recommendations.append(
                AutomationRecommendation(
                    id="crm-sync",
                    title="CRM sync",
                    type="crm_sync",
                    description="Sync WhatsApp, spreadsheets, and support records into a single CRM timeline.",
                    solves=["operational_fragmentation", "duplicate_workflows"],
                    priority="high",
                    expected_impact="Creates one source of truth and reduces duplicate updates.",
                )
            )

        if {"missed_follow_ups", "revenue_leakage_opportunities"} & categories:
            recommendations.extend(
                [
                    AutomationRecommendation(
                        id="lead-routing",
                        title="Lead routing",
                        type="lead_routing",
                        description="Assign inbound leads to the right broker by location, availability, and lead value.",
                        solves=["missed_follow_ups", "revenue_leakage_opportunities"],
                        priority="critical",
                        expected_impact="Reduces first-response delay for high-intent buyers.",
                    ),
                    AutomationRecommendation(
                        id="follow-up-automation",
                        title="Follow-up automation",
                        type="follow_up_automation",
                        description="Trigger WhatsApp and email follow-ups when leads go idle or miss required documents.",
                        solves=["missed_follow_ups"],
                        priority="critical",
                        expected_impact="Recovers stalled leads before they become lost opportunities.",
                    ),
                ]
            )

        if "duplicate_workflows" in categories:
            recommendations.append(
                AutomationRecommendation(
                    id="duplicate-detection",
                    title="Duplicate detection",
                    type="duplicate_detection",
                    description="Detect repeated lead, task, and ticket records before teams work the same item twice.",
                    solves=["duplicate_workflows", "repeated_manual_tasks"],
                    priority="medium",
                    expected_impact="Reduces rework and keeps ownership clear.",
                )
            )

        if {"repeated_manual_tasks", "time_waste_opportunities"} & categories:
            recommendations.append(
                AutomationRecommendation(
                    id="reminder-system",
                    title="Reminder systems",
                    type="reminder_system",
                    description="Create scheduled reminders for pending site visits, documents, payments, and callbacks.",
                    solves=["repeated_manual_tasks", "time_waste_opportunities"],
                    priority="high",
                    expected_impact="Cuts manual chasing and status-check loops.",
                )
            )

        if {"workflow_bottlenecks", "operational_fragmentation"} & categories:
            recommendations.append(
                AutomationRecommendation(
                    id="escalation-system",
                    title="Escalation systems",
                    type="escalation_system",
                    description="Escalate stalled records when SLA thresholds are breached or ownership is unclear.",
                    solves=["workflow_bottlenecks", "operational_fragmentation"],
                    priority="high",
                    expected_impact="Prevents silent delays in broker assignment, support, and document collection.",
                )
            )

        return self._dedupe(recommendations)

    def generate_default(self) -> list[AutomationRecommendation]:
        demo_findings = [
            IntelligenceSignal(
                category="missed_follow_ups",
                title="Missed follow-ups",
                description="Leads are not contacted on time.",
                severity="high",
                score_impact=20,
            ),
            IntelligenceSignal(
                category="operational_fragmentation",
                title="Fragmented workflow",
                description="Work is spread across WhatsApp and Excel.",
                severity="high",
                score_impact=18,
            ),
            IntelligenceSignal(
                category="duplicate_workflows",
                title="Duplicate workflows",
                description="Teams repeat the same lead status work.",
                severity="medium",
                score_impact=12,
            ),
            IntelligenceSignal(
                category="time_waste_opportunities",
                title="Time waste",
                description="Manual chasing creates avoidable effort.",
                severity="medium",
                score_impact=10,
            ),
            IntelligenceSignal(
                category="workflow_bottlenecks",
                title="Bottlenecks",
                description="Approvals and handoffs are slow.",
                severity="high",
                score_impact=16,
            ),
        ]
        return self.generate(demo_findings)

    def _dedupe(self, recommendations: list[AutomationRecommendation]) -> list[AutomationRecommendation]:
        seen: set[str] = set()
        unique: list[AutomationRecommendation] = []

        for recommendation in recommendations:
            if recommendation.id in seen:
                continue
            seen.add(recommendation.id)
            unique.append(recommendation)

        return unique

