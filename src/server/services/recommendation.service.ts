import type { AutomationRecommendation } from "@/src/types/analysis.types";

export class RecommendationService {
  async getRecommendations(_analysisId: string): Promise<AutomationRecommendation[]> {
    return [];
  }

  async getRecommendationById(_id: string): Promise<AutomationRecommendation | null> {
    return null;
  }
}

export const recommendationService = new RecommendationService();

