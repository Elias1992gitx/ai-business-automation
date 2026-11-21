// Recommendation generation prompt for Gemini AI

interface RecommendationPromptInput {
  processTitle: string;
  analysisOverview: string;
  bottlenecks: string[];
  stages: string[];
}

export function buildRecommendationPrompt(
  input: RecommendationPromptInput
): string {
  return `You are an expert automation consultant. Based on the following business process analysis, generate prioritized automation recommendations.

Process: ${input.processTitle}
Analysis Overview: ${input.analysisOverview}
Identified Bottlenecks: ${input.bottlenecks.join(", ")}
Process Stages: ${input.stages.join(", ")}

For each recommendation provide:
1. Clear title and rationale
2. Expected operational benefit
3. Implementation complexity (low/medium/high)
4. Impact level (low/medium/high)
5. Risk level (low/medium/high)
6. Dependencies required
7. Risks and mitigations
8. Whether it is suitable for automation (vs. should remain human-led)

Separate automation candidates from decisions that must remain human-led.
Return ONLY valid JSON matching the provided schema.`;
}

