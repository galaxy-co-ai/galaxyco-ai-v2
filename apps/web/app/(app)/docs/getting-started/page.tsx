"use client";

import { PageShell } from "@/components/templates/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Copy,
  ExternalLink,
  Play,
} from "lucide-react";
import Link from "next/link";
import { logger } from "@/lib/utils/logger";

const steps = [
  {
    id: 1,
    title: "Create Your Workspace",
    description:
      "Set up your workspace and configure basic settings to get started",
    completed: true,
    duration: "2 min",
    tasks: [
      "Sign up for an account",
      "Create your first workspace",
      "Invite team members",
      "Configure workspace settings",
    ],
  },
  {
    id: 2,
    title: "Connect Your Data Sources",
    description:
      "Link your data sources and knowledge bases to power your agents",
    completed: true,
    duration: "5 min",
    tasks: [
      "Upload documents to knowledge base",
      "Connect external APIs",
      "Configure data permissions",
      "Test data connections",
    ],
  },
  {
    id: 3,
    title: "Build Your First Agent",
    description: "Create and configure your first AI agent using our builder",
    completed: false,
    duration: "10 min",
    tasks: [
      "Choose an agent template",
      "Configure agent settings",
      "Add workflow steps",
      "Test your agent",
    ],
  },
  {
    id: 4,
    title: "Deploy & Monitor",
    description: "Deploy your agent to production and monitor its performance",
    completed: false,
    duration: "5 min",
    tasks: [
      "Deploy agent to production",
      "Set up monitoring",
      "Configure alerts",
      "Review analytics",
    ],
  },
];

const quickLinks = [
  {
    title: "Agent Templates",
    description: "Browse pre-built agent templates",
    href: "/marketplace",
    icon: <Play className="h-5 w-5" />,
  },
  {
    title: "API Documentation",
    description: "Explore the REST API",
    href: "/docs/api-reference",
    icon: <ExternalLink className="h-5 w-5" />,
  },
  {
    title: "Video Tutorials",
    description: "Watch step-by-step guides",
    href: "/resources/videos",
    icon: <Play className="h-5 w-5" />,
  },
];

const codeExample = `// Initialize the GalaxyCo API client
import { GalaxyCo } from '@galaxyco/sdk';

const client = new GalaxyCo({
  apiKey: process.env.GALAXYCO_API_KEY
});

// Create a new agent
const agent = await client.agents.create({
  name: 'My First Agent',
  type: 'sales-assistant',
  settings: {
    model: 'gpt-4',
    temperature: 0.7
  }
});

// Execute the agent
const result = await client.agents.execute(agent.id, {
  input: 'Find leads in the technology sector'
});

// Result is available in the 'result' variable
// Process the result as needed
`;

export default function GettingStartedPage() {
  return (
    <PageShell
      title="Getting Started"
      subtitle="Everything you need to start building with GalaxyCo AI"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Documentation", href: "/docs" },
        { label: "Getting Started" },
      ]}
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <Card className="p-6">
          <div className="mb-4">
            <Badge className="mb-2">Quick Start</Badge>
            <h2 className="mb-2 text-2xl font-bold">Welcome to GalaxyCo AI</h2>
            <p className="text-muted-foreground">
              Follow these steps to get up and running in under 30 minutes.
              We&apos;ll guide you through creating your first AI agent and
              deploying it to production.
            </p>
          </div>
        </Card>

        {/* Step-by-Step Guide */}
        <Card className="p-6">
          <h3 className="mb-6 text-lg font-semibold">Step-by-Step Guide</h3>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Vertical line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[15px] top-8 h-full w-0.5 bg-border" />
                )}

                <div className="flex gap-4">
                  {/* Step indicator */}
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                    {step.completed ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 pb-8">
                    <div className="mb-2 flex items-center gap-2">
                      <h4 className="font-semibold">
                        Step {step.id}: {step.title}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {step.duration}
                      </Badge>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                    <ul className="mb-4 space-y-1">
                      {step.tasks.map((task, taskIndex) => (
                        <li
                          key={taskIndex}
                          className="flex items-center gap-2 text-sm"
                        >
                          {step.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span
                            className={
                              step.completed
                                ? "text-muted-foreground line-through"
                                : ""
                            }
                          >
                            {task}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {!step.completed && (
                      <Button>
                        Start Step {step.id}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Code Example */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Quick Start Code Example</h3>
            <Button variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Copy Code
            </Button>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
            <code>{codeExample}</code>
          </pre>
          <div className="mt-4">
            <p className="mb-2 text-sm text-muted-foreground">
              Install the SDK to get started:
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
              <code className="flex-1 text-sm">npm install @galaxyco/sdk</code>
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Links */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Next Steps</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <div className="group rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {link.icon}
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <h4 className="mb-1 font-semibold group-hover:text-primary">
                    {link.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {link.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Need Help Section */}
        <Card className="border-primary/20 bg-primary/5 p-6">
          <h3 className="mb-2 text-lg font-semibold">Need Help?</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Our team is here to help you get started. Reach out if you have any
            questions.
          </p>
          <div className="flex gap-2">
            <Button variant="outline">Contact Support</Button>
            <Button variant="outline">Join Community</Button>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
