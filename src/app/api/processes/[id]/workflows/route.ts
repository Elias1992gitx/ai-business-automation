import { NextRequest, NextResponse } from "next/server";
import { workflowService } from "@/src/server/services/workflow.service";
import { workspaceService } from "@/src/server/services/workspace.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await workspaceService.resolveCurrentWorkspace(req);
    const workflow = await workflowService.generateWorkflow(
      id,
      undefined,
      context.workspace.id
    );

    return NextResponse.json({
      success: true,
      workflowId: workflow.id,
      processId: id,
      workspaceId: context.workspace.id,
      workflow,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to generate workflow" },
      { status: 500 }
    );
  }
}
