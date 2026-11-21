import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json({ integrations: [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ integration: body }, { status: 201 });
}

