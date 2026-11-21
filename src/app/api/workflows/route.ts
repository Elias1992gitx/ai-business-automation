import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/src/lib/supabase/server";
import {
  workspaceService,
  workspaceWorkflowsStore,
} from "@/src/server/services/workspace.service";

export async function GET(req: NextRequest) {
  try {
    const context = await workspaceService.resolveCurrentWorkspace(req);
    const workspaceId = context.workspace.id;

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("workflows")
      .select("*, business_processes(*)")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ workflows: data });
    }

    // Isolated partition strictly for this workspace (empty array for fresh workspaces)
    const isolatedList = workspaceWorkflowsStore.get(workspaceId) || [];
    return NextResponse.json({ workflows: isolatedList });
  } catch {
    return NextResponse.json({ workflows: [] });
  }
}
