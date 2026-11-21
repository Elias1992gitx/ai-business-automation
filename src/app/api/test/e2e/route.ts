import { NextRequest, NextResponse } from "next/server";
import { trelloClient } from "@/src/server/integrations/trello/trello.client";
import { telegramClient } from "@/src/server/integrations/telegram/telegram.client";
import { emailClient } from "@/src/server/integrations/email/email.client";
import { executionService } from "@/src/server/services/execution.service";
import { workflowService } from "@/src/server/services/workflow.service";
import { workspaceProcessesStore } from "@/src/server/services/workspace.service";

export async function GET(_req: NextRequest) {
  const timestamp = new Date().toISOString();
  const results: any = {
    timestamp,
    steps: {},
  };

  // 1. Test Trello Card Creation with dynamic user content
  try {
    const cardTitle = `[AI-Business-Automation] Live User Process #${Math.floor(Math.random() * 1000)}`;
    const cardDesc = `User-entered process description verified at ${timestamp}.\nWorkflow: Custom Enterprise Intake Flow\nApprover: Operations Manager\nZero-Trust Status: Verified`;

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

  // 2. Test Telegram Bot Notification with dynamic user content
  try {
    const chatId = process.env.TELEGRAM_CHAT_ID || "7250185806";
    const telegramMessage =
      `🚀 *[AI-Business-Automation] Live Pipeline Alert*\n\n` +
      `• *Process*: Customer Refund Escalation\n` +
      `• *User Description*: High-value refunds (> $500) require finance signoff and multi-channel audit trail\n` +
      `• *Owner*: \`finance-owner@acme-operations.com\`\n` +
      `• *Status*: Approved & Dispatched\n` +
      `• *Timestamp*: \`${timestamp}\`\n\n` +
      `_Zero-trust human gate confirmed. External side-effects delivered._`;

    const msg = await telegramClient.sendMessage(chatId, telegramMessage);
    results.steps.telegram = {
      success: true,
      messageId: msg.message_id,
      chatId: msg.chat.id,
      recipient:
        (msg.chat as any).first_name ||
        (msg.chat as any).username ||
        chatId,
    };
  } catch (err: any) {
    results.steps.telegram = {
      success: false,
      error: err.message,
    };
  }

  // 3. Test Email Notification Delivery to Workflow Owner
  const workflowOwnerEmail = "workflow-owner@acme-operations.com";
  try {
    const emailResult = await emailClient.sendEmail({
      to: workflowOwnerEmail,
      subject: `[AI-Business-Automation] Approved Execution Notice - ${new Date().toLocaleTimeString()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background: #0a2540; padding: 20px; color: #fff;">
            <h2 style="margin: 0;">AI-Business-Automation</h2>
            <p style="margin: 4px 0 0; color: #94a3b8; font-size: 12px;">Zero-Trust Operations Receipt</p>
          </div>
          <div style="padding: 24px;">
            <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 9999px; display: inline-block; padding: 4px 10px; color: #065f46; font-size: 11px; font-weight: bold; margin-bottom: 12px;">
              ✓ DELIVERED TO WORKFLOW OWNER
            </div>
            <h3 style="margin: 0 0 12px; color: #0f172a;">Process Executed Successfully</h3>
            <p style="color: #475569; font-size: 13px; line-height: 1.5;">
              This notification was delivered directly to the account and workflow owner (<strong>${workflowOwnerEmail}</strong>) following explicit human approval.
            </p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 12px;">
              <div><strong>Workflow Owner:</strong> ${workflowOwnerEmail}</div>
              <div><strong>Status:</strong> Delivered</div>
              <div><strong>Timestamp:</strong> ${timestamp}</div>
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
      recipient: workflowOwnerEmail,
      auditHistoryCount: logs.length,
      recentDeliveryRecord: logs[0] || null,
    };
  } catch (err: any) {
    results.steps.email = {
      success: false,
      error: err.message,
    };
  }

  // 4. Test Full End-to-End Workflow Execution with Dynamic User-Entered Process
  try {
    const workspaceId = "ws-acme-ops";
    const customProcId = `proc-custom-${Date.now()}`;
    const customUserEnteredProcess = {
      id: customProcId,
      workspace_id: workspaceId,
      title: "Enterprise Vendor Onboarding & Security Compliance",
      description:
        "New enterprise vendor contracts submit security questionnaire, trigger Trello legal review card, notify Telegram ops lead, and send audit confirmation email to the workflow owner.",
      desired_outcome:
        "Vendor compliance verified within 24 hours with zero manual data entry across systems.",
      constraints: "SOC2 compliance required; mandatory zero-trust manager approval.",
      category: "Compliance & Security",
      created_by: workflowOwnerEmail,
      user_email: workflowOwnerEmail,
      status: "analyzed",
      created_at: timestamp,
    };

    // Seed into workspace stores
    const existingList = workspaceProcessesStore.get(workspaceId) || [];
    workspaceProcessesStore.set(workspaceId, [
      customUserEnteredProcess,
      ...existingList,
    ]);

    // Generate workflow dynamically from the custom process
    const generatedWf = await workflowService.generateWorkflow(
      customProcId,
      undefined,
      workspaceId
    );

    // Execute with Approver Manager user context (simulating a manager approving/executing another user's workflow)
    const execution = await executionService.executeWorkflow(
      generatedWf.id,
      `idemp-custom-${Date.now()}`,
      workspaceId,
      {
        id: "approver-manager-01",
        email: "manager-elias@acme-operations.com",
        fullName: "Elias Chane (Operations Manager)",
      }
    );

    const emailStep = execution.execution_steps?.find(
      (s: any) => s.action_type === "send_email"
    );
    const trelloStep = execution.execution_steps?.find(
      (s: any) => s.action_type === "create_trello_card"
    );

    results.steps.fullWorkflowExecution = {
      success: execution.status === "completed",
      executionId: execution.id,
      workflowId: execution.workflow_id,
      processTitle: customUserEnteredProcess.title,
      workflowOwnerEmail,
      finalStatus: execution.status,
      directTrelloCardUrl: execution.trelloCardUrl,
      trelloStepSuccess: trelloStep?.status === "completed",
      emailDeliveredToOwner: emailStep?.result_json?.data?.recipient === workflowOwnerEmail,
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
      ? "All 4 stages passed! Dynamic user process data delivered to Trello, Telegram, and Email sent to Workflow Owner."
      : "Some stages encountered issues. See details below.",
    results,
  });
}
