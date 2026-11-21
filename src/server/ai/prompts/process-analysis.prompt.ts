// Process analysis prompt for Gemini AI
// Returns a structured prompt string given process details

interface ProcessAnalysisPromptInput {
  title: string;
  description: string;
  desired_outcome?: string | null;
  constraints?: string | null;
}

export function buildProcessAnalysisPrompt(
  input: ProcessAnalysisPromptInput
): string {
  return `You are an expert business process analyst. Analyze the following business process and return a structured JSON analysis.

Process Title: ${input.title}
Process Description: ${input.description}
${input.desired_outcome ? `Desired Outcome: ${input.desired_outcome}` : ""}
${input.constraints ? `Constraints: ${input.constraints}` : ""}

Analyze this process and identify:
1. Process overview summary
2. All stages, actors, inputs, outputs, triggers, and dependencies
3. Handoffs between stages and data exchanged
4. Bottlenecks: repetitive/manual tasks, delays, duplicated data entry, unclear ownership, failure points
5. Assumptions you are making (be explicit — do not present guesses as facts)
6. Information gaps that limit the analysis
7. Decision points that require human judgment

Return ONLY valid JSON matching the provided schema. Do not include any markdown, explanations, or text outside the JSON.`;
}

