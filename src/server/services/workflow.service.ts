import type { Workflow, WorkflowDefinition } from "@/src/types/workflow.types";
import { createAdminClient } from "@/src/lib/supabase/server";
import {
  findProcessInStores,
  findWorkflowInStores,
  saveWorkflowToStore,
  workspaceProcessesStore,
} from "./workspace.service";

export class WorkflowService {
  async generateWorkflow(
    processId: string,
    _recommendationId?: string,
    workspaceId: string = "ws-acme-ops"
  ): Promise<Workflow> {
    const supabase = createAdminClient();

    // 1. Multi-tier business process lookup
    let proc: any = null;
    try {
      const { data } = await supabase
        .from("business_processes")
        .select("*")
        .eq("id", processId)
        .maybeSingle();

      if (data) proc = data;
    } catch {
      // Graceful
    }

    if (!proc) {
      proc = findProcessInStores(processId, workspaceId);
    }

    // Fallback: If still not found, retrieve the newest process in this workspace
    if (!proc && workspaceId && workspaceProcessesStore.has(workspaceId)) {
      const recents = workspaceProcessesStore.get(workspaceId);
      if (recents && recents.length > 0) {
        proc = recents[0];
      }
    }

    const processTitle = proc?.title || "Operational Process";
    const processDescription =
      proc?.description ||
      "Every new request becomes visible to the operations team within minutes, with a traceable task and notification.";
    const category = proc?.category || "Operations";
    const desiredOutcome = proc?.desired_outcome || "";
    const constraints = proc?.constraints || "";
    const requester = proc?.created_by || proc?.user_email || "Operations User";

    const workflowDefinition: WorkflowDefinition = {
      trigger: `When a new request is submitted for "${processTitle}"`,
      required_inputs: ["request title", "description", "requester"],
      steps: [
        {
          id: "step-1",
          order: 1,
          name: "Receive request",
          description: `Input: ${processTitle} details & requester context`,
          action_type: "record_execution_result",
          inputs: {
            title: processTitle,
            description: processDescription,
            requester,
          },
          requires_approval: false,
        },
        {
          id: "step-2",
          order: 2,
          name: "Create Trello card",
          description: `Action: create card in Operations queue for "${processTitle}"`,
          action_type: "create_trello_card",
          inputs: {
            destination: "My Trello board → Today",
            title: `[AI-Business-Automation] ${processTitle}`,
            description: [
              `### 📋 Process: ${processTitle}`,
              `**Category:** ${category}`,
              `**Owner / Requester:** ${requester}`,
              ``,
              `### 📝 Process Description`,
              `${processDescription}`,
              desiredOutcome ? `\n### 🎯 Desired Outcome\n${desiredOutcome}` : "",
              constraints ? `\n### ⚠️ Constraints & Requirements\n${constraints}` : "",
            ]
              .filter(Boolean)
              .join("\n"),
          },
          requires_approval: true,
        },
        {
          id: "step-3",
          order: 3,
          name: "Send Telegram notification",
          description: `Action: notify operations channel with "${processTitle}" task link`,
          action_type: "send_telegram_message",
          inputs: {
            channel: "#operations",
            includeLink: true,
            title: processTitle,
          },
          requires_approval: true,
        },
        {
          id: "step-4",
          order: 4,
          name: "Send Email notification",
          description: `Action: deliver execution confirmation to workflow owner (${requester})`,
          action_type: "send_email",
          inputs: {
            to: requester,
            subject: `[AI-Business-Automation] Approved Execution: ${processTitle}`,
          },
          requires_approval: true,
        },
        {
          id: "step-5",
          order: 5,
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

    const workflowRecord: any = {
      id: workflowId,
      workspace_id: workspaceId,
      process_id: proc?.id || processId,
      user_id: proc?.user_id,
      created_by: proc?.created_by || proc?.user_email || requester,
      owner_email: proc?.created_by || proc?.user_email || requester,
      version: 1,
      workflow_json: workflowDefinition,
      status: "awaiting_approval",
      created_at: new Date().toISOString(),
      business_processes: proc
        ? {
            id: proc.id,
            title: proc.title,
            description: proc.description,
            category: proc.category || "Operations",
            desired_outcome: proc.desired_outcome,
            constraints: proc.constraints,
            user_id: proc.user_id,
            created_by: proc.created_by,
          }
        : {
            title: processTitle,
            description: processDescription,
          },
    };

    // Save to memory store first for immediate consistency
    saveWorkflowToStore(workspaceId, workflowRecord);

    try {
      await supabase.from("workflows").insert([
        {
          id: workflowId,
          workspace_id: workspaceId,
          process_id: proc?.id || processId,
          version: 1,
          workflow_json: workflowDefinition,
          status: "awaiting_approval",
        },
      ]);
    } catch {
      // Graceful fallback if database call is offline
    }

    return workflowRecord;
  }

  async getWorkflowById(id: string): Promise<any | null> {
    const supabase = createAdminClient();

    // 1. Try Supabase lookup
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

      if (data?.business_processes) {
        return data;
      }

      if (data && !data.business_processes) {
        const proc =
          findProcessInStores(data.process_id) ||
          findProcessInStores(id);
        if (proc) {
          (data as any).business_processes = proc;
          return data;
        }
      }
    } catch {
      // Handled below
    }

    // 2. Try in-memory store lookup
    const inMem = findWorkflowInStores(id);
    if (inMem) {
      if (!inMem.business_processes) {
        const proc =
          findProcessInStores(inMem.process_id) ||
          findProcessInStores(id);
        if (proc) inMem.business_processes = proc;
      }
      return inMem;
    }

    // 3. Check if id is a business process ID directly
    const directProc = findProcessInStores(id);
    if (directProc) {
      return {
        id,
        process_id: directProc.id,
        workspace_id: directProc.workspace_id || "ws-acme-ops",
        version: 1,
        status: "awaiting_approval",
        business_processes: directProc,
        workflow_json: {
          trigger: `When a new request is submitted for "${directProc.title}"`,
          required_inputs: ["request title", "description", "requester"],
          steps: [
            {
              id: "step-1",
              order: 1,
              name: "Receive request",
              description: `Input: ${directProc.title} details`,
              action_type: "record_execution_result",
              inputs: {},
              requires_approval: false,
            },
            {
              id: "step-2",
              order: 2,
              name: "Create Trello card",
              description: `Action: create card in Operations queue for "${directProc.title}"`,
              action_type: "create_trello_card",
              inputs: {
                destination: "My Trello board → Today",
                title: `[AI-Business-Automation] ${directProc.title}`,
                description: directProc.description,
              },
              requires_approval: true,
            },
            {
              id: "step-3",
              order: 3,
              name: "Send Telegram notification",
              description: `Action: notify operations channel with task link`,
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
          expected_result: directProc.description,
        },
        created_at: new Date().toISOString(),
      };
    }

    // 4. Fallback default
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
    const inMem = findWorkflowInStores(id);
    if (inMem) {
      Object.assign(inMem, updates);
    }

    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("workflows")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      return data ?? inMem ?? null;
    } catch {
      return inMem ?? null;
    }
  }
}

export const workflowService = new WorkflowService();
