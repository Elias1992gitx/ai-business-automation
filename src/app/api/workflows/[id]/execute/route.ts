import { NextRequest, NextResponse } from "next/server";
import { executionService } from "@/src/server/services/execution.service";
import { workspaceService } from "@/src/server/services/workspace.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await workspaceService.resolveCurrentWorkspace(req);
    let idempotencyKey: string | undefined;

    try {
      const body = await req.json();
      idempotencyKey = body.idempotencyKey;
    } catch {
      // Body optional
    }

    const execution = await executionService.executeWorkflow(
      id,
      idempotencyKey,
      context.workspace.id,
      context.user
    );

    return NextResponse.json({
      success: true,
      executionId: execution.id,
      workflowId: id,
      workspaceId: context.workspace.id,
      trelloCardUrl: execution.trelloCardUrl,
      execution,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to execute workflow" },
      { status: 500 }
    );
  }
}
