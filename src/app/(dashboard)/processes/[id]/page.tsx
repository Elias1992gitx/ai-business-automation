import { ProcessAnalysisView } from "@/src/components/analysis/process-analysis-view";

export const instant = false;

export default async function ProcessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProcessAnalysisView processId={id} />;
}

