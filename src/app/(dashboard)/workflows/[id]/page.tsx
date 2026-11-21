export const instant = false;

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1>Workflow {id}</h1>
    </div>
  );
}

