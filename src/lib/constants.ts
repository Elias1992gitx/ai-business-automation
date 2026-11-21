// Application-wide constants for AI-Business-Automation

// Process statuses
export const PROCESS_STATUS = {
  DRAFT: "draft",
  ANALYZED: "analyzed",
  AWAITING_APPROVAL: "awaiting_approval",
  APPROVED: "approved",
  RUNNING: "running",
  COMPLETED: "completed",
  PARTIALLY_COMPLETED: "partially_completed",
  FAILED: "failed",
} as const;

// Workflow execution statuses
export const EXECUTION_STATUS = {
  PENDING: "pending",
  RUNNING: "running",
  COMPLETED: "completed",
  PARTIALLY_COMPLETED: "partially_completed",
  FAILED: "failed",
} as const;

// Action types supported by the action registry (MVP)
export const ACTION_TYPES = {
  CREATE_TRELLO_CARD: "create_trello_card",
  SEND_TELEGRAM_MESSAGE: "send_telegram_message",
  SEND_EMAIL: "send_email",
  RECORD_EXECUTION_RESULT: "record_execution_result",
} as const;

// Recommendation impact levels
export const IMPACT_LEVEL = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

// Recommendation complexity levels
export const COMPLEXITY_LEVEL = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

// Integration providers
export const INTEGRATION_PROVIDER = {
  TRELLO: "trello",
  TELEGRAM: "telegram",
  EMAIL: "email",
} as const;

// API rate limits
export const RATE_LIMITS = {
  ANALYSIS_PER_HOUR: 10,
  EXECUTIONS_PER_HOUR: 20,
} as const;

// Max input lengths
export const INPUT_LIMITS = {
  PROCESS_TITLE: 200,
  PROCESS_DESCRIPTION: 5000,
  PROCESS_OUTCOME: 1000,
  PROCESS_CONSTRAINTS: 1000,
} as const;

