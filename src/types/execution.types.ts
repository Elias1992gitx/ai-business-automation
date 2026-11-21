export type ExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "partially_completed"
  | "failed";

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  idempotency_key: string;
  status: ExecutionStatus;
  started_at: string;
  completed_at?: string | null;
  error_summary?: string | null;
  execution_steps?: any[];
  trelloCardUrl?: string;
}

export interface ExecutionStep {
  id: string;
  execution_id: string;
  action_type: string;
  status: ExecutionStatus;
  external_reference?: string | null;
  result_json?: Record<string, unknown> | null;
  error_summary?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ExecutionWithSteps extends WorkflowExecution {
  steps: ExecutionStep[];
}

