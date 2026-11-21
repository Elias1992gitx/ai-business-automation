// Zod schema for validating Gemini recommendation output
// TODO: Install zod: pnpm add zod

export const recommendationSchema = {
  title: "string",
  rationale: "string",
  expected_benefit: "string",
  implementation_complexity: "low | medium | high",
  impact_level: "low | medium | high",
  risk_level: "low | medium | high",
  dependencies: "string[]",
  risks: "string[]",
  suitable_for_automation: "boolean",
};

export const recommendationListSchema = {
  recommendations: "AutomationRecommendation[]",
};

// TODO: Replace with proper Zod schema validation
export function validateRecommendation(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.title === "string" &&
    typeof d.rationale === "string" &&
    typeof d.suitable_for_automation === "boolean"
  );
}

