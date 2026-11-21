# AI-Business-Automation
## AI-Powered Business Process Automation Consultant
### Software Requirements Specification (SRS) & Solution Architecture Document

| Document Attribute | Details |
| :--- | :--- |
| **Project Name** | **AI-Business-Automation** (formerly FlowPilot AI) |
| **System Category** | Enterprise AI Process Automation & Workflow Governance |
| **Selected Role** | **AI Business Process Automation Consultant** |
| **Target Scope** | Core Operational, Administrative, and Support Workflows |
| **Operational Manager** | **Elias Chane** (`elias@acme-operations.com`) |
| **AI Operating Mode** | Cognitive Consultant + Human-in-the-Loop Zero-Trust Executor |
| **Implementation Version** | **2.0 — Production-Ready Implementation** |
| **Release Status** | Verified with Live Integrations & Automated E2E Traceability |

---

## 1. Executive Summary

**AI-Business-Automation** is an enterprise-grade, human-centric automation platform designed to analyze unstructured operational processes, pinpoint operational bottlenecks, recommend high-ROI automation candidates, synthesize executable allowlisted workflows, and—upon explicit sign-off from the Operations Manager (**Elias Chane**)—dispatch verified actions across external collaboration systems including **Trello**, **Telegram**, and **Email**.

Unlike naive auto-executing agent frameworks that risk catastrophic unauthorized modifications or API pollution, **AI-Business-Automation** implements the **FR-05 Zero-Trust Approval Gate**. External mutations are strictly sequestered behind a cryptographic server-side validation gate until an authorized human operator inspects the proposed actions, target payloads, and destination channels.

---

## 2. Role Selection & Strategic Justification

### Selected Role: AI Business Process Automation Consultant
In corporate operations, teams frequently navigate ad-hoc service requests, manual ticket escalations, disjointed team handoffs, and repeated data re-entry across isolated tools. Despite the promise of generative AI, companies face two critical extremes:
1. **Analysis Paralysis**: Teams receive static consultant reports that gather dust without concrete execution paths.
2. **Uncontrolled Autonomous Agents**: Autonomous tools with raw tool-calling abilities execute unreviewed external side effects, creating security vulnerabilities, data leakage, and compliance breaches.

### Why This Role?
The **AI Business Process Automation Consultant** bridges this divide by operating across a structured 5-stage lifecycle:
1. **Intake & Understand**: Ingests raw, plain-language operating procedures and constraints without requiring formal BPMN diagrams.
2. **Diagnose with Reasoning AI**: Leverages **Google Gemini 2.0 Flash** to calculate indicative ROI, hours saved, and surface manual bottlenecks.
3. **Synthesize Safe Workflows**: Constrains AI generation to a strict, allowlisted set of vetted tools.
4. **Enforce Governance**: Embeds the **FR-05 Human Approval Gate** where the Operations Manager (**Elias Chane**) inspects and signs off on every side effect.
5. **Execute & Audit**: Carries out parallel dispatches to live collaboration platforms (**Trello**, **Telegram**, **Email**) and writes an immutable audit record in **Supabase PostgreSQL**.

---

## 3. Key Tasks and Workflows Handled by the AI Agent

```
  ┌───────────────────────┐
  │  01. Process Intake   │  Plain-language SOPs, volume, SLA constraints
  └──────────┬────────────┘
             │
             ▼
  ┌───────────────────────┐
  │ 02. Gemini Diagnosis  │  Gemini 2.0 Flash extracts stages, bottlenecks & 3 ROI opportunities
  └──────────┬────────────┘
             │
             ▼
  ┌───────────────────────┐
  │ 03. Opportunity Pick  │  Operator selects high-priority automation candidate
  └──────────┬────────────┘
             │
             ▼
  ┌───────────────────────┐
  │ 04. Workflow Synthesis│  AI synthesizes trigger, allowlisted actions & destination payloads
  └──────────┬────────────┘
             │
             ▼
  ┌───────────────────────┐
  │ 05. FR-05 Human Gate  │  ELIAS CHANE (Operations Manager) reviews & signs off
  └──────────┬────────────┘
             │
      ┌──────┴─────────────────────────────────┐
      │ Approved                               │ Rejected / Revision
      ▼                                        ▼
┌───────────────────────────┐       ┌──────────────────────────┐
│ 06. Multi-Channel Dispatch│       │ Safe Halt & State Lock   │
│ • Trello Task Created     │       │ Zero external mutations  │
│ • Telegram Bot Alert Sent │       │ Reroutes to draft stage  │
│ • Email Notice Dispatched │       └──────────────────────────┘
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 07. Immutable Audit Trace │  Supabase stores timestamps, payloads, external IDs & status
└───────────────────────────┘
```

### Core Lifecycle Workflows

#### Workflow A: Operational Request Intake & Triage
* **Input**: Plain-language description of customer support ticket handling, onboarding steps, or incident escalation.
* **AI Task**: Identify manual touchpoints, handoff delays, and potential error points.
* **Outcome**: A structured breakdown detailing Process Stages, Actors, Dependencies, and Latency Bottlenecks.

#### Workflow B: Prioritized Opportunity Recommendations
* **Input**: Process breakdown from Workflow A.
* **AI Task**: Generate 3 prioritized opportunities ranked by feasibility, impact, and complexity.
* **Outcome**: Actionable cards with indicative time savings, estimated monthly ROI, and suggested integration partners.

#### Workflow C: Allowlisted Workflow Synthesis
* **Input**: Selected automation recommendation.
* **AI Task**: Construct a directed action graph. Every step must map strictly to predefined, registered system adapters (`trello_create_task`, `telegram_send_alert`, `email_send_notification`).
* **Outcome**: A reviewable workflow containing explicit trigger rules, step sequences, and execution parameters.

#### Workflow D: FR-05 Human Approval & Guarded Execution
* **Gate Check**: The server rejects any execution request where `approval_status !== "approved"`.
* **Execution**: Upon Elias Chane's sign-off, the server invokes the Action Registry in parallel:
  * Creates an actionable card on Trello with deep link and process metadata.
  * Dispatches an instant Markdown notification to Telegram (`@ai_business_automation_et_bot`) referencing the Trello card URL.
  * Emits an email notification from `AI-Business-Automation <notifications@ai-business-automation.internal>`.
  * Logs the execution in `workflow_executions` table in Supabase.

---

## 4. System Architecture & Technical Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER (UI LAYER)                       │
│  • Next.js 16 App Router (React 19)      • Tailwind CSS v4             │
│  • AI-Elements Workflow Canvas           • Supabase SSR Browser Client │
│  • Light Theme (#f8fafc / #0a2540)       • 1-Click Demo Login          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS (Encrypted Cookies)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      SERVER LAYER (NEXT.JS ROUTE HANDLERS)             │
│  • middleware.ts: Session Validation & Route Protection                │
│  • /api/processes, /api/workflows, /api/executions                     │
│  • Action Executor & Allowlist Registry                                │
│  • Zero-Trust FR-05 Approval Evaluator                                 │
└───────────┬───────────────────────┬──────────────────────┬─────────────┘
            │                       │                      │
            ▼                       ▼                      ▼
┌───────────────────────┐ ┌───────────────────┐ ┌────────────────────────┐
│      AI REASONING     │ │    PERSISTENCE    │ │  EXTERNAL INTEGRATIONS │
│  Google Gemini 2.0    │ │  Supabase Postgres│ │  • Trello REST API     │
│  Flash SDK            │ │  Row Level Security│ │  • Telegram Bot API   │
│  Strict JSON Schemas  │ │  SSR Session Tokens│ │  • Email Dispatch     │
└───────────────────────┘ └───────────────────┘ └────────────────────────┘
```

### 4.1 Frontend Architecture
* **Framework**: Next.js 16.4.6 with React 19 and Webpack compilation mode.
* **Styling**: Tailwind CSS v4 with `@tailwindcss/postcss` and light theme (`#f8fafc` background, slate typography, `#0a2540` navy accents).
* **AI-Elements Workflow Canvas (`src/components/ai-elements/`)**:
  * Canvas component supporting drag-to-pan, zoom in/out, and Fit View.
  * Custom Bézier SVG edge routing with animated traveling pulses (`Edge.Animated`) and dashed condition routes (`Edge.Temporary`).
  * Custom Node components displaying status badges, descriptions, roles, and handles.
* **State & Authentication**: `@supabase/ssr` with native cookie handling and `useAuth` hook providing real-time `onAuthStateChange` synchronization.

### 4.2 Backend Architecture & Service Layer
* **Separation of Concerns**:
  * `process.service.ts`: Handles input validation, storage, and retrieval of operational processes.
  * `analysis.service.ts`: Communicates with Google Gemini via `@google/genai` to perform cognitive analysis.
  * `recommendation.service.ts`: Generates structured automation opportunities.
  * `workflow.service.ts`: Synthesizes workflow structures and manages state transitions (`draft` $\to$ `pending_approval` $\to$ `approved` / `rejected`).
  * `approval.service.ts`: Enforces FR-05 sign-off logic, validating signer identity (**Elias Chane**).
  * `execution.service.ts`: Manages multi-channel dispatch, dynamic title extraction, and immutable execution logging.
* **Action Registry Pattern (`action-registry.ts` & `action-executor.ts`)**:
  * Decouples workflow definitions from third-party APIs.
  * Strictly whitelists execution types. Unknown or hallucinated action types are caught and blocked during pre-execution schema validation.

---

## 5. Third-Party APIs and Live Integrations

| Provider | Integration Type | Production Configuration | Verified Functionality |
| :--- | :--- | :--- | :--- |
| **Google Gemini API** | AI Model / LLM | Model: `gemini-2.0-flash` SDK: `@google/genai` | Process breakdown, bottleneck identification, ROI calculation, structured JSON synthesis. |
| **Trello REST API** | Project Management | API Key: Verified Token: `ATTA...` Board: `My Trello board` List: `Today` | Dynamic card creation (`#17`, `#18`) with task description, manager attribution, and process title. |
| **Telegram Bot API** | Operations Alerts | Bot: `@ai_business_automation_et_bot` Recipient: `eliaschane` (`7250185806`) | Markdown-formatted instant operations notification with direct clickable link to Trello card. |
| **Email Dispatch Adapter** | Notification Service | Sender: `notifications@ai-business-automation.internal` | Formatted team alerts containing execution summary, timestamp, and audit reference ID. |
| **Supabase PostgreSQL** | Database & Auth | Instance: `xlmksystpnqjjzwaqrmk` Mode: `@supabase/ssr` with RLS | Secure persistence of processes, analyses, workflows, executions, and user authentication sessions. |

---

## 6. Task Automation, Actions & UI Considerations

### 6.1 Meaningful Actions Taken by the Agent
1. **Dynamic Task Card Generation**: When a process such as *"Connect Task Breakdown"* is approved, the system queries the process context and creates a real Trello card formatted as:
   `[AI-Business-Automation] Connect Task Breakdown`
   The card description includes the workflow ID, process description, and operations manager attribution.
2. **Instant Multi-Channel Alerting**: Concurrently with card creation, a notification is sent to Telegram with the direct link to the newly created Trello card:
   ```markdown
   ⚡ *[AI-Business-Automation] Operational Task Created*
   
   *Process:* Connect Task Breakdown
   *Workflow ID:* `90a7eca1-0f09-453b-943c-739bffcba88f`
   *Assigned Manager:* Elias Chane
   *Trello Card:* [View Task on Trello](https://trello.com/c/c4pJhF06/17-ai-business-automation-connect-task-breakdown)
   ```
3. **Immutable Audit Logging**: Every run writes an execution record containing:
   * External task ID and URL.
   * Notification status (`delivered` / `failed`).
   * Execution latency and timestamp.
   * Full JSON result payload.

### 6.2 UI/UX Considerations & Human-in-the-Loop Governance
* **Approval Before Execution (FR-05)**: The UI displays a warning banner and disabled execute trigger until the Operations Manager explicitly clicks **"Approve Workflow"**.
* **AI-Elements Workflow Canvas**: The homepage and workflow views feature an interactive canvas where nodes represent intake, AI analysis, decision gate, and multi-channel dispatch with active flow animations.
* **Pre-Configured Demo Credentials**:
  * **Email**: `elias@acme-operations.com`
  * **Password**: `password12345`
  * **Name**: Elias Chane
  * **Role**: Operations Manager
  * A **"Demo login"** button on `/login` and `/` allows instant 1-click authentication into the portal.

---

## 7. Database Schema (Supabase PostgreSQL)

```sql
-- 1. Business Processes (Intake)
CREATE TABLE business_processes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Process Analyses (Gemini Reasoning Output)
CREATE TABLE process_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_id UUID REFERENCES business_processes(id) ON DELETE CASCADE,
    analysis_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Automation Recommendations (Prioritized Opportunities)
CREATE TABLE automation_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID REFERENCES process_analyses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    rationale TEXT NOT NULL,
    impact_estimate TEXT NOT NULL,
    complexity TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'suggested'
);

-- 4. Workflows (Synthesized Action Plan)
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID REFERENCES automation_recommendations(id),
    process_id UUID REFERENCES business_processes(id),
    title TEXT,
    definition_json JSONB NOT NULL,
    approval_status TEXT NOT NULL DEFAULT 'pending_approval', -- 'pending_approval', 'approved', 'rejected'
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Workflow Executions (Audit Trail)
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    status TEXT NOT NULL, -- 'success', 'failed', 'partial'
    task_external_id TEXT,
    task_external_url TEXT,
    notification_status TEXT,
    result_json JSONB NOT NULL,
    error_message TEXT,
    executed_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 8. Functional Requirements Traceability Matrix

| Requirement | Description | Status | Verification Evidence |
| :--- | :--- | :--- | :--- |
| **FR-01** | Process Submission with validation | **PASSED** | Validates title and body; stores in `business_processes`. |
| **FR-02** | Gemini Cognitive Analysis | **PASSED** | Extracts stages, bottlenecks, and ROI metrics with Gemini 2.0 Flash. |
| **FR-03** | Prioritized Recommendations | **PASSED** | Generates 3 prioritized opportunities with clear rationale. |
| **FR-04** | Structured Workflow Generation | **PASSED** | Generates allowlisted JSON definitions constrained to vetted actions. |
| **FR-05** | Human Approval Gate | **PASSED** | Server checks `approval_status == 'approved'` before invoking executor. |
| **FR-06** | Real Trello Task Creation | **PASSED** | Card created live in board `My Trello board` / list `Today`. |
| **FR-07** | Real Telegram Alert Dispatch | **PASSED** | Live message delivered to Telegram ID `7250185806` with card URL. |
| **FR-08** | Monitoring & Execution History | **PASSED** | All executions listed on `/executions` with full payload audit. |
| **FR-09** | Robust Error & Session Handling | **PASSED** | Supabase SSR cookie management, automatic token refresh, safe fallback. |

---

## 9. Non-Functional Requirements & Security Mandates

1. **Zero Client-Side Token Exposure**:
   * All API secrets (`GEMINI_API_KEY`, `TRELLO_API_KEY`, `TRELLO_TOKEN`, `TELEGRAM_BOT_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY`) reside exclusively in server-side environment variables.
   * Client components only access `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. **Untrusted AI Output Sanity Checking**:
   * Gemini response payloads are parsed against structured TypeScript interfaces. Malformed fields or unknown tool invocations trigger safe rejection.
3. **Resilience & Graceful Degradation**:
   * If Telegram experiences transient network timeouts, Trello task creation is recorded as `success` while notification status is flagged as `failed`. Partial successes are never misrepresented.
4. **Responsive Light UI**:
   * Design adheres to user reference specifications: `#f8fafc` background, navy accents, clear visual hierarchy, accessible contrast ratios, and interactive SVG canvas.

---

## 10. Operational Runbook & Verification Instructions

### 10.1 Running the Application Locally
```bash
# 1. Install dependencies
pnpm install

# 2. Run TypeScript type check
pnpm tsc --noEmit

# 3. Build production bundle (Webpack mode)
pnpm build

# 4. Start production server
pnpm start
# Server listens at http://localhost:3000
```

### 10.2 End-to-End Demonstration Walkthrough
1. **Access Homepage (`/`)**:
   * View the 7-step architecture diagram and interactive workflow canvas.
   * Click **"Demo login"** in the top navigation bar.
2. **Sign In (`/login`)**:
   * Credentials pre-populate: `elias@acme-operations.com` / `password12345`.
   * Click **"Demo login"** to establish an authenticated Supabase session.
3. **Submit a Process (`/processes/new`)**:
   * Title: *"Connect Task Breakdown"*
   * Description: *"Our operations team receives service requests, manually categorizes them, assigns tasks to employees, and sends follow-up messages to check completion."*
   * Click **"Analyze process"**.
4. **Inspect Gemini Diagnosis (`/processes/[id]`)**:
   * View mapped stages, manual bottlenecks, and calculated ROI metrics.
   * Select an automation candidate and click **"Generate reviewable workflow"**.
5. **Review & Human Approval Gate (`/workflows/[id]`)**:
   * Notice that external actions are held pending approval.
   * Elias Chane clicks **"Approve Workflow"**. Status flips to `Approved`.
   * Click **"Execute Workflow"**.
6. **Verify Side Effects**:
   * **Trello**: Open configured board to see the new card `[AI-Business-Automation] Connect Task Breakdown`.
   * **Telegram**: Check bot `@ai_business_automation_et_bot` to verify the message containing the Trello link.
   * **Audit History (`/executions`)**: View the completed run record with timestamps, execution metrics, and full payload details.

