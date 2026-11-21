import { NextRequest, NextResponse } from "next/server";
import { emailClient } from "@/src/server/integrations/email/email.client";
import { settingsService } from "@/src/server/services/settings.service";
import { workspaceService } from "@/src/server/services/workspace.service";

export async function POST(req: NextRequest) {
  try {
    const context = await workspaceService.resolveCurrentWorkspace(req);
    const body = await req.json();
    const { to, senderName } = body;
    const settings = await settingsService.getSettings(context.workspace.id);
    const targetEmail = to || settings.recipientEmail || "elias@acme-operations.com";
    const status = emailClient.getStatus();
    const testId = `test-${Date.now()}`;

    const result = await emailClient.sendEmail({
      to: targetEmail,
      subject: `[AI-Business-Automation] Test Notification from ${senderName || settings.senderName || "AI-Business-Automation"}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background: #0a2540; padding: 20px 24px; color: #ffffff;">
            <h2 style="margin: 0; font-size: 18px; font-weight: 700;">AI-Business-Automation</h2>
            <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">Email Dispatch Test</p>
          </div>
          <div style="padding: 24px;">
            <div style="display: inline-block; padding: 4px 10px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 9999px; color: #065f46; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 14px;">
              ✓ Dispatch Pipeline Verified
            </div>
            <h3 style="margin: 0 0 10px; font-size: 16px; color: #0f172a;">Test Notification Confirmed</h3>
            <p style="margin: 0 0 16px; font-size: 13px; color: #475569; line-height: 1.5;">
              This test notification confirms that the email notification delivery pipeline is active and ready to dispatch workflow execution receipts to <strong>${targetEmail}</strong>.
            </p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 20px; font-size: 12px;">
              <div style="margin-bottom: 6px;"><strong>Recipient:</strong> ${targetEmail}</div>
              <div style="margin-bottom: 6px;"><strong>Provider:</strong> ${status.provider}</div>
              <div><strong>Reference ID:</strong> <span style="font-family: monospace;">${testId}</span></div>
            </div>
            <p style="margin: 0; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 14px;">
              Sent by AI-Business-Automation. Zero external side-effects run without explicit manager authorization.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      result,
      recipient: targetEmail,
      workspaceId: context.workspace.id,
      message: `Test email dispatched to ${targetEmail}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to dispatch test email" },
      { status: 500 }
    );
  }
}
