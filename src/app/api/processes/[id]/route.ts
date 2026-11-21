import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/src/lib/supabase/server";
import {
  workspaceService,
  workspaceProcessesStore,
} from "@/src/server/services/workspace.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await workspaceService.resolveCurrentWorkspace(req);
    const workspaceId = context.workspace.id;

    const supabase = createAdminClient();

    const { data: process, error } = await supabase
      .from("business_processes")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && process) {
      // Validate workspace authorization
      if (process.workspace_id && process.workspace_id !== workspaceId) {
        return NextResponse.json(
          { error: "Unauthorized. Cross-workspace access is forbidden." },
          { status: 403 }
        );
      }
      return NextResponse.json({ process });
    }

    // Check in-memory partitioned store
    const list = workspaceProcessesStore.get(workspaceId) || [];
    const found = list.find((p) => p.id === id);
    if (found) {
      return NextResponse.json({ process: found });
    }

    // Check if it exists in another workspace's in-memory store
    for (const [wsId, items] of workspaceProcessesStore.entries()) {
      if (wsId !== workspaceId && items.some((p) => p.id === id)) {
        return NextResponse.json(
          { error: "Unauthorized. Cross-workspace access is forbidden." },
          { status: 403 }
        );
      }
    }

    // Default demo fallback only for demo workspace
    if (workspaceId === "ws-acme-ops") {
      return NextResponse.json({
        process: {
          id,
          workspace_id: "ws-acme-ops",
          title: "Service request coordination",
          description:
            "Our operations team receives service requests, manually categorizes them, assigns tasks to employees, and sends follow-up messages to check completion.",
          status: "analyzed",
        },
      });
    }

    return NextResponse.json({ error: "Process not found in this workspace" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch process" },
      { status: 500 }
    );
  }
}
