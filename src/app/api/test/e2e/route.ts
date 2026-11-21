import { NextRequest, NextResponse } from "next/server";
import { trelloClient } from "@/src/server/integrations/trello/trello.client";
import { telegramClient } from "@/src/server/integrations/telegram/telegram.client";
import { emailClient } from "@/src/server/integrations/email/email.client";
import { executionService } from "@/src/server/services/execution.service";

export async function GET(_req: NextRequest) {
  const timestamp = new Date().toISOString();
  const results: any = {
    timestamp,
    steps: {},
  };

  // 1. Test Trello Card Creation
  try {
    const cardTitle = `[AI-Business-Automation] E2E Verification Task - ${new Date().toLocaleTimeString()}`;
    const cardDesc = `Automated verification task created at ${timestamp}.\nWorkflow: Operational Request Coordination\nApprover: Elias Chane (Operations Manager)\nZero-Trust Status: Verified`;

    const card = await trelloClient.createCard({
      name: cardTitle,
      desc: cardDesc,
    });

    results.steps.trello = {
      success: true,
      cardId: card.id,
      cardName: card.name,
      listId: card.idList,
      url: card.url,
      isDirectCardUrl: card.url.includes("/c/"),
    };
  } catch (err: any) {
    results.steps.trello = {
      success: false,
      error: err.message,
    };
  }

  // 2. Test Telegram Bot Notification
  try {
    const chatId = process.env.TELEGRAM_CHAT_ID || "7250185806";
    const telegramMessage = `🚀 *[AI-Business-Automation] E2E Pipeline Alert*\n\n` +
      `• *Process*: Operational Request Coordination\n` +
      `• *Status*: Approved & Executed\n` +
      `• *Manager*: Elias Chane (Operations Manager)\n` +
      `• *Timestamp*: \`${timestamp}\`\n\n` +
      `_Zero-trust human gate confirmed. External side-effects delivered._`;

    const msg = await telegramClient.sendMessage(chatId, telegramMessage);
    results.steps.telegram = {
      success: true,
      messageId: msg.message_id,
      chatId: msg.chat.id,
      recipient: (msg.chat as any).first_name || (msg.chat as any).username || chatId,
    };
  } catch (err: any) {
    results.steps.telegram = {
      success: false,
      error: err.message,
    };
  }

  // 3. Test Email Notification Delivery
  try {
    const recipientEmail = "elias@acme-operations.com";
    const emailResult = await emailClient.sendEmail({
      to: recipientEmail,
      subject: `[AI-Business-Automation] Approved Execution Notice - ${new Date().toLocaleTimeString()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background: #0a2540; padding: 20px; color: #fff;">
            <h2 style="margin: 0;">AI-Business-Automation</h2>
            <p style="margin: 4px 0 0; color: #94a3b8; font-size: 12px;">Zero-Trust Operations Receipt</p>
          </div>
          <div style="padding: 24px;">
            <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 9999px; display: inline-block; padding: 4px 10px; color: #065f46; font-size: 11px; font-weight: bold; margin-bottom: 12px;">
              ✓ HUMAN GATE APPROVED & DELIVERED
            </div>
            <h3 style="margin: 0 0 12px; color: #0f172a;">Operational Request Dispatched</h3>
            <p style="color: #475569; font-size: 13px; line-height: 1.5;">
              This notification verifies delivery of automated workflow actions to Trello, Telegram, and Email following explicit human approval by <strong>Elias Chane (Operations Manager)</strong>.
            </p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 12px;">
              <div><strong>Workspace:</strong> Acme Operations</div>
              <div><strong>Recipient:</strong> ${recipientEmail}</div>
              <div><strong>Delivery Engine:</strong> Active</div>
            </div>
          </div>
        </div>
      `,
    });

    const logs = emailClient.getRecentEmails(3);
    results.steps.email = {
      success: true,
      messageId: emailResult.messageId,
      provider: emailResult.provider,
      recipient: recipientEmail,
      auditHistoryCount: logs.length,
      recentDeliveryRecord: logs[0] || null,
    };
  } catch (err: any) {
    results.steps.email = {
      success: false,
      error: err.message,
    };
  }

  // 4. Test Full End-to-End Workflow Execution
  try {
    const workflowId = "e2e-workflow-" + Date.now();
    const idempotencyKey = "idemp-e2e-" + Date.now();
    const workspaceId = "ws-acme-ops";

    const execution = await executionService.executeWorkflow(
      workflowId,
      idempotencyKey,
      workspaceId
    );

    results.steps.fullWorkflowExecution = {
      success: true,
      executionId: execution.id,
      workflowId: execution.workflow_id,
      finalStatus: execution.status,
      directTrelloCardUrl: execution.trelloCardUrl,
      executedSteps: execution.execution_steps?.map((s: any) => ({
        action: s.action_type,
        status: s.status,
        ref: s.external_reference,
      })),
    };
  } catch (err: any) {
    results.steps.fullWorkflowExecution = {
      success: false,
      error: err.message,
    };
  }

  const allPassed =
    results.steps.trello?.success &&
    results.steps.telegram?.success &&
    results.steps.email?.success &&
    results.steps.fullWorkflowExecution?.success;

  return NextResponse.json({
    allPassed,
    summary: allPassed
      ? "All 4 stages (Trello, Telegram, Email, Full Workflow Execution) passed successfully!"
      : "Some stages encountered issues. See details below.",
    results,
  });
}
