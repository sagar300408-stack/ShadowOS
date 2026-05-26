from fastapi import APIRouter

from backend.schemas.workflow_schema import WorkflowEdge, WorkflowGraph, WorkflowNode, WorkflowNodeType, WorkflowResponse


router = APIRouter(tags=["Workflow"])


@router.get("/workflow", response_model=WorkflowResponse)
async def get_workflow() -> WorkflowResponse:
    before_nodes = [
        WorkflowNode(id="lead_received", label="Lead received", type=WorkflowNodeType.trigger, owner="Sales"),
        WorkflowNode(id="manual_assignment", label="Manual broker assignment", type=WorkflowNodeType.task, owner="Manager", bottleneck=True),
        WorkflowNode(id="whatsapp_followup", label="WhatsApp follow-up", type=WorkflowNodeType.task, owner="Broker", bottleneck=True),
        WorkflowNode(id="site_visit", label="Site visit scheduled", type=WorkflowNodeType.outcome, owner="Sales"),
    ]
    before_edges = [
        WorkflowEdge(source="lead_received", target="manual_assignment", label="Assign lead", average_delay_hours=4.0),
        WorkflowEdge(source="manual_assignment", target="whatsapp_followup", label="Contact buyer", average_delay_hours=8.5),
        WorkflowEdge(source="whatsapp_followup", target="site_visit", label="Book visit", average_delay_hours=12.0),
    ]
    after_nodes = [
        WorkflowNode(id="lead_received", label="Lead received", type=WorkflowNodeType.trigger, owner="Sales"),
        WorkflowNode(id="auto_assignment", label="Auto-assign broker", type=WorkflowNodeType.automation, owner="ShadowOS"),
        WorkflowNode(id="auto_followup", label="Automated WhatsApp follow-up", type=WorkflowNodeType.automation, owner="ShadowOS"),
        WorkflowNode(id="site_visit", label="Site visit scheduled", type=WorkflowNodeType.outcome, owner="Sales"),
    ]
    after_edges = [
        WorkflowEdge(source="lead_received", target="auto_assignment", label="Route by location and availability", average_delay_hours=0.1),
        WorkflowEdge(source="auto_assignment", target="auto_followup", label="Send personalized response", average_delay_hours=0.2),
        WorkflowEdge(source="auto_followup", target="site_visit", label="Confirm visit slot", average_delay_hours=2.0),
    ]

    before_workflow = WorkflowGraph(nodes=before_nodes, edges=before_edges)
    after_workflow = WorkflowGraph(nodes=after_nodes, edges=after_edges)

    return WorkflowResponse(
        workflow_graph=after_workflow,
        nodes=after_nodes,
        edges=after_edges,
        before_workflow=before_workflow,
        after_workflow=after_workflow,
    )

