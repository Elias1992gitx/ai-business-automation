import { NextRequest, NextResponse } from "next/server";
import { workflowService } from "@/src/server/services/workflow.service";
import { workspaceService } from "@/src/server/services/workspace.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await workspaceService.resolveCurrentWorkspace(req);
    const workflow = await workflowService.getWorkflowById(id);

    if (workflow && workflow.workspace_id && workflow.workspace_id !== context.workspace.id) {
      return NextResponse.json(
        { error: "Unauthorized. Cross-workspace access is forbidden." },
        { status: 403 }
      );
    }

    return NextResponse.json({ workflow, id, workspaceId: context.workspace.id });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to load workflow" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await workspaceService.resolveCurrentWorkspace(req);
    const existing = await workflowService.getWorkflowById(id);

    if (existing && existing.workspace_id && existing.workspace_id !== context.workspace.id) {
      return NextResponse.json(
        { error: "Unauthorized. Cross-workspace modification is forbidden." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const updated = await workflowService.updateWorkflow(id, body);
    return NextResponse.json({ workflow: updated, id, workspaceId: context.workspace.id });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update workflow" },
      { status: 500 }
    );
  }
}
