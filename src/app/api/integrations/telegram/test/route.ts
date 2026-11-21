import { NextRequest, NextResponse } from "next/server";
import { telegramClient } from "@/src/server/integrations/telegram/telegram.client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { channel, botUsername, chatId } = body;

    const messageText = `<b>[AI-Business-Automation]</b>\n<b>Operational Notification Test</b>\nTest notification sent via ${botUsername || "@ai_business_automation_bot"}.\nReady for approved workflow actions.`;

    const result = await telegramClient.sendMessage(chatId || channel || "#operations", messageText);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to send Telegram test message" },
      { status: 500 }
    );
  }
}

export async function GET(_req: NextRequest) {
  const hasCreds = telegramClient.hasCredentials();
  if (!hasCreds) {
    return NextResponse.json({
      connected: false,
      isSimulated: true,
      botUsername: "@ai_business_automation_bot",
      message: "Running in mock simulation mode. Provide TELEGRAM_BOT_TOKEN to connect live.",
    });
  }

  const me = await telegramClient.getMe();
  return NextResponse.json({
    connected: me.ok,
    isSimulated: false,
    botUsername: me.result?.username ? `@${me.result.username}` : "@ai_business_automation_bot",
    botName: me.result?.first_name || "AI-Business-Automation Bot",
  });
}
