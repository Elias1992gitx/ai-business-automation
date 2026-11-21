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
    const userId = context.user.id;
    const userEmail = context.user.email;

    const searchParams = req.nextUrl.searchParams;
    const filterEmail = searchParams.get("email") || (userEmail !== "elias@acme-operations.com" ? userEmail : undefined);
    const filterUserId = searchParams.get("user_id") || (userId !== "demo-user-elias" ? userId : undefined);
    const ownerOnly = searchParams.get("owner_only") === "true";

    const supabase = createAdminClient();
    let query = supabase
      .from("business_processes")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    // Scoped filtering for the logged-in user or workflow owner
    if (filterEmail) {
      query = query.or(`created_by.eq.${filterEmail},user_email.eq.${filterEmail}${filterUserId ? `,user_id.eq.${filterUserId}` : ""}`);
    } else if (ownerOnly && userEmail) {
      query = query.or(`created_by.eq.${userEmail},user_email.eq.${userEmail}${userId ? `,user_id.eq.${userId}` : ""}`);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return NextResponse.json({ processes: data });
    }

    // Isolated partition strictly for this workspace
    const isolatedList = workspaceProcessesStore.get(workspaceId) || [];
    let filteredList = isolatedList;

    if (filterEmail) {
      filteredList = isolatedList.filter(
        (p) =>
          p.created_by === filterEmail ||
          p.user_email === filterEmail ||
          p.user_id === filterUserId
      );
    } else if (ownerOnly && userEmail) {
      filteredList = isolatedList.filter(
        (p) =>
          p.created_by === userEmail ||
          p.user_email === userEmail ||
          p.user_id === userId
      );
    }

    return NextResponse.json({ processes: filteredList });
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
      category: body.category || "Operations",
      created_by: context.user.email,
      user_email: context.user.email,
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
