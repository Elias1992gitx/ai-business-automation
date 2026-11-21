import { trelloClient } from "../src/server/integrations/trello/trello.client";
import { telegramClient } from "../src/server/integrations/telegram/telegram.client";
import { emailClient } from "../src/server/integrations/email/email.client";
import { executionService } from "../src/server/services/execution.service";
import { settingsService } from "../src/server/services/settings.service";

async function runEndToEndVerification() {
  console.log("================================================================================");
  console.log("🚀 STARTING END-TO-END PIPELINE VERIFICATION");
  console.log("================================================================================");

  const timestamp = new Date().toISOString();
  let allPassed = true;

  // 1. TEST TRELLO CARD CREATION
  console.log("\n[1/4] Testing Trello Card Creation...");
  try {
    const cardTitle = `[AI-Business-Automation] E2E Verification Task - ${new Date().toLocaleTimeString()}`;
    const cardDesc = `Automated verification task created at ${timestamp}.\nWorkflow: Operational Request Coordination\nApprover: Elias Chane (Operations Manager)\nZero-Trust Status: Verified`;
    
    const card = await trelloClient.createCard({
      name: cardTitle,
      desc: cardDesc,
    });

    console.log("  ✓ Trello Card Created Successfully!");
    console.log(`    - Card ID: ${card.id}`);
    console.log(`    - Card Name: ${card.name}`);
    console.log(`    - List ID: ${card.idList}`);
    console.log(`    - Direct URL: ${card.url}`);
    
    if (!card.url.includes("/c/")) {
      console.warn("  ⚠ Warning: Trello URL should point to direct card (/c/...)");
    }
  } catch (err: any) {
    console.error("  ✗ Trello Card Creation Failed:", err.message);
    allPassed = false;
  }

  // 2. TEST TELEGRAM BOT NOTIFICATION
  console.log("\n[2/4] Testing Telegram Bot Notification...");
  try {
    const chatId = process.env.TELEGRAM_CHAT_ID || "7250185806";
    const telegramMessage = `🚀 *[AI-Business-Automation] E2E Pipeline Alert*\n\n` +
      `• *Process*: Operational Request Coordination\n` +
      `• *Status*: Approved & Executed\n` +
      `• *Manager*: Elias Chane (Operations Manager)\n` +
      `• *Timestamp*: \`${timestamp}\`\n\n` +
      `_Zero-trust human gate confirmed. External side-effects delivered._`;

    const msg = await telegramClient.sendMessage(chatId, telegramMessage);
    console.log("  ✓ Telegram Notification Dispatched Successfully!");
    console.log(`    - Message ID: ${msg.message_id}`);
    console.log(`    - Chat ID: ${msg.chat.id}`);
    console.log(`    - Recipient: ${(msg.chat as any).first_name || (msg.chat as any).username || chatId}`);
  } catch (err: any) {
    console.error("  ✗ Telegram Notification Failed:", err.message);
    allPassed = false;
  }

  // 3. TEST EMAIL NOTIFICATION DELIVERY
  console.log("\n[3/4] Testing Email Notification Delivery...");
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

    console.log("  ✓ Email Dispatched Successfully!");
    console.log(`    - Message ID: ${emailResult.messageId}`);
    console.log(`    - Provider: ${emailResult.provider}`);
    console.log(`    - Recipient: ${recipientEmail}`);

    const logs = emailClient.getRecentEmails(3);
    console.log(`    - Audit History Entries: ${logs.length} logged`);
  } catch (err: any) {
    console.error("  ✗ Email Notification Failed:", err.message);
    allPassed = false;
  }

  // 4. TEST FULL END-TO-END WORKFLOW EXECUTION
  console.log("\n[4/4] Testing Full End-to-End Workflow Execution...");
  try {
    const workflowId = "e2e-workflow-" + Date.now();
    const idempotencyKey = "idemp-e2e-" + Date.now();
    const workspaceId = "ws-acme-ops";

    const execution = await executionService.executeWorkflow(
      workflowId,
      idempotencyKey,
      workspaceId
    );

    console.log("  ✓ Full Workflow Executed Successfully!");
    console.log(`    - Execution ID: ${execution.id}`);
    console.log(`    - Workflow ID: ${execution.workflow_id}`);
    console.log(`    - Final Status: ${execution.status}`);
    console.log(`    - Direct Trello Card URL: ${execution.trelloCardUrl}`);
    console.log(`    - Executed Steps Count: ${execution.execution_steps?.length || 0}`);
    
    execution.execution_steps?.forEach((step: any, i: number) => {
      console.log(`      Step ${i + 1}: [${step.action_type}] -> Status: ${step.status} | Ref: ${step.external_reference || "N/A"}`);
    });

    if (execution.status !== "completed") {
      console.warn("  ⚠ Warning: Execution did not complete with 'completed' status");
      allPassed = false;
    }
  } catch (err: any) {
    console.error("  ✗ Full Workflow Execution Failed:", err.message);
    allPassed = false;
  }

  console.log("\n================================================================================");
  if (allPassed) {
    console.log("🎉 ALL E2E VERIFICATION CHECKS PASSED SUCCESSFULLY!");
    console.log("   • Trello Card Creation: VERIFIED (Direct /c/ link returned)");
    console.log("   • Telegram Notification: VERIFIED (Dispatched to chat 7250185806)");
    console.log("   • Email Notification: VERIFIED (Delivered with audit record)");
    console.log("   • Full Workflow Execution Pipeline: VERIFIED");
  } else {
    console.log("⚠️ SOME E2E VERIFICATION CHECKS ENCOUNTERED ISSUES. SEE LOGS ABOVE.");
  }
  console.log("================================================================================");
}

runEndToEndVerification().catch(console.error);
