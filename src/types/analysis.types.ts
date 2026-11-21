import type { ImpactLevel, ComplexityLevel } from "./process.types";

export interface ProcessAnalysis {
  id: string;
  process_id: string;
  model_name: string;
  analysis_json: AnalysisResult;
  assumptions_json: string[];
  created_at: string;
}

export interface AnalysisResult {
  overview: string;
  stages: AnalysisStage[];
  handoffs: AnalysisHandoff[];
  bottlenecks: AnalysisBottleneck[];
  assumptions: string[];
  information_gaps: string[];
  decision_points: string[];
}

export interface AnalysisStage {
  name: string;
  description: string;
  actors: string[];
  inputs: string[];
  outputs: string[];
  triggers: string[];
  dependencies: string[];
}

export interface AnalysisHandoff {
  from_stage: string;
  to_stage: string;
  trigger: string;
  data_exchanged: string[];
}

export interface AnalysisBottleneck {
  stage: string;
  issue: string;
  type:
    | "repetitive_manual"
    | "delay"
    | "duplicated_data_entry"
    | "unclear_ownership"
    | "failure_point";
  impact: ImpactLevel;
}

export interface AutomationRecommendation {
  id: string;
  analysis_id: string;
  title: string;
  rationale: string;
  expected_benefit: string;
  implementation_complexity: ComplexityLevel;
  impact_level: ImpactLevel;
  risk_level: ImpactLevel;
  dependencies: string[];
  risks: string[];
  suitable_for_automation: boolean;
  selected: boolean;
  created_at: string;
}

