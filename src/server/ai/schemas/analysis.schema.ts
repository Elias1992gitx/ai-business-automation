export const analysisStageSchema = {
  name: "string",
  description: "string",
  actors: "string[]",
  inputs: "string[]",
  outputs: "string[]",
  triggers: "string[]",
  dependencies: "string[]",
};

export const analysisHandoffSchema = {
  from_stage: "string",
  to_stage: "string",
  trigger: "string",
  data_exchanged: "string[]",
};

export const analysisBottleneckSchema = {
  stage: "string",
  issue: "string",
  type: "repetitive_manual | delay | duplicated_data_entry | unclear_ownership | failure_point",
  impact: "high | medium | low",
};

export const analysisResultSchema = {
  overview: "string",
  stages: "AnalysisStage[]",
  handoffs: "AnalysisHandoff[]",
  bottlenecks: "AnalysisBottleneck[]",
  assumptions: "string[]",
  information_gaps: "string[]",
  decision_points: "string[]",
};

// TODO: Replace with proper Zod schema validation
export function validateAnalysisResult(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.overview === "string" &&
    Array.isArray(d.stages) &&
    Array.isArray(d.bottlenecks) &&
    Array.isArray(d.assumptions)
  );
}

