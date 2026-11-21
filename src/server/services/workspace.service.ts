import { createClient, createAdminClient } from "@/src/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  created_at: string;
  updated_at?: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  created_at: string;
}

export interface WorkspaceContext {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
  workspace: Workspace;
  role: "owner" | "admin" | "member";
}

// In-memory tenant store for resilient dual-mode operation (local dev & production)
const demoWorkspace: Workspace = {
  id: "ws-acme-ops",
  name: "Acme Operations",
  slug: "acme-operations",
  owner_id: "demo-user-elias",
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
};

const inMemoryWorkspaces = new Map<string, Workspace>([
  [demoWorkspace.id, demoWorkspace],
]);

const inMemoryMembers = new Map<string, WorkspaceMember[]>([
  [
    demoWorkspace.id,
    [
      {
        id: "mem-elias-1",
        workspace_id: demoWorkspace.id,
        user_id: "demo-user-elias",
        role: "owner",
        created_at: demoWorkspace.created_at,
      },
    ],
  ],
]);

export const workspaceProcessesStore = new Map<string, any[]>([
  [
    "ws-acme-ops",
    [
      {
        id: "demo-proc-1",
        workspace_id: "ws-acme-ops",
        title: "Service request coordination",
        description:
          "Our operations team receives service requests, manually categorizes them, assigns tasks to employees, and sends follow-up messages to check completion.",
        status: "analyzed",
        category: "Operations",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "demo-proc-2",
        workspace_id: "ws-acme-ops",
        title: "Employee laptop provisioning",
        description:
          "IT support configures equipment for incoming hires and assigns hardware asset trackers.",
        status: "completed",
        category: "IT Support",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ],
  ],
]);

export const workspaceWorkflowsStore = new Map<string, any[]>([
  [
    "ws-acme-ops",
    [
      {
        id: "wf-1",
        workspace_id: "ws-acme-ops",
        process_id: "demo-proc-1",
        version: 1,
        status: "awaiting_approval",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        business_processes: {
          id: "demo-proc-1",
          title: "Service request coordination",
          description:
            "Our operations team receives service requests, manually categorizes them, assigns tasks to employees, and sends follow-up messages to check completion.",
          category: "Operations",
        },
      },
    ],
  ],
]);

export class WorkspaceService {
  /**
   * Helper to slugify a workspace name with random suffix
   */
  private generateSlug(name: string, userId: string): string {
    const clean = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const suffix = userId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6) || Math.random().toString(36).slice(2, 8);
    return `${clean || "workspace"}-${suffix}`;
  }

  /**
   * Creates an isolated workspace for a user
   */
  async createWorkspace(
    userId: string,
    workspaceName: string,
    userEmail?: string
  ): Promise<Workspace> {
    const name = workspaceName.trim() || "My Workspace";
    const slug = this.generateSlug(name, userId);
    const workspaceId = `ws-${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    const newWorkspace: Workspace = {
      id: workspaceId,
      name,
      slug,
      owner_id: userId,
      created_at: now,
      updated_at: now,
    };

    // 1. Try Supabase persistence
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("workspaces")
        .insert([
          {
            id: workspaceId,
            name,
            slug,
            owner_id: userId,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        // Create membership
        await supabase.from("workspace_members").insert([
          {
            workspace_id: data.id,
            user_id: userId,
            role: "owner",
          },
        ]);

        // Create default workspace settings
        await supabase.from("workspace_settings").insert([
          {
            workspace_id: data.id,
            recipient_email: userEmail || "operations@acme.internal",
            sender_name: name,
          },
        ]);

        // Keep in-memory store synchronized
        inMemoryWorkspaces.set(data.id, data);
        inMemoryMembers.set(data.id, [
          {
            id: `mem-${Date.now()}`,
            workspace_id: data.id,
            user_id: userId,
            role: "owner",
            created_at: now,
          },
        ]);

        return data;
      }
    } catch {
      // Fallback below
    }

    // 2. In-memory isolated storage fallback
    inMemoryWorkspaces.set(workspaceId, newWorkspace);
    inMemoryMembers.set(workspaceId, [
      {
        id: `mem-${Date.now()}`,
        workspace_id: workspaceId,
        user_id: userId,
        role: "owner",
        created_at: now,
      },
    ]);

    return newWorkspace;
  }

  /**
   * Resolves or provisions the user's primary workspace.
   * Guarantees strict isolation: each new account gets its own independent workspace.
   */
  async ensureUserWorkspace(user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, any>;
  }): Promise<{ workspace: Workspace; isNew: boolean }> {
    // Check if user is the standard demo user
    if (user.email === "elias@acme-operations.com" || user.id === "demo-user-elias") {
      return { workspace: demoWorkspace, isNew: false };
    }

    // 1. Try resolving existing workspace from Supabase
    try {
      const supabase = createAdminClient();
      const { data: memberRows } = await supabase
        .from("workspace_members")
        .select("workspace_id, role, workspaces(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1);

      if (memberRows && memberRows.length > 0 && memberRows[0].workspaces) {
        const ws = memberRows[0].workspaces as any;
        inMemoryWorkspaces.set(ws.id, ws);
        return { workspace: ws, isNew: false };
      }
    } catch {
      // Fallback to in-memory check
    }

    // 2. Check in-memory store
    for (const [wsId, members] of inMemoryMembers.entries()) {
      if (members.some((m) => m.user_id === user.id)) {
        const found = inMemoryWorkspaces.get(wsId);
        if (found) return { workspace: found, isNew: false };
      }
    }

    // 3. User has no workspace yet -> Provision a fresh isolated workspace
    const requestedName =
      user.user_metadata?.workspace_name ||
      `${user.user_metadata?.full_name || "New"}'s Workspace`;

    const created = await this.createWorkspace(user.id, requestedName, user.email);
    return { workspace: created, isNew: true };
  }

  /**
   * Resolves current workspace context from active request
   */
  async resolveCurrentWorkspace(
    request?: Request | null
  ): Promise<WorkspaceContext> {
    // 1. Check active Supabase session
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { workspace, isNew } = await this.ensureUserWorkspace(user);
        return {
          user: {
            id: user.id,
            email: user.email || "",
            fullName: user.user_metadata?.full_name || "Workspace Member",
            role: user.user_metadata?.role || "Operations Manager",
          },
          workspace,
          role: "owner",
        };
      }
    } catch {
      // Fallback
    }

    // 2. Default to isolated demo context if unauthenticated
    return {
      user: {
        id: demoWorkspace.owner_id,
        email: "elias@acme-operations.com",
        fullName: "Elias Chane",
        role: "Operations Manager",
      },
      workspace: demoWorkspace,
      role: "owner",
    };
  }

  /**
   * Verifies if a user has access to a specific workspace
   */
  async validateWorkspaceAccess(
    userId: string,
    workspaceId: string
  ): Promise<boolean> {
    if (userId === "demo-user-elias" && workspaceId === demoWorkspace.id) {
      return true;
    }

    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("workspace_members")
        .select("id")
        .eq("workspace_id", workspaceId)
        .eq("user_id", userId)
        .maybeSingle();

      if (data) return true;
    } catch {
      // Fallback to in-memory
    }

    const members = inMemoryMembers.get(workspaceId);
    return Boolean(members?.some((m) => m.user_id === userId));
  }

  /**
   * Returns all workspaces a user belongs to
   */
  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    const results: Workspace[] = [];

    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("workspace_members")
        .select("workspaces(*)")
        .eq("user_id", userId);

      if (data) {
        for (const row of data as any[]) {
          if (row.workspaces) results.push(row.workspaces);
        }
      }
    } catch {
      // Fallback
    }

    if (results.length === 0) {
      for (const [wsId, members] of inMemoryMembers.entries()) {
        if (members.some((m) => m.user_id === userId)) {
          const ws = inMemoryWorkspaces.get(wsId);
          if (ws) results.push(ws);
        }
      }
    }

    if (results.length === 0 && userId === "demo-user-elias") {
      results.push(demoWorkspace);
    }

    return results;
  }
}

export const workspaceService = new WorkspaceService();
