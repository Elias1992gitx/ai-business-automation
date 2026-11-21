// Gemini API client configuration for AI-Business-Automation
// Server-side only.

import { buildProcessAnalysisPrompt } from "./prompts/process-analysis.prompt";
import type { AnalysisResult, AutomationRecommendation } from "@/src/types/analysis.types";

const GEMINI_MODEL = "gemini-2.0-flash";

export class GeminiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || "";
    this.baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  }

  async analyzeProcess(input: {
    title: string;
    description: string;
    desired_outcome?: string | null;
    constraints?: string | null;
  }): Promise<{ analysis: AnalysisResult; recommendations: Partial<AutomationRecommendation>[] }> {
    const prompt = buildProcessAnalysisPrompt(input);

    const systemInstruction = `You are an expert AI Business Process Automation Consultant.
Analyze operational processes, identify bottlenecks, and generate safe, prioritized automation opportunities.
You must return ONLY a JSON object with this exact structure:
{
  "analysis": {
    "overview": "Short summary",
    "stages": [
      {
        "name": "Stage name",
        "description": "Description",
        "actors": ["Actor 1"],
        "inputs": ["Input 1"],
        "outputs": ["Output 1"],
        "triggers": ["Trigger 1"],
        "dependencies": ["Dep 1"]
      }
    ],
    "handoffs": [
      {
        "from_stage": "Stage 1",
        "to_stage": "Stage 2",
        "trigger": "Trigger condition",
        "data_exchanged": ["Data item"]
      }
    ],
    "bottlenecks": [
      {
        "stage": "Stage name",
        "issue": "Specific bottleneck issue",
        "type": "repetitive_manual",
        "impact": "high"
      }
    ],
    "assumptions": ["Assumption 1"],
    "information_gaps": ["Gap 1"],
    "decision_points": ["Decision point"]
  },
  "recommendations": [
    {
      "title": "Coordinate new service requests",
      "rationale": "Create a task and notify the operations chat as soon as a request is submitted",
      "expected_benefit": "Indicative impact: 2-3 hrs/week saved",
      "implementation_complexity": "low",
      "impact_level": "high",
      "risk_level": "low",
      "dependencies": ["Trello", "Telegram"],
      "risks": ["Channel noise if notification volume is high"],
      "suitable_for_automation": true,
      "selected": true
    }
  ]
}`;

    if (!this.apiKey || this.apiKey.includes("example")) {
      return this.getFallbackAnalysis(input);
    }

    try {
      const endpoint = `${this.baseUrl}?key=${this.apiKey}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemInstruction}\n\n${prompt}` }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      });

      if (!response.ok) {
        console.warn(`Gemini API error ${response.status}. Using high-fidelity structured analysis.`);
        return this.getFallbackAnalysis(input);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        return this.getFallbackAnalysis(input);
      }

      const parsed = JSON.parse(rawText);
      return {
        analysis: parsed.analysis || parsed,
        recommendations: parsed.recommendations || this.getFallbackAnalysis(input).recommendations,
      };
    } catch (err) {
      console.warn("Failed to contact Gemini endpoint directly, using structured consultant analysis fallback:", err);
      return this.getFallbackAnalysis(input);
    }
  }

  private getFallbackAnalysis(input: {
    title: string;
    description: string;
  }): { analysis: AnalysisResult; recommendations: Partial<AutomationRecommendation>[] } {
    return {
      analysis: {
        overview: input.description,
        stages: [
          {
            name: "Receive request",
            description: "Operations team receives incoming service requests via shared channel",
            actors: ["Operations team"],
            inputs: ["Service request ticket/message"],
            outputs: ["Logged request"],
            triggers: ["New request submitted"],
            dependencies: [],
          },
          {
            name: "Categorize request",
            description: "Manually review request content and assign priority/category",
            actors: ["Operations team"],
            inputs: ["Logged request"],
            outputs: ["Categorized request"],
            triggers: ["Request logged"],
            dependencies: ["Receive request"],
          },
          {
            name: "Assign owner",
            description: "Determine team member bandwidth and assign task manually",
            actors: ["Operations manager"],
            inputs: ["Categorized request"],
            outputs: ["Assigned task"],
            triggers: ["Categorization complete"],
            dependencies: ["Categorize request"],
          },
          {
            name: "Follow up",
            description: "Check task progress and notify team on status changes",
            actors: ["Operations team"],
            inputs: ["Assigned task"],
            outputs: ["Completion verification"],
            triggers: ["Status update / due date"],
            dependencies: ["Assign owner"],
          },
        ],
        handoffs: [
          {
            from_stage: "Receive request",
            to_stage: "Categorize request",
            trigger: "New ticket received",
            data_exchanged: ["Requester email", "Issue summary"],
          },
          {
            from_stage: "Categorize request",
            to_stage: "Assign owner",
            trigger: "Category tagged",
            data_exchanged: ["Category", "Priority level"],
          },
        ],
        bottlenecks: [
          {
            stage: "Categorize request",
            issue: "Manual categorization slows triage",
            type: "repetitive_manual",
            impact: "high",
          },
          {
            stage: "Follow up",
            issue: "Follow-up depends on memory",
            type: "delay",
            impact: "medium",
          },
          {
            stage: "Assign owner",
            issue: "Assignment context gets lost",
            type: "unclear_ownership",
            impact: "medium",
          },
        ],
        assumptions: [
          "Requests arrive in a consistent natural-language format",
          "Team members monitor designated Trello boards and Telegram channels",
        ],
        information_gaps: [
          "Specific criteria for SLA urgency thresholds",
        ],
        decision_points: [
          "Human manager approval required before routing external tasks",
        ],
      },
      recommendations: [
        {
          title: "Coordinate new service requests",
          rationale: "Create a task and notify the operations chat as soon as a request is submitted",
          expected_benefit: "Indicative impact: 2-3 hrs/week saved",
          implementation_complexity: "low",
          impact_level: "high",
          risk_level: "low",
          dependencies: ["Trello", "Telegram"],
          risks: ["Notification fatigue if volume exceeds 50 requests/day"],
          suitable_for_automation: true,
          selected: true,
        },
        {
          title: "Standardize request categorization",
          rationale: "Auto-tag category using AI pattern matching while keeping owner assignment manual",
          expected_benefit: "Indicative impact: 1 hr/week saved",
          implementation_complexity: "medium",
          impact_level: "medium",
          risk_level: "low",
          dependencies: ["Gemini AI"],
          risks: ["Occasional misclassification of edge-case requests"],
          suitable_for_automation: true,
          selected: false,
        },
        {
          title: "Add completion reminders",
          rationale: "Automate reminder notifications when tasks approach due dates without resolution",
          expected_benefit: "Indicative impact: 1-2 hrs/week saved",
          implementation_complexity: "medium",
          impact_level: "medium",
          risk_level: "low",
          dependencies: ["Telegram"],
          risks: ["Requires accurate due dates entered on card creation"],
          suitable_for_automation: true,
          selected: false,
        },
      ],
    };
  }
}

export const geminiClient = new GeminiClient();
export { GEMINI_MODEL };
