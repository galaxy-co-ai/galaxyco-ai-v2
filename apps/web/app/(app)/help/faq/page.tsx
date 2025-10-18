"use client";

import React, { useState, useMemo } from "react";
import { PageShell } from "@/components/templates/page-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, HelpCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const faqCategories = [
  { id: "all", label: "All Questions", count: 24 },
  { id: "getting-started", label: "Getting Started", count: 8 },
  { id: "billing", label: "Billing & Plans", count: 6 },
  { id: "agents", label: "AI Agents", count: 5 },
  { id: "security", label: "Security & Privacy", count: 3 },
  { id: "technical", label: "Technical", count: 2 },
];

const faqs = [
  {
    category: "getting-started",
    question: "How do I create my first AI agent?",
    answer:
      "Creating your first agent is simple! Navigate to the Agents page, click 'Create Agent', choose a template or start from scratch, configure your agent's behavior and tools, then save and activate it. Check out our Getting Started guide for a detailed walkthrough.",
  },
  {
    category: "getting-started",
    question: "What is an AI agent?",
    answer:
      "An AI agent is an autonomous program that can understand natural language instructions, make decisions, use tools, and complete tasks on your behalf. Agents can handle everything from data analysis to customer support.",
  },
  {
    category: "getting-started",
    question: "Do I need coding knowledge to use GalaxyCo.ai?",
    answer:
      "No! GalaxyCo.ai is designed to be accessible to everyone. Our visual builder and pre-built templates let you create powerful agents without writing any code. Advanced users can optionally write custom code for specialized needs.",
  },
  {
    category: "billing",
    question: "What plans are available?",
    answer:
      "We offer Free, Professional, and Enterprise plans. The Free plan includes basic features and limited usage. Professional unlocks advanced features and higher limits. Enterprise provides custom solutions, dedicated support, and SLAs.",
  },
  {
    category: "billing",
    question: "How is usage calculated?",
    answer:
      "Usage is based on AI model tokens consumed, agent execution time, and storage used. You can view detailed usage metrics in your billing dashboard. We provide generous free tier limits to get started.",
  },
  {
    category: "billing",
    question: "Can I upgrade or downgrade my plan anytime?",
    answer:
      "Yes! You can change your plan at any time. Upgrades take effect immediately. Downgrades apply at the end of your current billing cycle to avoid disruption.",
  },
  {
    category: "agents",
    question: "How many agents can I create?",
    answer:
      "The number of agents depends on your plan. Free tier allows 3 agents, Professional allows 25, and Enterprise has no limits. All active and draft agents count toward your quota.",
  },
  {
    category: "agents",
    question: "Can agents access my private data?",
    answer:
      "Yes, with your permission. Agents can access connected data sources, uploaded documents, and integrated services. All data access follows strict security protocols and workspace isolation rules.",
  },
  {
    category: "agents",
    question: "What happens if an agent makes a mistake?",
    answer:
      "All agent actions are logged for full auditability. You can review agent decisions, rollback changes if supported by the tool, and refine agent instructions to prevent future errors. Critical actions can require human approval.",
  },
  {
    category: "security",
    question: "Is my data secure?",
    answer:
      "Absolutely. We use industry-standard encryption (TLS 1.3 in transit, AES-256 at rest), maintain SOC 2 compliance, conduct regular security audits, and follow strict data handling practices. Your data is never used to train AI models.",
  },
  {
    category: "security",
    question: "Who can access my workspace data?",
    answer:
      "Only team members you explicitly invite have access. Each user has role-based permissions (Admin, Member, Viewer). Enterprise plans support SSO and advanced access controls.",
  },
  {
    category: "technical",
    question: "What AI models do you support?",
    answer:
      "We support major AI providers including OpenAI (GPT-4, GPT-3.5), Anthropic (Claude), Google (PaLM), and more. You can choose different models per agent based on performance and cost requirements.",
  },
  {
    category: "technical",
    question: "Can I integrate with my existing tools?",
    answer:
      "Yes! We offer native integrations with 100+ popular services (Slack, Salesforce, Google Workspace, etc.) and support custom integrations via webhooks and API. Check our integrations marketplace for the full list.",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter FAQs based on search and category
  const filteredFaqs = useMemo(() => {
    let results = faqs;

    // Filter by category
    if (selectedCategory !== "all") {
      results = results.filter((faq) => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query),
      );
    }

    return results;
  }, [searchQuery, selectedCategory]);

  return (
    <PageShell
      title="Frequently Asked Questions"
      subtitle="Find quick answers to common questions"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Help", href: "/help" },
        { label: "FAQ" },
      ]}
    >
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {faqCategories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="gap-2"
              >
                {category.label}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs",
                    selectedCategory === category.id
                      ? "bg-primary-foreground/20"
                      : "bg-muted",
                  )}
                >
                  {category.count}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        {filteredFaqs.length > 0 ? (
          <div className="rounded-lg border border-border bg-card">
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="ml-8 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No questions found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or category filter
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Still Need Help? */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
          <p className="text-muted-foreground mb-4">
            Can&apos;t find the answer you&apos;re looking for? Contact our
            support team.
          </p>
          <div className="flex gap-3">
            <Link href="/help/contact">
              <Button>Contact Support</Button>
            </Link>
            <Link href="/help">
              <Button variant="outline">Back to Help Center</Button>
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
