import type { WorkflowExecution } from "@/src/types/execution.types";

export class ExecutionService {
  async executeWorkflow(_workflowId: string, _idempotencyKey?: string): Promise<WorkflowExecution | null> {
    return null;
  }

  async getExecutionById(_id: string): Promise<WorkflowExecution | null> {
    return null;
  }
}

export const executionService = new ExecutionService();

