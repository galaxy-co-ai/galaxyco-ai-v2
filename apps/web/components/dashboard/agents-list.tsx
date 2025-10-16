/**
 * GalaxyCo.ai Agents List Component
 * Display list of agents with status and metrics
 * October 15, 2025
 */

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Play, Pause, Settings, MoreHorizontal } from "lucide-react";
import {
  cn,
  getAgentStatusBadgeColor,
  formatDate,
  formatNumber,
} from "@/lib/utils";
import type { Agent } from "@/lib/types";

interface AgentsListProps {
  agents: Agent[];
}

export function AgentsList({ agents }: AgentsListProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Active Agents
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Manage your AI automation agents
          </p>
        </div>

        <Link href="/agents">
          <Button size="sm" variant="outline">
            View All
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Agent Icon */}
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  agent.type === "research" &&
                    "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
                  agent.type === "email" &&
                    "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
                  agent.type === "crm" &&
                    "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
                  agent.type === "workflow" &&
                    "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
                )}
              >
                <Bot className="w-5 h-5" />
              </div>

              {/* Agent Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {agent.name}
                  </h3>
                  <Badge className={getAgentStatusBadgeColor(agent.status)}>
                    {agent.status}
                  </Badge>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                  {agent.description}
                </p>

                <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                  <span>
                    Success:{" "}
                    {formatNumber.percent(
                      agent.metrics.performance.successRate,
                    )}
                  </span>
                  {agent.lastRunAt && (
                    <span>
                      Last run: {formatDate.relative(agent.lastRunAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                {agent.status === "running" ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>

              <Link href={`/agents/${agent.id}`}>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default AgentsList;
