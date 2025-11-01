'use client';

import { useState } from 'react';
import { ListPage } from '@/components/templates/list-page';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Code,
  Rocket,
  Zap,
  Shield,
  Database,
  ArrowRight,
  FileText,
  Search,
} from 'lucide-react';
import Link from 'next/link';

const docSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Quick start guides and platform overview',
    icon: <Rocket className="h-6 w-6" />,
    articles: [
      {
        title: 'Quick Start Guide',
        description: 'Get up and running in 5 minutes',
        href: '/docs/getting-started',
        readTime: '5 min',
        badge: 'Popular',
      },
      {
        title: 'Platform Overview',
        description: 'Understanding the GalaxyCo AI platform',
        href: '/docs/getting-started/overview',
        readTime: '10 min',
        badge: null,
      },
      {
        title: 'Your First Agent',
        description: 'Build and deploy your first AI agent',
        href: '/docs/getting-started/first-agent',
        readTime: '15 min',
        badge: 'Tutorial',
      },
      {
        title: 'Authentication Setup',
        description: 'Configure authentication for your workspace',
        href: '/docs/getting-started/authentication',
        readTime: '8 min',
        badge: null,
      },
    ],
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    description: 'Complete REST API documentation',
    icon: <Code className="h-6 w-6" />,
    articles: [
      {
        title: 'API Overview',
        description: 'Introduction to the GalaxyCo API',
        href: '/docs/api-reference',
        readTime: '5 min',
        badge: 'Essential',
      },
      {
        title: 'Authentication',
        description: 'API authentication and authorization',
        href: '/docs/api-reference/authentication',
        readTime: '10 min',
        badge: null,
      },
      {
        title: 'Agents API',
        description: 'Create and manage AI agents',
        href: '/docs/api-reference/agents',
        readTime: '12 min',
        badge: null,
      },
      {
        title: 'Workflows API',
        description: 'Automate processes with workflows',
        href: '/docs/api-reference/workflows',
        readTime: '15 min',
        badge: null,
      },
    ],
  },
  {
    id: 'guides',
    title: 'Guides & Tutorials',
    description: 'Step-by-step guides for common tasks',
    icon: <BookOpen className="h-6 w-6" />,
    articles: [
      {
        title: 'Building Sales Agents',
        description: 'Create AI assistants for your sales team',
        href: '/docs/guides/sales-agents',
        readTime: '20 min',
        badge: 'Tutorial',
      },
      {
        title: 'Workflow Automation',
        description: 'Automate business processes end-to-end',
        href: '/docs/guides/workflows',
        readTime: '18 min',
        badge: null,
      },
      {
        title: 'Webhook Integration',
        description: 'Connect external services with webhooks',
        href: '/docs/guides/webhooks',
        readTime: '12 min',
        badge: 'New',
      },
      {
        title: 'Data Management',
        description: 'Manage knowledge bases and data sources',
        href: '/docs/guides/data-management',
        readTime: '15 min',
        badge: null,
      },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Connect with third-party services',
    icon: <Zap className="h-6 w-6" />,
    articles: [
      {
        title: 'Integration Overview',
        description: 'Available integrations and capabilities',
        href: '/docs/integrations',
        readTime: '8 min',
        badge: null,
      },
      {
        title: 'Salesforce Integration',
        description: 'Connect with Salesforce CRM',
        href: '/docs/integrations/salesforce',
        readTime: '15 min',
        badge: 'Popular',
      },
      {
        title: 'Slack Integration',
        description: 'Receive notifications in Slack',
        href: '/docs/integrations/slack',
        readTime: '10 min',
        badge: null,
      },
      {
        title: 'Custom Integrations',
        description: 'Build your own integrations',
        href: '/docs/integrations/custom',
        readTime: '25 min',
        badge: null,
      },
    ],
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    description: 'Security best practices and compliance',
    icon: <Shield className="h-6 w-6" />,
    articles: [
      {
        title: 'Security Overview',
        description: 'Platform security features',
        href: '/docs/security',
        readTime: '10 min',
        badge: 'Essential',
      },
      {
        title: 'Data Privacy',
        description: 'How we protect your data',
        href: '/docs/security/privacy',
        readTime: '12 min',
        badge: null,
      },
      {
        title: 'SOC 2 Compliance',
        description: 'Compliance and certifications',
        href: '/docs/security/compliance',
        readTime: '8 min',
        badge: null,
      },
      {
        title: 'Best Practices',
        description: 'Security recommendations',
        href: '/docs/security/best-practices',
        readTime: '15 min',
        badge: null,
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced Topics',
    description: 'Deep dives into advanced features',
    icon: <Database className="h-6 w-6" />,
    articles: [
      {
        title: 'Agent Orchestration',
        description: 'Coordinate multiple agents',
        href: '/docs/advanced/orchestration',
        readTime: '30 min',
        badge: 'Advanced',
      },
      {
        title: 'Custom AI Models',
        description: 'Integrate custom language models',
        href: '/docs/advanced/custom-models',
        readTime: '25 min',
        badge: 'Advanced',
      },
      {
        title: 'Performance Optimization',
        description: 'Optimize agent performance',
        href: '/docs/advanced/optimization',
        readTime: '20 min',
        badge: null,
      },
      {
        title: 'Scalability',
        description: 'Scale your AI infrastructure',
        href: '/docs/advanced/scalability',
        readTime: '22 min',
        badge: null,
      },
    ],
  },
];

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = docSections
    .map((section) => ({
      ...section,
      articles: section.articles.filter(
        (article) =>
          searchQuery === '' ||
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((section) => section.articles.length > 0);

  return (
    <ListPage
      title="Documentation"
      subtitle="Comprehensive guides and API reference"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Documentation' }]}
      searchQuery={searchQuery}
      searchPlaceholder="Search documentation..."
      onSearchChange={setSearchQuery}
      showFilters={false}
      showViewToggle={false}
    >
      <div className="space-y-8">
        {filteredSections.map((section) => (
          <Card key={section.id} className="p-6">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {section.icon}
              </div>
              <div>
                <h2 className="mb-1 text-xl font-semibold">{section.title}</h2>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {section.articles.map((article, index) => (
                <Link key={index} href={article.href}>
                  <div className="group flex items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50">
                    <FileText className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold group-hover:text-primary">{article.title}</h3>
                        {article.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {article.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">{article.description}</p>
                      <p className="text-xs text-muted-foreground">{article.readTime} read</p>
                    </div>
                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        ))}

        {filteredSections.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No results found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
          </Card>
        )}
      </div>
    </ListPage>
  );
}
