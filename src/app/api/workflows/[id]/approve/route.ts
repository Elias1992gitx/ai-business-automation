import { NextRequest, NextResponse } from "next/server";
import { approvalService } from "@/src/server/services/approval.service";
import { workflowService } from "@/src/server/services/workflow.service";
import { workspaceService } from "@/src/server/services/workspace.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await workspaceService.resolveCurrentWorkspace(req);
    const workflow = await workflowService.getWorkflowById(id);

    if (workflow && workflow.workspace_id && workflow.workspace_id !== context.workspace.id) {
      return NextResponse.json(
        { error: "Unauthorized. Cross-workspace approval is forbidden." },
        { status: 403 }
      );
    }

    const result = await approvalService.approveWorkflow(id);

    return NextResponse.json({
      success: true,
      approved: true,
      workflowId: id,
      workspaceId: context.workspace.id,
      result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to approve workflow" },
      { status: 500 }
    );
  }
}
