import { createAdminClient } from "@/src/lib/supabase/server";
import { findWorkflowInStores, findProcessInStores } from "./workspace.service";

export class ApprovalService {
  async approveWorkflow(
    workflowId: string,
    userId?: string
  ): Promise<{ success: boolean; error?: string }> {
    // 1. Update in-memory workflow and process status
    const inMemWf = findWorkflowInStores(workflowId);
    if (inMemWf) {
      inMemWf.status = "approved";
      inMemWf.approved_at = new Date().toISOString();
      inMemWf.approved_by = userId ?? "Elias Chane";
    }

    const processId = inMemWf?.process_id || workflowId;
    const inMemProc = findProcessInStores(processId);
    if (inMemProc) {
      inMemProc.status = "approved";
    }

    try {
      const supabase = createAdminClient();

      const { data: wf } = await supabase
        .from("workflows")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: userId ?? "Elias Chane",
        })
        .eq("id", workflowId)
        .select("process_id")
        .maybeSingle();

      const targetProcId = wf?.process_id || processId;
      if (targetProcId) {
        await supabase
          .from("business_processes")
          .update({ status: "approved" })
          .eq("id", targetProcId);
      }

      return { success: true };
    } catch {
      return { success: true };
    }
  }

  async rejectWorkflow(
    workflowId: string,
    _userId?: string
  ): Promise<{ success: boolean; error?: string }> {
    // 1. Update in-memory workflow and process status
    const inMemWf = findWorkflowInStores(workflowId);
    if (inMemWf) {
      inMemWf.status = "rejected";
    }

    const processId = inMemWf?.process_id || workflowId;
    const inMemProc = findProcessInStores(processId);
    if (inMemProc) {
      inMemProc.status = "rejected";
    }

    try {
      const supabase = createAdminClient();

      const { data: wf } = await supabase
        .from("workflows")
        .update({
          status: "rejected",
        })
        .eq("id", workflowId)
        .select("process_id")
        .maybeSingle();

      const targetProcId = wf?.process_id || processId;
      if (targetProcId) {
        await supabase
          .from("business_processes")
          .update({ status: "rejected" })
          .eq("id", targetProcId);
      }

      return { success: true };
    } catch {
      return { success: true };
    }
  }
}

export const approvalService = new ApprovalService();
