import type { Workflow } from "@/src/types/workflow.types";

export class WorkflowService {
  async generateWorkflow(_processId: string, _recommendationId: string): Promise<Workflow | null> {
    return null;
  }

  async getWorkflowById(_id: string): Promise<Workflow | null> {
    return null;
  }

  async updateWorkflow(_id: string, _updates: Partial<Workflow>): Promise<Workflow | null> {
    return null;
  }
}

export const workflowService = new WorkflowService();

