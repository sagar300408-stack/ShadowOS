from datetime import datetime, timezone
from uuid import UUID
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import Response

from backend.schemas.unified_analysis_schema import UnifiedAnalysisResult
from backend.schemas.analysis_schema import AnalyzeRequest
from backend.services.operational_intelligence_service import OperationalIntelligenceEngine
from backend.services.workflow_generation_service import WorkflowGenerationService
from backend.services.pdf_report_service import PDFReportService
from backend.schemas.workflow_schema import WorkflowFindingInput
from backend.schemas.executive_report_schema import ExecutiveImpactReport
from backend.store import STORE

router = APIRouter(tags=["Analysis"])
intelligence_engine = OperationalIntelligenceEngine()
workflow_service = WorkflowGenerationService()


@router.get("/analysis/{upload_id}", response_model=UnifiedAnalysisResult)
async def get_unified_analysis(upload_id: str) -> UnifiedAnalysisResult:
    upload_data = STORE.get(upload_id)
    if not upload_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Upload not found or has expired."
        )

    records = upload_data.get("normalized_data", [])
    dataset_type = upload_data.get("dataset_type", "Unknown")
    confidence_score = upload_data.get("confidence_score", 0.0)

    # 1. Generate Intelligence Dashboard Metrics & Findings
    request_payload = AnalyzeRequest(upload_id=UUID(upload_id), records=records)
    analyze_response = intelligence_engine.analyze(request_payload)

    # 2. Extract Primary Finding
    primary_finding = analyze_response.findings[0] if analyze_response.findings else None
    if not primary_finding:
        # Fallback if no findings
        from backend.schemas.analysis_schema import IntelligenceFinding
        primary_finding = IntelligenceFinding(
            category="operational_health",
            title="Operations appear healthy",
            description="No significant operational drag detected.",
            severity="low"
        )

    # 3. Generate Workflow & Recommendations (dynamic)
    # Convert IntelligenceFinding to WorkflowFindingInput
    workflow_findings = [
        WorkflowFindingInput(
            category=f.category,
            title=f.title,
            description=f.description,
            severity=f.severity,
            estimated_hours_lost=0, # Need actual metrics from signals, but engine.analyze abstracts them. 
            estimated_revenue_leakage=0,
        )
        for f in analyze_response.findings
    ]
    # To get actual metrics for workflow_findings, let's get the raw signals directly:
    signals = intelligence_engine._run_analyzers(records)
    
    workflow_findings = [
        WorkflowFindingInput(
            category=s.category,
            title=s.title,
            description=s.description,
            severity=s.severity,
            estimated_hours_lost=s.estimated_hours_lost,
            estimated_revenue_leakage=s.estimated_revenue_leakage,
        )
        for s in signals
    ]
    
    workflow_response = workflow_service.generate(workflow_findings)

    # 4. Generate Executive Impact
    # Move business calculations here
    revenue_recovery = analyze_response.revenue_leakage_amount * (analyze_response.automation_potential_score / 100.0)
    manual_work_reduction_percent = analyze_response.automation_potential_score
    
    executive_impact = ExecutiveImpactReport(
        revenue_recovery_estimate=round(revenue_recovery, 2),
        manual_work_reduction_percent=round(manual_work_reduction_percent, 1),
        lead_recovery_conversion_increase=round(analyze_response.lead_drop_off_rate * 0.4, 1), # Example heuristic
        automation_opportunities_count=len(workflow_response.automation_recommendations),
        workflow_efficiency_increase=round(analyze_response.fragmentation_score * 0.8, 1),
        operational_risk_reduction=round(100 - analyze_response.operational_health_score, 1),
        chart_data=[
            {
                "name": "First Response",
                "before": round(analyze_response.average_follow_up_delay_days * 24 * 60, 1),
                "after": 5, 
                "unit": " min"
            },
            {
                "name": "Weekly Ops Hours",
                "before": round(analyze_response.manual_workload_hours, 1),
                "after": round(analyze_response.manual_workload_hours * (1 - (analyze_response.automation_potential_score / 100.0)), 1),
                "unit": " hrs"
            },
            {
                "name": "Handoff Delays",
                "before": round(analyze_response.fragmentation_score * 0.5, 1),
                "after": 0.5,
                "unit": " hrs"
            }
        ]
    )

    from backend.schemas.dashboard_schema import DashboardMetricsResponse, DashboardAIFinding
    
    # We need to map `analyze_response` to `DashboardMetricsResponse` structure.
    dashboard = DashboardMetricsResponse(
        inefficiency_score=100 - analyze_response.operational_health_score,
        revenue_leakage_estimate=analyze_response.revenue_leakage_amount,
        time_waste_estimate=analyze_response.manual_workload_hours,
        repeated_task_count=analyze_response.bottleneck_count,
        workflow_fragmentation_score=analyze_response.fragmentation_score,
        automation_potential=analyze_response.automation_potential_score,
        automation_opportunities=[], # We use workflow_response.automation_recommendations separately
        ai_findings=[
            DashboardAIFinding(
                title=f.title,
                summary=f.description,
                severity=f.severity,
            ) for f in analyze_response.findings
        ]
    )

    try:
        result = UnifiedAnalysisResult(
            analysis_id=f"analysis_{upload_id}",
            upload_id=upload_id,
            created_at=datetime.now(timezone.utc).isoformat(),
            dataset_type=dataset_type,
            confidence_score=confidence_score,
            supported_analyzers=[a.__class__.__name__ for a in intelligence_engine.analyzers],
            analysis_explanations=[f"Processed {len(records)} records from uploaded dataset."],
            primary_finding=primary_finding,
            dashboard=dashboard,
            workflow=workflow_response,
            recommendations=workflow_response.automation_recommendations,
            executive_impact=executive_impact,
        )
    except Exception as e:
        import logging
        logging.error(f"UnifiedAnalysisResult validation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis structure validation failed: {str(e)}"
        )

    return result


@router.get("/analysis/{upload_id}/export")
async def export_unified_analysis(upload_id: str):
    analysis_result = await get_unified_analysis(upload_id)
    pdf_bytes = PDFReportService.generate_blueprint_pdf(analysis_result)
    
    timestamp = int(datetime.now(timezone.utc).timestamp())
    filename = f"shadowos-operational-blueprint-{timestamp}.pdf"
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )

