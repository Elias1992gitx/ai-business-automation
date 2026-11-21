import { NextRequest, NextResponse } from "next/server";
import { executionService } from "@/src/server/services/execution.service";
import { workspaceService } from "@/src/server/services/workspace.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await workspaceService.resolveCurrentWorkspace(req);
    const execution = await executionService.getExecutionById(id);

    if (!execution) {
      return NextResponse.json({ error: "Execution not found" }, { status: 404 });
    }

    if (execution.workspace_id && execution.workspace_id !== context.workspace.id) {
      return NextResponse.json(
        { error: "Unauthorized. Cross-workspace access is forbidden." },
        { status: 403 }
      );
    }

    return NextResponse.json({ execution, workspaceId: context.workspace.id });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to get execution" },
      { status: 500 }
    );
  }
}
