import { WorkflowReviewView } from "@/src/components/workflows/workflow-review-view";

export const instant = false;

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkflowReviewView workflowId={id} />;
}

