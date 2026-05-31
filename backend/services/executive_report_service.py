import json
import os
from openai import AsyncOpenAI
from pydantic import ValidationError

from backend.schemas.analysis_schema import AnalyzeResponse
from backend.schemas.executive_report_schema import ExecutiveImpactReport

SYSTEM_PROMPT = """
You are a senior business operations consultant and workflow architect.
Your job is to analyze structured operational metrics and output an executive intelligence report.

Your output must be grounded STRICTLY in the provided metrics. DO NOT hallucinate numbers.
Maintain a professional, executive-friendly, and slightly urgent tone.
Explain why findings matter (e.g. how they impact revenue or efficiency).

The ShadowOS philosophy is: "ShadowOS doesn't just analyze operations. It understands how businesses operate and reveals where intelligence should be deployed."

Provide the response in perfectly valid JSON matching the following schema exactly:
{
  "executive_summary": "A 2-3 sentence high-level business summary.",
  "intelligence_verdict": "The core verdict or 'bottom line' conclusion in 1-2 sentences.",
  "key_findings": ["finding 1", "finding 2"],
  "operational_risks": ["risk 1", "risk 2"],
  "automation_recommendations": ["recommendation 1", "recommendation 2"]
}
"""


from dotenv import load_dotenv

load_dotenv()

class ExecutiveReportGenerator:
    def __init__(self):
        # We assume OPENAI_API_KEY is available in the environment or .env
        api_key = os.environ.get("OPENAI_API_KEY")
        self.client = AsyncOpenAI(api_key=api_key) if api_key and api_key != "your_openai_api_key_here" else None

    async def generate(self, report: AnalyzeResponse) -> ExecutiveImpactReport:
        if not self.client:
            # Fallback mock for testing if no key is provided
            return ExecutiveImpactReport(
                executive_summary="[MOCK] Operations are suffering from manual workflow fragmentation.",
                intelligence_verdict="[MOCK] Automated routing must be deployed immediately.",
                key_findings=["[MOCK] Finding 1", "[MOCK] Finding 2"],
                operational_risks=["[MOCK] Risk 1"],
                automation_recommendations=["[MOCK] Recommendation 1"]
            )
            
        metrics_json = report.model_dump_json()
        
        user_prompt = f"Analyze the following operational intelligence report and generate the executive narrative:\n\n{metrics_json}"

        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.3,
        )

        content = response.choices[0].message.content
        if not content:
            raise ValueError("OpenAI returned an empty response.")
        
        parsed_data = json.loads(content)
        return ExecutiveImpactReport(**parsed_data)
