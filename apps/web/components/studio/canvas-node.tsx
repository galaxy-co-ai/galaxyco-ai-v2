import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import {
  Zap,
  Play,
  GitBranch,
  Repeat,
  Sparkles,
  Webhook,
  Clock,
  Code,
  Filter,
  Database,
  Layers,
  Share2,
  Globe,
  Mail,
  Bell,
  Plug,
  Box,
  Circle,
} from "lucide-react";
import type { GridNodeType, GridNodeStatus } from "@/lib/studio/types";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface CanvasNodeData extends Record<string, unknown> {
  type: GridNodeType;
  label: string;
  config?: Record<string, unknown>;
  status?: GridNodeStatus;
}

// ============================================================================
// Icon Mapping
// ============================================================================

const NODE_ICONS: Record<
  GridNodeType,
  React.ComponentType<{ className?: string }>
> = {
  trigger: Zap,
  action: Play,
  condition: GitBranch,
  loop: Repeat,
  ai: Sparkles,
  webhook: Webhook,
  delay: Clock,
  transform: Code,
  filter: Filter,
  aggregate: Layers,
  branch: Share2,
  merge: Layers,
  api: Globe,
  database: Database,
  email: Mail,
  notification: Bell,
  integration: Plug,
  custom: Box,
};

// ============================================================================
// Color Mapping
// ============================================================================

const NODE_COLORS: Record<
  GridNodeType,
  { bg: string; border: string; icon: string }
> = {
  trigger: {
    bg: "from-purple-500/20 to-purple-600/10",
    border: "border-purple-500/40",
    icon: "text-purple-400",
  },
  action: {
    bg: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/40",
    icon: "text-blue-400",
  },
  condition: {
    bg: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/40",
    icon: "text-amber-400",
  },
  loop: {
    bg: "from-cyan-500/20 to-cyan-600/10",
    border: "border-cyan-500/40",
    icon: "text-cyan-400",
  },
  ai: {
    bg: "from-indigo-500/20 to-indigo-600/10",
    border: "border-indigo-500/40",
    icon: "text-indigo-400",
  },
  webhook: {
    bg: "from-green-500/20 to-green-600/10",
    border: "border-green-500/40",
    icon: "text-green-400",
  },
  delay: {
    bg: "from-orange-500/20 to-orange-600/10",
    border: "border-orange-500/40",
    icon: "text-orange-400",
  },
  transform: {
    bg: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/40",
    icon: "text-violet-400",
  },
  filter: {
    bg: "from-pink-500/20 to-pink-600/10",
    border: "border-pink-500/40",
    icon: "text-pink-400",
  },
  aggregate: {
    bg: "from-teal-500/20 to-teal-600/10",
    border: "border-teal-500/40",
    icon: "text-teal-400",
  },
  branch: {
    bg: "from-lime-500/20 to-lime-600/10",
    border: "border-lime-500/40",
    icon: "text-lime-400",
  },
  merge: {
    bg: "from-sky-500/20 to-sky-600/10",
    border: "border-sky-500/40",
    icon: "text-sky-400",
  },
  api: {
    bg: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/40",
    icon: "text-emerald-400",
  },
  database: {
    bg: "from-slate-500/20 to-slate-600/10",
    border: "border-slate-500/40",
    icon: "text-slate-400",
  },
  email: {
    bg: "from-red-500/20 to-red-600/10",
    border: "border-red-500/40",
    icon: "text-red-400",
  },
  notification: {
    bg: "from-yellow-500/20 to-yellow-600/10",
    border: "border-yellow-500/40",
    icon: "text-yellow-400",
  },
  integration: {
    bg: "from-fuchsia-500/20 to-fuchsia-600/10",
    border: "border-fuchsia-500/40",
    icon: "text-fuchsia-400",
  },
  custom: {
    bg: "from-gray-500/20 to-gray-600/10",
    border: "border-gray-500/40",
    icon: "text-gray-400",
  },
};

// ============================================================================
// Status Indicator
// ============================================================================

const STATUS_STYLES: Record<GridNodeStatus, { bg: string; ring: string }> = {
  idle: {
    bg: "bg-slate-500",
    ring: "ring-slate-500/20",
  },
  pending: {
    bg: "bg-yellow-500 animate-pulse",
    ring: "ring-yellow-500/30",
  },
  running: {
    bg: "bg-blue-500 animate-pulse",
    ring: "ring-blue-500/30",
  },
  success: {
    bg: "bg-green-500",
    ring: "ring-green-500/20",
  },
  error: {
    bg: "bg-red-500",
    ring: "ring-red-500/20",
  },
  skipped: {
    bg: "bg-gray-500",
    ring: "ring-gray-500/20",
  },
};

// ============================================================================
// Component
// ============================================================================

export function CanvasNode(props: NodeProps<Node<CanvasNodeData>>) {
  const { data, selected } = props;
  const Icon = NODE_ICONS[data.type] || Box;
  const colors = NODE_COLORS[data.type] || NODE_COLORS.custom;
  const status = data.status ?? "idle";
  const statusStyle = STATUS_STYLES[status];

  return (
    <div
      className={cn(
        "group relative min-w-[180px] rounded-lg border backdrop-blur-md",
        "bg-gradient-to-br shadow-lg transition-all duration-200",
        "hover:shadow-xl hover:scale-[1.02]",
        colors.bg,
        colors.border,
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
    >
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background"
      />

      {/* Node Content */}
      <div className="p-3 space-y-2">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-md bg-background/50", colors.icon)}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold truncate text-foreground">
              {data.label}
            </h4>
          </div>

          {/* Status Indicator */}
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              statusStyle.bg,
              statusStyle.ring,
              "ring-2",
            )}
            title={status}
          />
        </div>

        {/* Type Label */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            {data.type}
          </span>
        </div>
      </div>

      {/* Hover Overlay */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg bg-primary/5",
          "opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
        )}
      />
    </div>
  );
}
