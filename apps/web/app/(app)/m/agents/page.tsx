/**
 * Mobile Agents Page
 * Simplified agent list for mobile
 */

import { Bot, PlayCircle, Pause, ChevronRight } from "lucide-react";
import Link from "next/link";

const agents = [
  { id: 1, name: "Sales Outreach", status: "active", runs: 1234 },
  { id: 2, name: "Email Campaign", status: "active", runs: 856 },
  { id: 3, name: "Data Sync", status: "paused", runs: 423 },
  { id: 4, name: "Lead Generation", status: "active", runs: 2891 },
];

export default function MobileAgentsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Agents</h1>
        <Link
          href="/agents/new"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
        >
          New Agent
        </Link>
      </div>

      <div className="space-y-3">
        {agents.map((agent) => (
          <Link
            key={agent.id}
            href={`/agents/${agent.id}`}
            className="block p-4 rounded-lg border border-border bg-background-elevated hover:border-border-hover active:bg-hover transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground mb-1">
                    {agent.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        agent.status === "active"
                          ? "bg-success/10 text-success border border-success/20"
                          : "bg-foreground-muted/10 text-foreground-muted border border-foreground-muted/20"
                      }`}
                    >
                      {agent.status === "active" ? (
                        <PlayCircle className="w-3 h-3" />
                      ) : (
                        <Pause className="w-3 h-3" />
                      )}
                      {agent.status}
                    </span>
                    <span className="text-xs text-foreground-muted">
                      {agent.runs} runs
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-foreground-muted flex-shrink-0 ml-2" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
