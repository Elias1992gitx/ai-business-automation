import { ACTION_TYPES } from "@/src/lib/constants";

export type SupportedActionType = (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES];

export interface ActionPayload {
  [key: string]: unknown;
}

export interface ActionResult {
  success: boolean;
  externalReference?: string;
  data?: Record<string, unknown>;
  error?: string;
}

export type ActionHandler = (payload: ActionPayload) => Promise<ActionResult>;

