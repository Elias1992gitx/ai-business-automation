import { NextRequest, NextResponse } from "next/server";
import { trelloClient } from "@/src/server/integrations/trello/trello.client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, listName } = body;

    const card = await trelloClient.createCard({
      name: title || "Test · AI Business Automation",
      desc: description || "Created from Trello integration setup",
      idList: listName || "Incoming",
    });

    return NextResponse.json({
      success: true,
      card,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create Trello test card" },
      { status: 500 }
    );
  }
}

export async function GET(_req: NextRequest) {
  const connection = await trelloClient.verifyConnection();
  return NextResponse.json(connection);
}

