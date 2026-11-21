# AI-Business-Automation
> **AI-Powered Business Process Automation Consultant**
> Production-Ready Full Stack AI Web Application with Human-in-the-Loop Governance.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20SSR%20Auth-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini-2.0%20Flash-4285f4?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)
[![Trello](https://img.shields.io/badge/Trello-REST%20API-0052cc?style=flat&logo=trello)](https://trello.com/)
[![Telegram](https://img.shields.io/badge/Telegram-Bot%20API-229ed9?style=flat&logo=telegram)](https://core.telegram.org/bots/api)

---

## 📖 Complete Documentation
For the complete technical specification, system design, data models, and verification logs, please see:
👉 **[SOLUTION_DESIGN_AND_SRS.md](./SOLUTION_DESIGN_AND_SRS.md)**

---

## ⚡ Quick Start & Demo Login

### 1. Installation & Build
```bash
# Install dependencies
pnpm install

# Verify TypeScript typecheck
pnpm tsc --noEmit

# Compile production build
pnpm build

# Start local server
pnpm start
```
The server runs at **`http://localhost:3000`**.

### 2. Demo Credentials (Operations Manager)
The application includes a **1-click "Demo login" button** on the homepage and login screen.
* **Email**: `elias@acme-operations.com`
* **Password**: `password12345`
* **Manager Name**: Elias Chane
* **Role**: Operations Manager
* **Workspace**: Acme Operations

---

## 🚀 Key Features

* **Natural-Language Process Intake**: Accepts unstructured operational procedures, team bottlenecks, volume, and SLA constraints.
* **Gemini 2.0 Flash Reasoning Engine**: Analyzes manual friction, calculates ROI and hours saved, and recommends 3 prioritized opportunities.
* **Strict Allowlisted Workflow Synthesis**: Generates reviewable workflows constrained to safe, approved tools.
* **FR-05 Zero-Trust Human Approval Gate**: External mutations are strictly sequestered until Operations Manager (**Elias Chane**) inspects and signs off.
* **Live Multi-Channel Dispatch**:
  * **Trello**: Dynamically creates task cards on the `Today` list of `My Trello board` with full process titles and descriptions.
  * **Telegram**: Dispatches instant Markdown notifications via `@ai_business_automation_et_bot` to chat ID `7250185806` with clickable Trello task URLs.
  * **Email**: Emits structured email dispatches from `notifications@ai-business-automation.internal`.
* **AI-Elements Workflow Canvas**: Interactive visual workflow engine with Bézier animated connectors, pan/zoom controls, and lifecycle stage tracking.
* **Supabase SSR Authentication & Auditing**: Complete cookie session management, automatic token refresh in middleware, and immutable execution logging in PostgreSQL.

---

## 🛡️ Architecture & Verification

```
[Process Intake Form] 
       │
       ▼
[Gemini 2.0 Flash Diagnosis] 
       │
       ▼
[Prioritized Automation Opportunities]
       │
       ▼
[Allowlisted Workflow Synthesis]
       │
       ▼
[FR-05 Human Approval Gate (Elias Chane)] ──(Approved)──► [Live Execution Dispatch]
                                                               ├─ Trello Card Created
                                                               ├─ Telegram Bot Alert Sent
                                                               └─ Supabase Execution Log
```

Verified end-to-end with zero TypeScript errors and exit code 0 on all 31 Next.js application routes.
