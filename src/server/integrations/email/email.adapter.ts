// Email adapter — maps AI-Business-Automation domain types to email dispatches

import { emailClient, type EmailOptions } from "./email.client";

export class EmailAdapter {
  private client = emailClient;

  async sendNotification(options: {
    recipientEmail?: string;
    processTitle: string;
    taskUrl?: string;
    executionId?: string;
    managerName?: string;
  }): Promise<{ externalId: string; success: boolean; provider: string }> {
    const to = options.recipientEmail || "elias@acme-operations.com";
    const manager = options.managerName || "Elias Chane (Operations Manager)";
    const subject = `[AI-Business-Automation] Approved Execution: ${options.processTitle}`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0a2540; padding: 24px 28px; color: #ffffff;">
          <h2 style="margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.02em;">AI-Business-Automation</h2>
          <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">Zero-Trust Operations & Notification Service</p>
        </div>

        <div style="padding: 28px;">
          <div style="display: inline-block; padding: 4px 10px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 9999px; color: #065f46; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px;">
            ✓ Human Gate Approved & Executed
          </div>

          <h3 style="margin: 0 0 12px; font-size: 16px; color: #0f172a;">Operational Request Executed</h3>
          <p style="margin: 0 0 20px; font-size: 13px; color: #475569; line-height: 1.5;">
            An approved operational request has been processed across designated systems following authorization by <strong>${manager}</strong>.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <tr>
                <td style="padding: 4px 0; color: #64748b; width: 120px;">Process Name:</td>
                <td style="padding: 4px 0; font-weight: 600; color: #0f172a;">${options.processTitle}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b;">Signoff Authority:</td>
                <td style="padding: 4px 0; font-weight: 600; color: #0f172a;">${manager}</td>
              </tr>
              ${options.executionId ? `
              <tr>
                <td style="padding: 4px 0; color: #64748b;">Execution ID:</td>
                <td style="padding: 4px 0; font-family: monospace; color: #0f172a;">${options.executionId}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 4px 0; color: #64748b;">Timestamp:</td>
                <td style="padding: 4px 0; color: #0f172a;">${new Date().toUTCString()}</td>
              </tr>
            </table>
          </div>

          ${options.taskUrl ? `
          <div style="margin-bottom: 24px;">
            <a href="${options.taskUrl}" style="display: inline-block; background: #059669; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-size: 12px; font-weight: 600;">
              Open Task in Trello →
            </a>
          </div>` : ""}

          <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; font-size: 11px; color: #94a3b8; line-height: 1.5;">
            <p style="margin: 0;">This email was dispatched automatically pursuant to the FR-05 Zero-Trust approval policy. External actions are strictly prohibited from execution prior to explicit operational sign-off.</p>
          </div>
        </div>
      </div>
    `;

    const res = await this.client.sendEmail({
      to,
      subject,
      html,
    });

    return {
      externalId: res.messageId,
      success: res.success,
      provider: res.provider,
    };
  }
}

export const emailAdapter = new EmailAdapter();
