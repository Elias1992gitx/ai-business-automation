import { NextRequest, NextResponse } from "next/server";
import { executionService } from "@/src/server/services/execution.service";
import { workspaceService } from "@/src/server/services/workspace.service";

export async function GET(req: NextRequest) {
  try {
    const context = await workspaceService.resolveCurrentWorkspace(req);
    const executions = await executionService.listExecutions(context.workspace.id);
    return NextResponse.json({ executions, workspaceId: context.workspace.id });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to list executions" },
      { status: 500 }
    );
  }
}
