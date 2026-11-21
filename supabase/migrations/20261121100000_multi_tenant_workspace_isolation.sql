-- ==============================================================================
-- MULTI-TENANT WORKSPACE ISOLATION & ROW LEVEL SECURITY (RLS) MIGRATION
-- Ensures complete data separation, workspace scoping, and zero-trust ownership.
-- ==============================================================================

-- 1. Create Workspaces Table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Create Workspace Memberships Table (Multi-tenant RBAC)
CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'owner' NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(workspace_id, user_id)
);

-- 3. Create Workspace Isolated Settings Table
CREATE TABLE IF NOT EXISTS workspace_settings (
    workspace_id UUID PRIMARY KEY REFERENCES workspaces(id) ON DELETE CASCADE,
    trello_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    telegram_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    email_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    recipient_email TEXT,
    sender_name TEXT DEFAULT 'AI-Business-Automation' NOT NULL,
    theme TEXT DEFAULT 'light' NOT NULL,
    trello_config JSONB DEFAULT '{}'::jsonb NOT NULL,
    telegram_config JSONB DEFAULT '{}'::jsonb NOT NULL,
    email_config JSONB DEFAULT '{}'::jsonb NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Add workspace_id Foreign Keys to All Tenant Entities
ALTER TABLE business_processes ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE workflows ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE workflow_executions ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE integration_connections ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;

-- Create Indexes for fast tenant filtering
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_ws ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_business_processes_ws ON business_processes(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workflows_ws ON workflows(workspace_id);
CREATE INDEX IF NOT EXISTS idx_executions_ws ON workflow_executions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_integrations_ws ON integration_connections(workspace_id);

-- 5. Helper Function: Validate Workspace Membership for RLS
CREATE OR REPLACE FUNCTION is_workspace_member(ws_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_id = ws_id
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Enable Row Level Security (RLS) on All Tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_connections ENABLE ROW LEVEL SECURITY;

-- 7. Define Strict RLS Isolation Policies

-- Workspaces: Users can only see and access workspaces they belong to
DROP POLICY IF EXISTS "workspaces_isolation_policy" ON workspaces;
CREATE POLICY "workspaces_isolation_policy" ON workspaces
    FOR ALL
    USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = workspaces.id
            AND workspace_members.user_id = auth.uid()
        )
    );

-- Workspace Members: Users can view memberships in their authorized workspaces
DROP POLICY IF EXISTS "workspace_members_isolation_policy" ON workspace_members;
CREATE POLICY "workspace_members_isolation_policy" ON workspace_members
    FOR ALL
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM workspace_members wm
            WHERE wm.workspace_id = workspace_members.workspace_id
            AND wm.user_id = auth.uid()
        )
    );

-- Workspace Settings: Strictly scoped per workspace
DROP POLICY IF EXISTS "workspace_settings_isolation_policy" ON workspace_settings;
CREATE POLICY "workspace_settings_isolation_policy" ON workspace_settings
    FOR ALL
    USING (is_workspace_member(workspace_id));

-- Business Processes: Only visible and mutable by workspace members
DROP POLICY IF EXISTS "business_processes_isolation_policy" ON business_processes;
CREATE POLICY "business_processes_isolation_policy" ON business_processes
    FOR ALL
    USING (
        (workspace_id IS NOT NULL AND is_workspace_member(workspace_id)) OR
        user_id = auth.uid()
    );

-- Process Analyses: Inherit process workspace isolation
DROP POLICY IF EXISTS "process_analyses_isolation_policy" ON process_analyses;
CREATE POLICY "process_analyses_isolation_policy" ON process_analyses
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM business_processes bp
            WHERE bp.id = process_analyses.process_id
            AND (is_workspace_member(bp.workspace_id) OR bp.user_id = auth.uid())
        )
    );

-- Automation Recommendations: Inherit analysis and process workspace isolation
DROP POLICY IF EXISTS "recommendations_isolation_policy" ON automation_recommendations;
CREATE POLICY "recommendations_isolation_policy" ON automation_recommendations
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM process_analyses pa
            JOIN business_processes bp ON bp.id = pa.process_id
            WHERE pa.id = automation_recommendations.analysis_id
            AND (is_workspace_member(bp.workspace_id) OR bp.user_id = auth.uid())
        )
    );

-- Workflows: Workflows created in one workspace must never be visible to another
DROP POLICY IF EXISTS "workflows_isolation_policy" ON workflows;
CREATE POLICY "workflows_isolation_policy" ON workflows
    FOR ALL
    USING (
        (workspace_id IS NOT NULL AND is_workspace_member(workspace_id)) OR
        EXISTS (
            SELECT 1 FROM business_processes bp
            WHERE bp.id = workflows.process_id
            AND (is_workspace_member(bp.workspace_id) OR bp.user_id = auth.uid())
        )
    );

-- Workflow Executions: Strictly isolated per workspace
DROP POLICY IF EXISTS "executions_isolation_policy" ON workflow_executions;
CREATE POLICY "executions_isolation_policy" ON workflow_executions
    FOR ALL
    USING (
        (workspace_id IS NOT NULL AND is_workspace_member(workspace_id)) OR
        EXISTS (
            SELECT 1 FROM workflows wf
            WHERE wf.id = workflow_executions.workflow_id
            AND (is_workspace_member(wf.workspace_id) OR wf.approved_by = auth.uid())
        )
    );

-- Execution Steps: Inherit execution isolation
DROP POLICY IF EXISTS "execution_steps_isolation_policy" ON execution_steps;
CREATE POLICY "execution_steps_isolation_policy" ON execution_steps
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM workflow_executions we
            WHERE we.id = execution_steps.execution_id
            AND (
                is_workspace_member(we.workspace_id) OR
                EXISTS (
                    SELECT 1 FROM workflows wf WHERE wf.id = we.workflow_id AND is_workspace_member(wf.workspace_id)
                )
            )
        )
    );

-- Integration Connections: Isolated per workspace
DROP POLICY IF EXISTS "integrations_isolation_policy" ON integration_connections;
CREATE POLICY "integrations_isolation_policy" ON integration_connections
    FOR ALL
    USING (
        (workspace_id IS NOT NULL AND is_workspace_member(workspace_id)) OR
        user_id = auth.uid()
    );

-- 8. Auto-provisioning Trigger: Creates isolated workspace upon user confirmation/signup
CREATE OR REPLACE FUNCTION public.handle_new_user_workspace()
RETURNS TRIGGER AS $$
DECLARE
    new_ws_id UUID;
    ws_name TEXT;
    ws_slug TEXT;
BEGIN
    ws_name := COALESCE(NEW.raw_user_meta_data->>'workspace_name', 'Acme Operations');
    ws_slug := LOWER(REGEXP_REPLACE(ws_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || SUBSTRING(NEW.id::text, 1, 8);
    
    INSERT INTO workspaces (id, name, slug, owner_id)
    VALUES (gen_random_uuid(), ws_name, ws_slug, NEW.id)
    RETURNING id INTO new_ws_id;
    
    INSERT INTO workspace_members (workspace_id, user_id, role)
    VALUES (new_ws_id, NEW.id, 'owner');
    
    INSERT INTO workspace_settings (workspace_id, recipient_email)
    VALUES (new_ws_id, NEW.email);
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Fallback safety to never block user authentication
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_workspace ON auth.users;
CREATE TRIGGER on_auth_user_created_workspace
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_workspace();

