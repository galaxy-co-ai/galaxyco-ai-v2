import { ExecutionList } from '@/components/agents/execution-list';

export default function AgentExecutionsTab({ agentId, agentName }: { agentId: string; agentName: string }) {
  return (
    <div className="space-y-6">
      <ExecutionList agentId={agentId} agentName={agentName} />
    </div>
  );
}
