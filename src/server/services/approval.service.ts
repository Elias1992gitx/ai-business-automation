export class ApprovalService {
  async approveWorkflow(_workflowId: string, _userId: string): Promise<{ success: boolean }> {
    return { success: true };
  }

  async rejectWorkflow(_workflowId: string, _userId: string): Promise<{ success: boolean }> {
    return { success: true };
  }
}

export const approvalService = new ApprovalService();

