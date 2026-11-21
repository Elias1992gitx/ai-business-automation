import { NextRequest, NextResponse } from "next/server";
import { emailClient } from "@/src/server/integrations/email/email.client";
import { settingsService } from "@/src/server/services/settings.service";
import { workspaceService } from "@/src/server/services/workspace.service";

export async function GET(req: NextRequest) {
  try {
    const context = await workspaceService.resolveCurrentWorkspace(req);
    const settings = await settingsService.getSettings(context.workspace.id);
    const status = emailClient.getStatus();
    const recentLogs = emailClient.getRecentEmails(10);

    return NextResponse.json({
      success: true,
      status,
      recipientEmail: settings.recipientEmail || "elias@acme-operations.com",
      senderName: settings.senderName || "AI-Business-Automation",
      includeTaskLink: settings.includeTaskLink ?? true,
      emailEnabled: settings.emailEnabled ?? true,
      workspaceId: context.workspace.id,
      recentLogs,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to load email integration info" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await workspaceService.resolveCurrentWorkspace(req);
    const body = await req.json();
    const { recipientEmail, senderName, includeTaskLink, emailEnabled } = body;

    const updated = await settingsService.updateSettings(context.workspace.id, {
      ...(recipientEmail ? { recipientEmail } : {}),
      ...(senderName ? { senderName } : {}),
      ...(typeof includeTaskLink === "boolean" ? { includeTaskLink } : {}),
      ...(typeof emailEnabled === "boolean" ? { emailEnabled } : {}),
    });

    return NextResponse.json({
      success: true,
      settings: updated,
      workspaceId: context.workspace.id,
      message: "Email routing configuration saved successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update email integration settings" },
      { status: 500 }
    );
  }
}
