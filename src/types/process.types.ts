import { PROCESS_STATUS, IMPACT_LEVEL, COMPLEXITY_LEVEL } from "@/src/lib/constants";

export type ProcessStatus = (typeof PROCESS_STATUS)[keyof typeof PROCESS_STATUS];

export interface BusinessProcess {
  id: string;
  user_id: string;
  title: string;
  description: string;
  desired_outcome?: string | null;
  constraints?: string | null;
  status: ProcessStatus;
  created_at: string;
  updated_at?: string;
}

export type CreateProcessInput = Pick<
  BusinessProcess,
  "title" | "description" | "desired_outcome" | "constraints"
>;

export interface ProcessStage {
  name: string;
  description: string;
  actors: string[];
  inputs: string[];
  outputs: string[];
}

export interface ProcessHandoff {
  from: string;
  to: string;
  trigger: string;
}

export interface ProcessBottleneck {
  stage: string;
  issue: string;
  type: "manual" | "delay" | "duplication" | "unclear_ownership" | "failure_point";
}

export type ImpactLevel = (typeof IMPACT_LEVEL)[keyof typeof IMPACT_LEVEL];
export type ComplexityLevel = (typeof COMPLEXITY_LEVEL)[keyof typeof COMPLEXITY_LEVEL];

