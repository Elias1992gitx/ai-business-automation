import { NextRequest, NextResponse } from "next/server";
import { validateProcessInput } from "@/src/server/validation/api-validation";
import { createAdminClient } from "@/src/lib/supabase/server";
import {
  workspaceService,
  workspaceProcessesStore,
} from "@/src/server/services/workspace.service";

export async function GET(req: NextRequest) {
  try {
    const context = await workspaceService.resolveCurrentWorkspace(req);
    const workspaceId = context.workspace.id;

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("business_processes")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ processes: data });
    }

    // Isolated partition strictly for this workspace (empty array for fresh workspaces)
    const isolatedList = workspaceProcessesStore.get(workspaceId) || [];
    return NextResponse.json({ processes: isolatedList });
  } catch {
    return NextResponse.json({ processes: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await workspaceService.resolveCurrentWorkspace(req);
    const workspaceId = context.workspace.id;
    const userId = context.user.id;

    const body = await req.json();
    const { title, description, desired_outcome, constraints, action } = body;

    const validation = validateProcessInput({
      title,
      description,
      desired_outcome,
      constraints,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    const processPayload = {
      workspace_id: workspaceId,
      user_id: userId,
      title,
      description,
      desired_outcome: desired_outcome ?? null,
      constraints: constraints ?? null,
      status: action === "analyze" ? "analyzed" : "draft",
    };

    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("business_processes")
        .insert([processPayload])
        .select()
        .single();

      if (!error && data) {
        const list = workspaceProcessesStore.get(workspaceId) || [];
        workspaceProcessesStore.set(workspaceId, [data, ...list]);
        return NextResponse.json({ process: data }, { status: 201 });
      }
    } catch {
      // Fallback to in-memory store
    }

    const fallbackProcess = {
      id: crypto.randomUUID(),
      ...processPayload,
      created_at: new Date().toISOString(),
    };

    const list = workspaceProcessesStore.get(workspaceId) || [];
    workspaceProcessesStore.set(workspaceId, [fallbackProcess, ...list]);

    return NextResponse.json({ process: fallbackProcess }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to process intake request" },
      { status: 500 }
    );
  }
}
