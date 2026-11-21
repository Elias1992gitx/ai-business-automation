import { createAdminClient } from "@/src/lib/supabase/server";

export interface NotificationSettings {
  trelloEnabled: boolean;
  telegramEnabled: boolean;
  emailEnabled: boolean;
  recipientEmail?: string;
  senderName?: string;
  includeTaskLink?: boolean;
  theme: "light" | "dark" | "system";
  managerName: string;
  updatedAt: string;
}

// Default settings template for Acme Operations
const defaultDemoSettings: NotificationSettings = {
  trelloEnabled: true,
  telegramEnabled: true,
  emailEnabled: true,
  recipientEmail: "elias@acme-operations.com",
  senderName: "AI-Business-Automation",
  includeTaskLink: true,
  theme: "light",
  managerName: "Elias Chane",
  updatedAt: new Date().toISOString(),
};

// Isolated in-memory settings store partitioned strictly by workspace ID
const workspaceSettingsStore = new Map<string, NotificationSettings>([
  ["ws-acme-ops", { ...defaultDemoSettings }],
]);

export class SettingsService {
  /**
   * Retrieves isolated settings for a given workspace
   */
  async getSettings(workspaceId: string = "ws-acme-ops"): Promise<NotificationSettings> {
    // 1. Try Supabase workspace_settings table
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("workspace_settings")
        .select("*")
        .eq("workspace_id", workspaceId)
        .maybeSingle();

      if (!error && data) {
        const mapped: NotificationSettings = {
          trelloEnabled: data.trello_enabled ?? true,
          telegramEnabled: data.telegram_enabled ?? true,
          emailEnabled: data.email_enabled ?? true,
          recipientEmail: data.recipient_email || undefined,
          senderName: data.sender_name || "AI-Business-Automation",
          includeTaskLink: true,
          theme: (data.theme as any) || "light",
          managerName: data.sender_name || "Operations Manager",
          updatedAt: data.updated_at || new Date().toISOString(),
        };
        workspaceSettingsStore.set(workspaceId, mapped);
        return mapped;
      }
    } catch {
      // Fallback to in-memory store
    }

    // 2. Return partitioned in-memory store or create isolated defaults
    if (!workspaceSettingsStore.has(workspaceId)) {
      const cleanDefault: NotificationSettings = {
        trelloEnabled: true,
        telegramEnabled: true,
        emailEnabled: true,
        recipientEmail: undefined,
        senderName: "AI-Business-Automation",
        includeTaskLink: true,
        theme: "light",
        managerName: "Operations Manager",
        updatedAt: new Date().toISOString(),
      };
      workspaceSettingsStore.set(workspaceId, cleanDefault);
    }

    return { ...workspaceSettingsStore.get(workspaceId)! };
  }

  /**
   * Updates settings strictly for a given workspace
   */
  async updateSettings(
    workspaceId: string = "ws-acme-ops",
    updates: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    const current = await this.getSettings(workspaceId);
    const updated: NotificationSettings = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // 1. Try Supabase upsert
    try {
      const supabase = createAdminClient();
      await supabase.from("workspace_settings").upsert({
        workspace_id: workspaceId,
        trello_enabled: updated.trelloEnabled,
        telegram_enabled: updated.telegramEnabled,
        email_enabled: updated.emailEnabled,
        recipient_email: updated.recipientEmail,
        sender_name: updated.senderName,
        theme: updated.theme,
        updated_at: updated.updatedAt,
      });
    } catch {
      // Fallback to in-memory store
    }

    // 2. Store in isolated in-memory map
    workspaceSettingsStore.set(workspaceId, updated);
    return { ...updated };
  }
}

export const settingsService = new SettingsService();
