import { FactCheckPageClient } from "@/components/fact-check/FactCheckPageClient";

export default async function FactCheckPage({
  searchParams,
}: {
  searchParams: Promise<{
    jobId?: string;
    claimId?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <FactCheckPageClient
      initialJobId={params.jobId}
      initialClaimId={params.claimId}
    />
  );
}
