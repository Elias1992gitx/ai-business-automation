// Workflow generation prompt for Gemini AI

import { ACTION_TYPES } from "@/src/lib/constants";

interface WorkflowGenerationPromptInput {
  processTitle: string;
  recommendationTitle: string;
  recommendationRationale: string;
  allowedActionTypes: string[];
}

const ALLOWED_ACTIONS = Object.values(ACTION_TYPES).join(", ");

export function buildWorkflowGenerationPrompt(
  input: WorkflowGenerationPromptInput
): string {
  return `You are an expert workflow designer for AI-Business-Automation. Generate an executable workflow based on the following automation recommendation.

Process: ${input.processTitle}
Recommendation: ${input.recommendationTitle}
Rationale: ${input.recommendationRationale}

IMPORTANT CONSTRAINTS:
- You may ONLY use these action types: ${ALLOWED_ACTIONS}
- Do NOT invent new action types, tools, or arbitrary API calls
- Do NOT include actions that execute shell commands, arbitrary URLs, or unvalidated external calls
- Each step must have a clear approval requirement flag
- The workflow must require explicit user approval before any external action

Generate a workflow with:
1. A clear trigger condition
2. Required inputs list
3. Ordered steps with action_type, inputs, conditions, and approval requirements
4. Expected result description

Return ONLY valid JSON matching the provided schema.`;
}

