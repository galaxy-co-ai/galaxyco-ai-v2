"use client";

import { ExecutionDetail } from "@/components/agents/execution-detail";
import { PageHeader } from "@/components/layout/page-header";

interface ExecutionDetailPageProps {
  params: {
    id: string;
    executionId: string;
  };
}

export default function ExecutionDetailPage({
  params,
}: ExecutionDetailPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Execution Details"
        description="View detailed information about this agent execution"
      />

      <ExecutionDetail
        agentId={params.id}
        executionId={params.executionId}
        agentName="Agent" // This will be fetched by the component
      />
    </div>
  );
}
