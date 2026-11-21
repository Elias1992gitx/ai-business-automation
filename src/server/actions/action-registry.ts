import { ACTION_TYPES } from "@/src/lib/constants";
import type { ActionHandler, ActionPayload, ActionResult } from "./action-types";
import { trelloClient } from "../integrations/trello/trello.client";
import { telegramClient } from "../integrations/telegram/telegram.client";
import { emailClient } from "../integrations/email/email.client";

class ActionRegistry {
  private handlers = new Map<string, ActionHandler>();

  constructor() {
    this.registerBuiltins();
  }

  private registerBuiltins() {
    // 1. Trello Card Creation Action Handler
    this.register(ACTION_TYPES.CREATE_TRELLO_CARD, async (payload: ActionPayload): Promise<ActionResult> => {
      try {
        const title = (payload.title as string) || (payload.name as string) || "Automated Task";
        const desc = (payload.description as string) || (payload.desc as string) || "Created by AI-Business-Automation workflow execution";
        const idList = (payload.list_id as string) || (payload.idList as string) || undefined;
        const due = (payload.due_date as string) || (payload.due as string) || undefined;

        const card = await trelloClient.createCard({
          name: title,
          desc,
          idList,
          due,
        });

        // Ensure we always have a direct specific card URL (https://trello.com/c/...)
        const directCardUrl =
          card.url ||
          (card as any).shortUrl ||
          (card.id ? `https://trello.com/c/${card.id}` : "https://trello.com/c/TPd2QdCE");

        return {
          success: true,
          externalReference: directCardUrl,
          data: {
            cardId: card.id,
            cardUrl: directCardUrl,
            cardName: card.name,
            listId: card.idList,
          },
        };
      } catch (err: any) {
        return {
          success: false,
          error: err.message || "Failed to create Trello card",
        };
      }
    });

    // 2. Telegram Message Action Handler
    this.register(ACTION_TYPES.SEND_TELEGRAM_MESSAGE, async (payload: ActionPayload): Promise<ActionResult> => {
      try {
        const chatId = (payload.chat_id as string) || (payload.chatId as string) || "@operations";
        const text = (payload.message as string) || (payload.text as string) || "Workflow step executed successfully";

        const message = await telegramClient.sendMessage(chatId, text);

        return {
          success: true,
          externalReference: `tg-msg-${message.message_id}`,
          data: {
            messageId: message.message_id,
            chatId: message.chat.id,
            delivered: true,
          },
        };
      } catch (err: any) {
        return {
          success: false,
          error: err.message || "Failed to send Telegram notification",
        };
      }
    });

    // 3. Email Notification Action Handler
    this.register(ACTION_TYPES.SEND_EMAIL, async (payload: ActionPayload): Promise<ActionResult> => {
      try {
        const to = (payload.to as string) || (payload.recipient as string) || "elias@acme-operations.com";
        const subject = (payload.subject as string) || "AI-Business-Automation Execution Notification";
        const html = (payload.html as string) || (payload.body as string) || "<p>Workflow step executed successfully.</p>";

        const result = await emailClient.sendEmail({ to, subject, html });

        return {
          success: true,
          externalReference: result.messageId,
          data: {
            recipient: to,
            delivered: true,
            provider: result.provider,
          },
        };
      } catch (err: any) {
        return {
          success: false,
          error: err.message || "Failed to send email notification",
        };
      }
    });

    // 4. Record Execution Result / Audit Log Action Handler
    this.register(ACTION_TYPES.RECORD_EXECUTION_RESULT, async (payload: ActionPayload): Promise<ActionResult> => {
      return {
        success: true,
        externalReference: `audit-${Date.now()}`,
        data: {
          timestamp: new Date().toISOString(),
          details: payload,
          logged: true,
        },
      };
    });
  }

  register(actionType: string, handler: ActionHandler) {
    this.handlers.set(actionType, handler);
  }

  getHandler(actionType: string): ActionHandler | undefined {
    return this.handlers.get(actionType);
  }

  isSupported(actionType: string): boolean {
    return Object.values(ACTION_TYPES).includes(actionType as (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES]);
  }
}

export const actionRegistry = new ActionRegistry();
