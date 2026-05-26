from backend.schemas.workflow_schema import (
    AutomationRecommendation,
    ReactFlowEdge,
    ReactFlowEdgeData,
    ReactFlowNode,
    ReactFlowNodeData,
    ReactFlowPosition,
    WorkflowFindingInput,
    WorkflowGraph,
)


class WorkflowGraphBuilder:
    x_gap = 280
    y = 120

    def build_before_graph(self, findings: list[WorkflowFindingInput] | None = None) -> WorkflowGraph:
        if findings:
            return self._build_before_graph_from_findings(findings)

        labels = [
            ("whatsapp", "WhatsApp", "channel", "Inbound messages arrive in WhatsApp."),
            ("excel", "Excel", "manual_system", "Lead status is copied into spreadsheets."),
            ("manual_followup", "Manual Follow-Up", "manual_task", "Broker manually remembers and sends follow-ups."),
            ("lost_lead", "Lost Lead", "risk", "Delayed response creates revenue leakage."),
        ]
        return self._build_linear_graph(labels, animated=False)

    def build_after_graph(self, recommendations: list[AutomationRecommendation] | None = None) -> WorkflowGraph:
        if recommendations:
            return self._build_after_graph_from_recommendations(recommendations)

        labels = [
            ("whatsapp", "WhatsApp", "channel", "Inbound buyer messages remain the starting point."),
            ("ai_extraction", "AI Extraction", "automation", "Extract buyer intent, budget, location, and urgency."),
            ("crm_sync", "CRM Sync", "automation", "Create or update a single CRM record automatically."),
            ("automated_followup", "Auto Follow-Up", "automation", "Send contextual follow-ups and reminders."),
            ("lead_recovery", "Lead Recovery", "outcome", "Recover stalled leads with faster response loops."),
        ]
        return self._build_linear_graph(labels, animated=True)

    def _build_before_graph_from_findings(self, findings: list[WorkflowFindingInput]) -> WorkflowGraph:
        labels = [
            ("whatsapp", "WhatsApp", "channel", "Inbound customer and lead messages."),
            ("spreadsheet", "Spreadsheet Tracking", "manual_system", "Teams manually track work across files."),
        ]

        for index, finding in enumerate(findings[:4], start=1):
            labels.append(
                (
                    f"finding_{index}",
                    self._humanize_category(finding.category),
                    self._node_type_for_finding(finding.category),
                    finding.description,
                )
            )

        labels.append(("lost_revenue", "Lost Revenue Risk", "risk", "Operational delays create revenue leakage."))
        return self._build_linear_graph(labels, animated=False)

    def _build_after_graph_from_recommendations(
        self,
        recommendations: list[AutomationRecommendation],
    ) -> WorkflowGraph:
        labels = [
            ("whatsapp", "WhatsApp", "channel", "Inbound customer and lead messages."),
            ("ai_extraction", "AI Extraction", "automation", "Normalize messages into structured workflow events."),
        ]

        for recommendation in recommendations[:5]:
            labels.append(
                (
                    recommendation.id,
                    recommendation.title,
                    "automation",
                    recommendation.description,
                )
            )

        labels.append(("lead_recovery", "Lead Recovery", "outcome", "Recovered leads and cleaner operations."))
        return self._build_linear_graph(labels, animated=True)

    def _build_linear_graph(
        self,
        node_specs: list[tuple[str, str, str, str]],
        animated: bool,
    ) -> WorkflowGraph:
        nodes = [
            ReactFlowNode(
                id=node_id,
                position=ReactFlowPosition(x=index * self.x_gap, y=self.y),
                data=ReactFlowNodeData(
                    label=label,
                    node_type=node_type,
                    category=node_type,
                    severity="high" if node_type in {"risk", "manual_task"} else None,
                    description=description,
                ),
            )
            for index, (node_id, label, node_type, description) in enumerate(node_specs)
        ]

        edges = [
            ReactFlowEdge(
                id=f"{source_id}-{target_id}",
                source=source_id,
                target=target_id,
                label=self._edge_label(source_type, target_type),
                animated=animated,
                data=ReactFlowEdgeData(
                    label=self._edge_label(source_type, target_type),
                    delay_hours=8 if target_type in {"manual_task", "risk"} else 0.5,
                    risk="high" if target_type == "risk" else None,
                ),
            )
            for (source_id, _, source_type, _), (target_id, _, target_type, _) in zip(node_specs, node_specs[1:])
        ]

        return WorkflowGraph(nodes=nodes, edges=edges)

    def _edge_label(self, source_type: str, target_type: str) -> str:
        if target_type == "automation":
            return "automates"
        if target_type == "risk":
            return "leaks revenue"
        if source_type == "channel":
            return "copied into"
        return "hands off"

    def _humanize_category(self, category: str) -> str:
        return category.replace("_", " ").title()

    def _node_type_for_finding(self, category: str) -> str:
        if category in {"missed_follow_ups", "revenue_leakage_opportunities"}:
            return "risk"
        if category in {"repeated_manual_tasks", "duplicate_workflows"}:
            return "manual_task"
        if category == "operational_fragmentation":
            return "manual_system"
        return "bottleneck"
