import { ACTION_TYPES } from "@/src/lib/constants";

export type ActionType = (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES];

export interface WorkflowStep {
  id: string;
  order: number;
  name: string;
  description: string;
  action_type: ActionType;
  inputs: Record<string, unknown>;
  conditions?: WorkflowCondition[];
  requires_approval: boolean;
}

export interface WorkflowCondition {
  field: string;
  operator: "eq" | "neq" | "gt" | "lt" | "contains";
  value: unknown;
}

export interface WorkflowDefinition {
  trigger: string;
  required_inputs: string[];
  steps: WorkflowStep[];
  expected_result: string;
}

export interface Workflow {
  id: string;
  process_id: string;
  version: number;
  workflow_json: WorkflowDefinition;
  status: "draft" | "approved" | "executed" | "cancelled";
  approved_by?: string | null;
  approved_at?: string | null;
  created_at: string;
  updated_at?: string;
}

// Action parameter shapes
export interface CreateTrelloCardParams {
  title: string;
  description: string;
  list_id: string;
  due_date?: string | null;
}

export interface SendTelegramMessageParams {
  chat_id: string;
  message: string;
}

