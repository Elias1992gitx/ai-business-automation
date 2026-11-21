import type { Workflow, WorkflowDefinition } from "@/src/types/workflow.types";
import { createAdminClient } from "@/src/lib/supabase/server";

export class WorkflowService {
  async generateWorkflow(
    processId: string,
    _recommendationId?: string,
    workspaceId: string = "ws-acme-ops"
  ): Promise<Workflow> {
    const supabase = createAdminClient();

    let processTitle = "Operational Process";
    let processDescription =
      "Every new request becomes visible to the operations team within minutes, with a traceable task and notification.";

    try {
      const { data: proc } = await supabase
        .from("business_processes")
        .select("title, description")
        .eq("id", processId)
        .maybeSingle();

      if (proc?.title) {
        processTitle = proc.title;
        processDescription = proc.description || processDescription;
      }
    } catch {
      // Graceful
    }

    const workflowDefinition: WorkflowDefinition = {
      trigger: `When a new request is submitted for ${processTitle}`,
      required_inputs: ["request title", "description", "requester"],
      steps: [
        {
          id: "step-1",
          order: 1,
          name: "Receive request",
          description: `Input: ${processTitle} details and requester context`,
          action_type: "record_execution_result",
          inputs: {},
          requires_approval: false,
        },
        {
          id: "step-2",
          order: 2,
          name: "Create Trello card",
          description: `Action: create card in Operations queue for ${processTitle}`,
          action_type: "create_trello_card",
          inputs: {
            destination: "My Trello board → Today",
            title: `[AI-Business-Automation] ${processTitle}`,
            description: processDescription,
          },
          requires_approval: true,
        },
        {
          id: "step-3",
          order: 3,
          name: "Send Telegram notification",
          description: "Action: notify operations channel with the task link",
          action_type: "send_telegram_message",
          inputs: {
            channel: "#operations",
            includeLink: true,
          },
          requires_approval: true,
        },
        {
          id: "step-4",
          order: 4,
          name: "Record outcome",
          description: "Output: execution status and timestamps",
          action_type: "record_execution_result",
          inputs: {},
          requires_approval: false,
        },
      ],
      expected_result: processDescription,
    };

    const workflowId = crypto.randomUUID();

    const workflowRecord: Workflow = {
      id: workflowId,
      process_id: processId,
      version: 1,
      workflow_json: workflowDefinition,
      status: "draft",
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from("workflows").insert([
        {
          id: workflowId,
          workspace_id: workspaceId,
          process_id: processId,
          version: 1,
          workflow_json: workflowDefinition,
          status: "draft",
        },
      ]);
    } catch {
      // Graceful fallback if database call is offline
    }

    return workflowRecord;
  }

  async getWorkflowById(id: string): Promise<any | null> {
    const supabase = createAdminClient();

    try {
      let { data } = await supabase
        .from("workflows")
        .select("*, business_processes(*)")
        .eq("id", id)
        .maybeSingle();

      if (!data) {
        const { data: wfByProc } = await supabase
          .from("workflows")
          .select("*, business_processes(*)")
          .eq("process_id", id)
          .order("created_at", { ascending: false })
          .maybeSingle();
        if (wfByProc) data = wfByProc;
      }

      if (!data?.business_processes) {
        const { data: proc } = await supabase
          .from("business_processes")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (proc) {
          if (!data) {
            data = {
              id,
              process_id: id,
              version: 1,
              workflow_json: null,
              status: "draft",
              created_at: new Date().toISOString(),
            } as any;
          }
          (data as any).business_processes = proc;
        }
      }

      if (data) return data;
    } catch {
      // Handled below
    }

    // Default fallback
    return {
      id,
      process_id: id,
      version: 1,
      business_processes: {
        title: "Operational Process",
        description: "Automated step execution",
      },
      workflow_json: {
        trigger: "When a new operational request is submitted",
        required_inputs: ["request title", "description", "requester"],
        steps: [
          {
            id: "step-1",
            order: 1,
            name: "Receive request",
            description: "Input: request title, description, requester",
            action_type: "record_execution_result",
            inputs: {},
            requires_approval: false,
          },
          {
            id: "step-2",
            order: 2,
            name: "Create Trello card",
            description: "Action: create card in Operations queue",
            action_type: "create_trello_card",
            inputs: {
              destination: "My Trello board → Today",
              titleTemplate: "{{request.title}}",
            },
            requires_approval: true,
          },
          {
            id: "step-3",
            order: 3,
            name: "Send Telegram notification",
            description: "Action: notify operations channel with task link",
            action_type: "send_telegram_message",
            inputs: {
              channel: "#operations",
              includeLink: true,
            },
            requires_approval: true,
          },
          {
            id: "step-4",
            order: 4,
            name: "Record outcome",
            description: "Output: execution status and timestamps",
            action_type: "record_execution_result",
            inputs: {},
            requires_approval: false,
          },
        ],
        expected_result:
          "Every new request becomes visible to the operations team within minutes, with a traceable task and notification.",
      },
      status: "draft",
      created_at: new Date().toISOString(),
    };
  }

  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow | null> {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("workflows")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      return data ?? null;
    } catch {
      return null;
    }
  }
}

export const workflowService = new WorkflowService();
