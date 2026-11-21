import Link from "next/link";

export default function GeminiIntegrationPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-sm">
        <Link href="/settings/integrations/supabase" className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">Supabase</Link>
        <Link href="/settings/integrations/gemini" className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-medium">Gemini AI</Link>
        <Link href="/settings/integrations/trello" className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">Trello</Link>
        <Link href="/settings/integrations/telegram" className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">Telegram</Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Connect Gemini</h1>
        <p className="text-sm text-slate-500 mt-1">Use Gemini to understand processes, summarize context, and propose safe automation.</p>
      </div>
    </div>
  );
}

