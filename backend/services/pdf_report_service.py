import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.colors import HexColor
import logging

from backend.schemas.unified_analysis_schema import UnifiedAnalysisResult


def safe_get(obj, *fields, default="N/A"):
    """Safely get a field from an object or dict, trying multiple fields in order."""
    if obj is None:
        return default
    
    for field in fields:
        # Try as dict key
        if isinstance(obj, dict) and field in obj:
            val = obj[field]
            if val is not None:
                return val
        
        # Try as attribute
        if hasattr(obj, field):
            val = getattr(obj, field)
            if val is not None:
                return val
                
    return default


class PDFReportService:
    @staticmethod
    def generate_blueprint_pdf(analysis: UnifiedAnalysisResult) -> bytes:
        # Debugging hook as requested
        try:
            print("PDF Export Debug:", analysis.model_dump())
        except Exception as e:
            print("PDF Export Debug Failed:", str(e))
            
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72,
            title="Operational Blueprint"
        )

        styles = getSampleStyleSheet()
        
        # Create some custom styling overrides
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Title'],
            fontSize=24,
            spaceAfter=30,
            textColor=HexColor("#0f172a")
        )
        
        heading1_style = ParagraphStyle(
            'CustomHeading1',
            parent=styles['Heading1'],
            fontSize=18,
            spaceAfter=16,
            textColor=HexColor("#0891b2") # Cyan-600
        )
        
        heading2_style = ParagraphStyle(
            'CustomHeading2',
            parent=styles['Heading2'],
            fontSize=14,
            spaceBefore=12,
            spaceAfter=8,
            textColor=HexColor("#334155")
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=8,
            leading=16,
            textColor=HexColor("#1e293b")
        )

        elements = []
        
        def add_error_msg(section_name):
            elements.append(Paragraph(f"Data unavailable for this section. ({section_name})", normal_style))
            elements.append(Spacer(1, 12))

        # --- PAGE 1: EXECUTIVE SCORECARD ---
        try:
            elements.append(Paragraph("ShadowOS Operational Blueprint", title_style))
            elements.append(Paragraph("EXECUTIVE SCORECARD", heading1_style))
            elements.append(Spacer(1, 24))
            
            dashboard = safe_get(analysis, 'dashboard', default={})
            impact = safe_get(analysis, 'executive_impact', default={})
            primary = safe_get(analysis, 'primary_finding', default={})
            
            inefficiency = safe_get(dashboard, 'inefficiency_score', default=0)
            health_score = 100 - float(inefficiency) if str(inefficiency).replace('.', '', 1).isdigit() else "N/A"
            
            automation_potential = safe_get(impact, 'manual_work_reduction_percent', 'automation_potential', default=0)
            revenue_leakage = safe_get(dashboard, 'revenue_leakage_estimate', default=0)
            
            severity = str(safe_get(primary, 'severity', default="N/A")).capitalize()
            confidence = safe_get(analysis, 'confidence_score', default=0)
            conf_percent = int(float(confidence) * 100) if str(confidence).replace('.', '', 1).isdigit() else "N/A"
            
            elements.append(Paragraph(f"<b>Operational Health Score:</b> {health_score}/100", normal_style))
            elements.append(Spacer(1, 8))
            elements.append(Paragraph(f"<b>Revenue Exposure:</b> ₹{revenue_leakage:,}" if isinstance(revenue_leakage, (int, float)) else f"<b>Revenue Exposure:</b> {revenue_leakage}", normal_style))
            elements.append(Spacer(1, 8))
            elements.append(Paragraph(f"<b>Automation Potential:</b> {automation_potential}%", normal_style))
            elements.append(Spacer(1, 8))
            elements.append(Paragraph(f"<b>Workflow Risk:</b> {severity}", normal_style))
            elements.append(Spacer(1, 8))
            elements.append(Paragraph(f"<b>Confidence Score:</b> {conf_percent}%", normal_style))
        except Exception as e:
            logging.error(f"Error in PAGE 1: {e}")
            add_error_msg("Executive Scorecard")
            
        elements.append(PageBreak())

        # --- PAGE 2: EXECUTIVE SUMMARY ---
        try:
            elements.append(Paragraph("Executive Summary", heading1_style))
            
            date_str = str(safe_get(analysis, 'created_at', default="N/A"))
            if "T" in date_str:
                try:
                    date_str = datetime.fromisoformat(date_str).strftime('%Y-%m-%d %H:%M:%S')
                except ValueError:
                    pass
                    
            dataset_type = safe_get(analysis, 'dataset_type', default="N/A")
            
            elements.append(Paragraph(f"<b>Analysis Date:</b> {date_str}", normal_style))
            elements.append(Paragraph(f"<b>Dataset Type:</b> {dataset_type}", normal_style))
            elements.append(Paragraph(f"<b>Confidence Score:</b> {conf_percent}%", normal_style))
            elements.append(Spacer(1, 12))
            
            title = safe_get(primary, 'title', 'name', default="N/A")
            elements.append(Paragraph(f"<b>Primary Finding:</b> {title}", normal_style))
            elements.append(Paragraph(f"<b>Severity:</b> {severity}", normal_style))
            elements.append(Spacer(1, 12))
            
            summary_desc = safe_get(primary, 'summary', 'description', 'finding', default="Data unavailable.")
            elements.append(Paragraph("<b>Executive Overview:</b>", heading2_style))
            elements.append(Paragraph(str(summary_desc), normal_style))
        except Exception as e:
            logging.error(f"Error in PAGE 2: {e}")
            add_error_msg("Executive Summary")
            
        elements.append(PageBreak())

        # --- PAGE 3: OPERATIONAL INTELLIGENCE FINDINGS ---
        try:
            elements.append(Paragraph("Operational Intelligence Findings", heading1_style))
            
            dashboard = safe_get(analysis, 'dashboard', default={})
            rev_leak = safe_get(dashboard, 'revenue_leakage_estimate', default=0)
            time_waste = safe_get(dashboard, 'time_waste_estimate', default="N/A")
            recs = safe_get(analysis, 'recommendations', default=[])
            
            elements.append(Paragraph(f"<b>Revenue Leakage:</b> ₹{rev_leak:,}" if isinstance(rev_leak, (int, float)) else f"<b>Revenue Leakage:</b> {rev_leak}", normal_style))
            elements.append(Paragraph(f"<b>Manual Tasks (Time Waste):</b> {time_waste} hrs/week", normal_style))
            elements.append(Paragraph(f"<b>Automation Opportunities:</b> {len(recs) if hasattr(recs, '__len__') else 'N/A'}", normal_style))
            elements.append(Spacer(1, 16))
            
            elements.append(Paragraph("<b>Key AI Findings:</b>", heading2_style))
            ai_findings = safe_get(dashboard, 'ai_findings', default=[])
            if ai_findings:
                for finding in ai_findings:
                    f_title = safe_get(finding, 'title', 'name', default="N/A")
                    f_desc = safe_get(finding, 'summary', 'description', default="N/A")
                    elements.append(Paragraph(f"<b>• {f_title}</b>: {f_desc}", normal_style))
            else:
                elements.append(Paragraph("No specific findings recorded.", normal_style))
        except Exception as e:
            logging.error(f"Error in PAGE 3: {e}")
            add_error_msg("Operational Intelligence Findings")
            
        elements.append(PageBreak())
        
        # --- PAGE 4: WORKFLOW ANALYSIS ---
        try:
            elements.append(Paragraph("Workflow Analysis", heading1_style))
            
            workflow = safe_get(analysis, 'workflow', default={})
            cur_summary = safe_get(workflow, 'current_workflow_summary', 'summary_before', default="Data unavailable.")
            rec_summary = safe_get(workflow, 'recommended_workflow_summary', 'summary_after', default="Data unavailable.")
            
            elements.append(Paragraph("<b>Current Workflow Summary:</b>", heading2_style))
            elements.append(Paragraph(str(cur_summary), normal_style))
            
            elements.append(Paragraph("<b>Recommended Workflow Summary:</b>", heading2_style))
            elements.append(Paragraph(str(rec_summary), normal_style))
            
            elements.append(Paragraph("<b>Key Transformation Opportunities:</b>", heading2_style))
            transformations = safe_get(workflow, 'key_transformations', default=[])
            if transformations:
                for t in transformations:
                    elements.append(Paragraph(f"• {t}", normal_style))
            else:
                elements.append(Paragraph("Data unavailable.", normal_style))
        except Exception as e:
            logging.error(f"Error in PAGE 4: {e}")
            add_error_msg("Workflow Analysis")
            
        elements.append(PageBreak())

        # --- PAGE 5: AUTOMATION BLUEPRINT ---
        try:
            elements.append(Paragraph("Automation Blueprint", heading1_style))
            
            recs = safe_get(analysis, 'recommendations', default=[])
            if recs:
                for idx, rec in enumerate(recs, 1):
                    title = safe_get(rec, 'title', 'name', default="N/A")
                    elements.append(Paragraph(f"Recommendation {idx}: {title}", heading2_style))
                    
                    priority = safe_get(rec, 'priority', default="N/A")
                    priority_str = priority.value.capitalize() if hasattr(priority, 'value') else str(priority).capitalize()
                    elements.append(Paragraph(f"<b>Priority:</b> {priority_str}", normal_style))
                    
                    impact_text = safe_get(rec, 'expected_impact', 'impact', default="N/A")
                    elements.append(Paragraph(f"<b>Expected Impact:</b> {impact_text}", normal_style))
                    
                    pot_val = safe_get(rec, 'potential_recovery_value', 'recovery_value', default=None)
                    if pot_val:
                        elements.append(Paragraph(f"<b>Potential Recovery Value:</b> ₹{pot_val:,}" if isinstance(pot_val, (int, float)) else f"<b>Potential Recovery Value:</b> {pot_val}", normal_style))
                        
                    justification = safe_get(rec, 'current_problem', 'summary', 'description', 'business_justification', default="Improves operational efficiency.")
                    elements.append(Paragraph(f"<b>Business Justification:</b> {justification}", normal_style))
                    elements.append(Spacer(1, 12))
            else:
                elements.append(Paragraph("Data unavailable.", normal_style))
        except Exception as e:
            logging.error(f"Error in PAGE 5: {e}")
            add_error_msg("Automation Blueprint")
            
        elements.append(PageBreak())

        # --- PAGE 6: EXECUTIVE IMPACT REPORT ---
        try:
            elements.append(Paragraph("Executive Impact Report", heading1_style))
            
            impact = safe_get(analysis, 'executive_impact', default={})
            recov = safe_get(impact, 'revenue_recovery_estimate', default=0)
            work_red = safe_get(impact, 'manual_work_reduction_percent', default=0)
            wf_eff = safe_get(impact, 'workflow_efficiency_increase', default=0)
            lead_inc = safe_get(impact, 'lead_recovery_conversion_increase', default=0)
            risk_red = safe_get(impact, 'operational_risk_reduction', default=0)
            
            elements.append(Paragraph(f"<b>Revenue Recovery Estimate:</b> ₹{recov:,}" if isinstance(recov, (int, float)) else f"<b>Revenue Recovery Estimate:</b> {recov}", normal_style))
            elements.append(Paragraph(f"<b>Manual Work Reduction:</b> {work_red}%", normal_style))
            elements.append(Paragraph(f"<b>Workflow Efficiency Increase:</b> {wf_eff}%", normal_style))
            elements.append(Paragraph(f"<b>Lead Recovery Increase:</b> {lead_inc}%", normal_style))
            elements.append(Paragraph(f"<b>Operational Risk Reduction:</b> {risk_red}%", normal_style))
        except Exception as e:
            logging.error(f"Error in PAGE 6: {e}")
            add_error_msg("Executive Impact Report")
            
        # Build the document with a footer
        def add_footer(canvas, doc_obj):
            canvas.saveState()
            canvas.setFont('Helvetica', 9)
            canvas.setFillColor(HexColor("#94a3b8")) # slate-400
            canvas.drawString(72, 36, "Generated by ShadowOS | AI Powered Operational Intelligence Platform")
            canvas.drawRightString(letter[0] - 72, 36, f"Page {doc_obj.page}")
            canvas.restoreState()

        doc.build(elements, onFirstPage=add_footer, onLaterPages=add_footer)
        buffer.seek(0)
        return buffer.getvalue()
