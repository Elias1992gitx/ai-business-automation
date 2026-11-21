// Telegram Bot API client
// IMPORTANT: Server-side only. Never import in client components.

export interface TelegramMessage {
  message_id: number;
  chat: { id: number };
  text: string;
}

export class TelegramClient {
  private readonly botToken: string;
  private readonly baseUrl: string;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error("TELEGRAM_BOT_TOKEN environment variable is required");
    }
    this.botToken = token;
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  async sendMessage(chatId: string, text: string): Promise<TelegramMessage> {
    const response = await fetch(`${this.baseUrl}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Telegram API error ${response.status}: ${error}`);
    }

    const data = await response.json() as { ok: boolean; result: TelegramMessage };
    if (!data.ok) {
      throw new Error("Telegram API returned ok: false");
    }

    return data.result;
  }
}

