import type { ProcessAnalysis } from "@/src/types/analysis.types";

export class AnalysisService {
  async analyzeProcess(_processId: string): Promise<ProcessAnalysis | null> {
    return null;
  }

  async getAnalysisByProcessId(_processId: string): Promise<ProcessAnalysis | null> {
    return null;
  }
}

export const analysisService = new AnalysisService();

