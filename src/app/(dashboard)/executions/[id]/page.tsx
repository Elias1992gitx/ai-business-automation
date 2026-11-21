import { ExecutionDetailView } from "@/src/components/executions/execution-detail-view";

export const instant = false;

export default async function ExecutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExecutionDetailView executionId={id} />;
}
