import { NextRequest, NextResponse } from "next/server";
import { analysisService } from "@/src/server/services/analysis.service";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const analysis = await analysisService.analyzeProcess(id);

    return NextResponse.json({
      success: true,
      analysisId: analysis?.id,
      processId: id,
      data: analysis,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to analyze process" },
      { status: 500 }
    );
  }
}
