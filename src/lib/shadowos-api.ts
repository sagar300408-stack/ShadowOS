export type UploadMetadata = {
  upload_id: string;
  filename: string;
  content_type: string;
  file_type: "csv" | "excel";
  size_bytes: number;
  status: "received" | "validated" | "rejected";
  uploaded_at: string;
};

export type UploadResponse = {
  message: string;
  metadata: UploadMetadata;
};

export type DashboardAutomationOpportunity = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical" | string;
  impact: string;
};

export type DashboardAIFinding = {
  title: string;
  summary: string;
  severity: "low" | "medium" | "high" | "critical" | string;
};

export type DashboardMetrics = {
  inefficiency_score: number;
  revenue_leakage_estimate: number;
  time_waste_estimate: number;
  repeated_task_count: number;
  workflow_fragmentation_score: number;
  automation_opportunities: DashboardAutomationOpportunity[];
  ai_findings: DashboardAIFinding[];
};

export type WorkflowNodeData = {
  label: string;
  node_type: string;
  category?: string | null;
  severity?: string | null;
  owner?: string | null;
  description?: string | null;
};

export type WorkflowNode = {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: WorkflowNodeData;
};

export type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
  type: string;
  label?: string | null;
  animated: boolean;
  data: {
    label?: string | null;
    delay_hours: number;
    risk?: string | null;
  };
};

export type WorkflowGraph = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

export type WorkflowResponse = {
  before: WorkflowGraph;
  after: WorkflowGraph;
  automation_recommendations: Array<{
    id: string;
    title: string;
    type: string;
    description: string;
    solves: string[];
    priority: string;
    expected_impact: string;
  }>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function uploadWorkflowFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      typeof errorBody?.detail === "string"
        ? errorBody.detail
        : "Upload failed. Confirm the backend is running and the file is valid.";
    throw new Error(message);
  }

  return response.json() as Promise<UploadResponse>;
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Dashboard telemetry is unavailable. Confirm the backend is running.");
  }

  return response.json() as Promise<DashboardMetrics>;
}

export async function fetchWorkflowGraph(): Promise<WorkflowResponse> {
  const response = await fetch(`${API_BASE_URL}/workflow`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Workflow graph is unavailable. Confirm the backend is running.");
  }

  return response.json() as Promise<WorkflowResponse>;
}
