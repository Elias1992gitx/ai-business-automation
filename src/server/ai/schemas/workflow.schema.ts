import { ACTION_TYPES } from "@/src/lib/constants";

const ALLOWED_ACTION_TYPES = Object.values(ACTION_TYPES);

export const workflowStepSchema = {
  id: "string",
  order: "number",
  name: "string",
  description: "string",
  action_type: `${ALLOWED_ACTION_TYPES.join(" | ")}`,
  inputs: "Record<string, unknown>",
  conditions: "WorkflowCondition[]?",
  requires_approval: "boolean",
};

export const workflowDefinitionSchema = {
  trigger: "string",
  required_inputs: "string[]",
  steps: "WorkflowStep[]",
  expected_result: "string",
};

// TODO: Replace with proper Zod schema validation
export function validateWorkflowDefinition(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (typeof d.trigger !== "string") return false;
  if (!Array.isArray(d.steps)) return false;

  // Validate each step uses only allowed action types
  for (const step of d.steps as Record<string, unknown>[]) {
    const stepAction = typeof step.action_type === "string" ? step.action_type : "";
    if (!ALLOWED_ACTION_TYPES.includes(stepAction as (typeof ALLOWED_ACTION_TYPES)[number])) {
      return false;
    }
  }
  return true;
}

