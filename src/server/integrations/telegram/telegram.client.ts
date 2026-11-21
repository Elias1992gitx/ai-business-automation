// Telegram Bot API client
// Server-side only.

export interface TelegramMessage {
  message_id: number;
  chat: { id: number };
  text: string;
}

export class TelegramClient {
  private readonly botToken: string;
  private readonly defaultChatId: string;
  private readonly baseUrl: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || "";
    this.defaultChatId = process.env.TELEGRAM_CHAT_ID || "";
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  hasCredentials(): boolean {
    return Boolean(
      this.botToken &&
      !this.botToken.includes("example")
    );
  }

  async sendMessage(chatId?: string, text?: string): Promise<TelegramMessage> {
    const messageText = text || "Notification from AI-Business-Automation";
    // Prefer passed chatId, then env TELEGRAM_CHAT_ID, fallback to demo channel
    const targetChat = chatId && !chatId.startsWith("#") ? chatId : (this.defaultChatId || chatId || "@operations");

    if (!this.hasCredentials()) {
      // High-fidelity fallback for demo and development when no bot token is configured
      return {
        message_id: Math.floor(Math.random() * 10000),
        chat: { id: 123456789 },
        text: messageText,
      };
    }

    const response = await fetch(`${this.baseUrl}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: targetChat, text: messageText, parse_mode: "HTML" }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Telegram API error ${response.status}: ${error}`);
    }

    const data = (await response.json()) as { ok: boolean; result: TelegramMessage };
    if (!data.ok) {
      throw new Error("Telegram API returned ok: false");
    }

    return data.result;
  }

  async getMe(): Promise<{ ok: boolean; result?: { id: number; username: string; first_name: string } }> {
    if (!this.hasCredentials()) {
      return { ok: false };
    }

    try {
      const response = await fetch(`${this.baseUrl}/getMe`);
      return (await response.json()) as any;
    } catch {
      return { ok: false };
    }
  }
}

export const telegramClient = new TelegramClient();
