import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  // TODO: list user integration connections
  return NextResponse.json({ integrations: [] });
}

export async function POST(req: NextRequest) {
  // TODO: save integration connection config (no plaintext secrets)
  const body = await req.json();
  return NextResponse.json({ integration: body }, { status: 201 });
}

