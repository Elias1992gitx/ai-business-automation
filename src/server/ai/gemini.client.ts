// Gemini API client configuration for FlowPilot AI
// IMPORTANT: This module runs server-side only. Never import in client components.

// TODO: Install @google/genai package:  pnpm add @google/genai
// import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = "gemini-2.0-flash";

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  // return new GoogleGenAI({ apiKey });
  return { apiKey, model: GEMINI_MODEL };
}

export { GEMINI_MODEL };

