"use client";

import {
  Calendar,
  Mail,
  FileText,
  MessageSquare,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: string;
  prompt: string;
}

const TEMPLATES: Template[] = [
  {
    id: "meeting-prep",
    name: "Meeting Prep Agent",
    description:
      "Review calendar, pull LinkedIn profiles, draft personalized pre-call notes",
    icon: Calendar,
    category: "Sales & Outreach",
    prompt:
      "Review my calendar every morning at 8am. For each external meeting, pull the attendee's LinkedIn profile, review our last 3 email threads, and draft personalized pre-call notes.",
  },
  {
    id: "proposal-gen",
    name: "Proposal Generator",
    description: "Create customized proposals from prospect data and templates",
    icon: FileText,
    category: "Document Generation",
    prompt:
      "When a new prospect is qualified, gather their company info, project requirements, and generate a customized proposal using our template. Send for review before delivery.",
  },
  {
    id: "email-followup",
    name: "Email Follow-up",
    description: "Track unanswered emails and send smart follow-ups",
    icon: Mail,
    category: "Sales & Outreach",
    prompt:
      "Monitor my sent emails. If no reply after 3 days, draft a personalized follow-up based on the original context. Send me for approval before sending.",
  },
  {
    id: "slack-digest",
    name: "Slack Digest",
    description: "Summarize important Slack messages and action items",
    icon: MessageSquare,
    category: "Operations & Scheduling",
    prompt:
      "Every morning at 7am, review all Slack channels I'm in from the past 24 hours. Summarize key discussions, action items assigned to me, and urgent mentions. Send digest via DM.",
  },
  {
    id: "lead-research",
    name: "Lead Research",
    description: "Enrich new leads with company and contact intel",
    icon: TrendingUp,
    category: "Research & Analysis",
    prompt:
      "When a new lead is added to CRM, research their company (revenue, employees, tech stack), find their LinkedIn profile, identify decision makers, and update CRM with enriched data.",
  },
  {
    id: "crm-sync",
    name: "CRM Sync Agent",
    description: "Keep CRM updated with latest email interactions",
    icon: Briefcase,
    category: "Operations & Scheduling",
    prompt:
      "Monitor my email inbox. When I send or receive emails with contacts in CRM, automatically log the interaction and update the contact's activity timeline.",
  },
];

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Quick Start Templates
        </h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          See All →
        </button>
      </div>

      {/* Template Grid - Desktop: 3 cols, Mobile: 1 col scroll */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.slice(0, 6).map((template) => {
          const Icon = template.icon;

          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="group flex flex-col items-start gap-3 p-4 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-primary hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                  {template.name}
                </h4>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {template.description}
              </p>

              <div className="flex items-center gap-2 mt-auto">
                <span className="text-xs text-neutral-500">
                  {template.category}
                </span>
                <span className="ml-auto text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Use Template →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { TEMPLATES };
export type { Template };
