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
  automation_potential: number;
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

export type ChartDataPoint = {
  name: string;
  before: number;
  after: number;
  unit: string;
};

export type ExecutiveImpactReport = {
  revenue_recovery_estimate: number;
  manual_work_reduction_percent: number;
  lead_recovery_conversion_increase: number;
  automation_opportunities_count: number;
  workflow_efficiency_increase: number;
  operational_risk_reduction: number;
  chart_data: ChartDataPoint[];
};

export type UnifiedAnalysisResult = {
  analysis_id: string;
  upload_id: string;
  created_at: string;
  dataset_type: string;
  confidence_score: number;
  supported_analyzers: string[];
  analysis_explanations: string[];
  
  primary_finding: {
    category: string;
    title: string;
    description: string;
    severity: string;
  };
  dashboard: DashboardMetrics;
  workflow: WorkflowResponse;
  recommendations: WorkflowResponse["automation_recommendations"];
  executive_impact: ExecutiveImpactReport;
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

export async function fetchUnifiedAnalysis(uploadId: string): Promise<UnifiedAnalysisResult> {
  const url = `${API_BASE_URL}/analysis/${encodeURIComponent(uploadId)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = typeof errorBody?.detail === "string"
      ? errorBody.detail
      : "Analysis telemetry is unavailable. Confirm the backend is running.";
    throw new Error(message);
  }

  return response.json() as Promise<UnifiedAnalysisResult>;
}
