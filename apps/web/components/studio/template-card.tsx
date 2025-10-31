import { Star, Users, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { GridTemplate } from "@/lib/studio/types";

interface TemplateCardProps {
  template: GridTemplate;
  onSelect: () => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const complexity = template.complexity || "beginner";
  const complexityColors = {
    beginner:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    intermediate:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    advanced: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <button
      onClick={onSelect}
      className="group w-full rounded-lg border border-border bg-card p-5 text-left transition-all hover:shadow-md hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
              {template.name}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">
              {template.category.replace(/-/g, " ")}
            </p>
          </div>
        </div>
        {template.featured && (
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0 ml-2" />
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
        {template.description || "No description available"}
      </p>

      {/* Tags */}
      {template.tags && template.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-2 py-0.5"
            >
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {template.uses.toLocaleString()}
          </span>
        </div>
        {template.rating !== null && (
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {template.rating.toFixed(1)}
            </span>
          </div>
        )}
        {template.estimated_time && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {template.estimated_time}m
            </span>
          </div>
        )}
      </div>

      {/* Complexity Badge */}
      <div className="mt-3 pt-3 border-t border-border">
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${complexityColors[complexity]}`}
        >
          {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
        </span>
      </div>
    </button>
  );
}
