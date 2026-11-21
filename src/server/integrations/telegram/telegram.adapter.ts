// Telegram adapter — maps FlowPilot domain types to Telegram API calls

import { TelegramClient } from "./telegram.client";
import type { SendTelegramMessageParams } from "@/src/types/workflow.types";

export class TelegramAdapter {
  private client: TelegramClient;

  constructor() {
    this.client = new TelegramClient();
  }

  async sendNotification(params: SendTelegramMessageParams): Promise<{
    externalId: string;
    success: boolean;
  }> {
    const result = await this.client.sendMessage(params.chat_id, params.message);

    return {
      externalId: String(result.message_id),
      success: true,
    };
  }
}

