export const instant = false;

export default async function ExecutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1>Execution {id}</h1>
    </div>
  );
}

