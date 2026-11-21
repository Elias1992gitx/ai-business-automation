export const instant = false;

export default async function RecommendationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1>Recommendation {id}</h1>
    </div>
  );
}

