import { NextRequest, NextResponse } from "next/server";
import { settingsService } from "@/src/server/services/settings.service";
import { workspaceService } from "@/src/server/services/workspace.service";

export async function GET(req: NextRequest) {
  try {
    const context = await workspaceService.resolveCurrentWorkspace(req);
    const settings = await settingsService.getSettings(context.workspace.id);
    return NextResponse.json({ settings, workspace: context.workspace, success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await workspaceService.resolveCurrentWorkspace(req);
    const body = await req.json();
    const updated = await settingsService.updateSettings(context.workspace.id, body);
    return NextResponse.json({ settings: updated, workspace: context.workspace, success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
