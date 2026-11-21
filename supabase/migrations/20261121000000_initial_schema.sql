-- Initial schema for FlowPilot AI
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS business_processes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    desired_outcome TEXT,
    constraints TEXT,
    status TEXT DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS process_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_id UUID REFERENCES business_processes(id) ON DELETE CASCADE NOT NULL,
    model_name TEXT NOT NULL,
    analysis_json JSONB NOT NULL,
    assumptions_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS automation_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID REFERENCES process_analyses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    rationale TEXT NOT NULL,
    impact_level TEXT NOT NULL,
    complexity TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    selected BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_id UUID REFERENCES business_processes(id) ON DELETE CASCADE NOT NULL,
    version INT DEFAULT 1 NOT NULL,
    workflow_json JSONB NOT NULL,
    status TEXT DEFAULT 'draft' NOT NULL,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE NOT NULL,
    idempotency_key TEXT UNIQUE,
    status TEXT DEFAULT 'pending' NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ,
    error_summary TEXT
);

CREATE TABLE IF NOT EXISTS execution_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID REFERENCES workflow_executions(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    external_reference TEXT,
    result_json JSONB,
    error_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS integration_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL,
    configuration_metadata JSONB DEFAULT '{}'::jsonb,
    connection_status TEXT DEFAULT 'disconnected' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

