/**
 * Documentation Article View
 * Template 3: Documentation/Article View
 * Left TOC sidebar, main prose content, right "On this page" sidebar, prev/next navigation
 */

import { ChevronRight, ChevronLeft, Book, FileText, Info } from 'lucide-react';
import Link from 'next/link';

// Mock data - in real app, fetch from CMS or markdown
const article = {
  title: 'Building Your First AI Agent',
  description: 'Learn how to create, configure, and deploy AI agents',
  lastUpdated: '2025-10-17',
  readTime: '8 min read',
  content: `
    <h2 id="overview">Overview</h2>
    <p>AI agents are autonomous programs that can perform tasks, make decisions, and interact with external systems. This guide will walk you through creating your first agent.</p>
    
    <h2 id="prerequisites">Prerequisites</h2>
    <p>Before you begin, make sure you have:</p>
    <ul>
      <li>An active GalaxyCo.ai workspace</li>
      <li>Basic understanding of API concepts</li>
      <li>API keys for your preferred AI provider</li>
    </ul>

    <h2 id="creating-agent">Creating Your First Agent</h2>
    <p>To create a new agent, navigate to the Agents page and click "New Agent". You'll be prompted to configure the following:</p>
    
    <h3 id="basic-info">Basic Information</h3>
    <p>Give your agent a descriptive name and description. This helps your team understand what the agent does.</p>
    
    <h3 id="trigger-config">Trigger Configuration</h3>
    <p>Choose how your agent will be triggered:</p>
    <ul>
      <li><strong>Manual</strong> - Run on demand</li>
      <li><strong>Scheduled</strong> - Run on a cron schedule</li>
      <li><strong>Webhook</strong> - Triggered by external events</li>
    </ul>

    <h2 id="configuring-steps">Configuring Workflow Steps</h2>
    <p>Each agent consists of multiple workflow steps. Common step types include:</p>
    <ul>
      <li>API calls to external services</li>
      <li>Data transformations</li>
      <li>AI completions (GPT, Claude, etc.)</li>
      <li>Conditional logic</li>
    </ul>

    <h2 id="testing">Testing Your Agent</h2>
    <p>Before deploying, use the Test Playground to verify your agent works as expected. The playground allows you to:</p>
    <ul>
      <li>Provide sample inputs</li>
      <li>View execution logs in real-time</li>
      <li>Debug errors and edge cases</li>
    </ul>

    <h2 id="deployment">Deploying to Production</h2>
    <p>Once testing is complete, activate your agent to begin production runs. Monitor the agent's performance in the Analytics dashboard.</p>

    <h2 id="best-practices">Best Practices</h2>
    <ul>
      <li>Start with simple workflows and iterate</li>
      <li>Add error handling for all API calls</li>
      <li>Use environment variables for sensitive data</li>
      <li>Monitor execution metrics regularly</li>
      <li>Version control your agent configurations</li>
    </ul>

    <h2 id="next-steps">Next Steps</h2>
    <p>Now that you've built your first agent, explore these advanced topics:</p>
    <ul>
      <li>Multi-agent workflows</li>
      <li>Custom integrations</li>
      <li>Advanced scheduling</li>
      <li>Team collaboration</li>
    </ul>
  `,
};

const tableOfContents = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'prerequisites', title: 'Prerequisites', level: 2 },
  { id: 'creating-agent', title: 'Creating Your First Agent', level: 2 },
  { id: 'basic-info', title: 'Basic Information', level: 3 },
  { id: 'trigger-config', title: 'Trigger Configuration', level: 3 },
  { id: 'configuring-steps', title: 'Configuring Workflow Steps', level: 2 },
  { id: 'testing', title: 'Testing Your Agent', level: 2 },
  { id: 'deployment', title: 'Deploying to Production', level: 2 },
  { id: 'best-practices', title: 'Best Practices', level: 2 },
  { id: 'next-steps', title: 'Next Steps', level: 2 },
];

const sidebarLinks = [
  { title: 'Getting Started', href: '/docs/getting-started', active: false },
  { title: 'Guides', href: '/docs/guides', active: true },
  { title: 'API Reference', href: '/docs/api-reference', active: false },
  { title: 'Examples', href: '/docs/examples', active: false },
];

const prevNext = {
  prev: { title: 'Installation', href: '/docs/installation' },
  next: { title: 'Advanced Configuration', href: '/docs/advanced-config' },
};

export default function DocumentationArticlePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-2xl mx-auto flex">
        {/* Left Sidebar - Navigation */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-border sticky top-0 h-screen overflow-y-auto">
          <div className="p-6">
            <Link
              href="/docs"
              className="flex items-center gap-2 text-sm font-medium text-foreground mb-6 hover:text-primary transition-colors"
            >
              <Book className="w-5 h-5" />
              Documentation
            </Link>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    link.active
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground-muted hover:bg-hover hover:text-foreground'
                  }`}
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-foreground-muted mb-8">
              <Link href="/docs" className="hover:text-foreground">
                Docs
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/docs/guides" className="hover:text-foreground">
                Guides
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{article.title}</span>
            </nav>

            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">{article.title}</h1>
              <p className="text-lg text-foreground-muted mb-4">{article.description}</p>
              <div className="flex items-center gap-4 text-sm text-foreground-muted">
                <span>Updated {article.lastUpdated}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
            </header>

            {/* Info Callout */}
            <div className="mb-8 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-foreground">
                  <strong className="font-medium">Note:</strong> This guide assumes you have already
                  set up your workspace and configured your AI provider credentials.
                </div>
              </div>
            </div>

            {/* Prose Content */}
            <div
              className="prose prose-slate max-w-none
                prose-headings:text-foreground prose-headings:font-semibold
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-foreground prose-p:leading-7
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:text-foreground prose-ul:my-4
                prose-li:text-foreground prose-li:my-2
                prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-background-subtle prose-pre:border prose-pre:border-border"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Prev/Next Navigation */}
            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
              {prevNext.prev ? (
                <Link
                  href={prevNext.prev.href}
                  className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <div>
                    <div className="text-xs text-foreground-muted">Previous</div>
                    <div className="font-medium text-foreground">{prevNext.prev.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {prevNext.next && (
                <Link
                  href={prevNext.next.href}
                  className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors group"
                >
                  <div className="text-right">
                    <div className="text-xs text-foreground-muted">Next</div>
                    <div className="font-medium text-foreground">{prevNext.next.title}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </article>
        </main>

        {/* Right Sidebar - On This Page */}
        <aside className="hidden xl:block w-64 flex-shrink-0 border-l border-border sticky top-0 h-screen overflow-y-auto">
          <div className="p-6">
            <h4 className="text-sm font-semibold text-foreground mb-4">On This Page</h4>
            <nav className="space-y-2">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block text-sm text-foreground-muted hover:text-foreground transition-colors ${
                    item.level === 3 ? 'pl-4' : ''
                  }`}
                >
                  {item.title}
                </a>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-border">
              <h4 className="text-sm font-semibold text-foreground mb-4">Related Links</h4>
              <div className="space-y-2">
                <Link
                  href="/docs/api-reference"
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover"
                >
                  <FileText className="w-4 h-4" />
                  API Reference
                </Link>
                <Link
                  href="/docs/examples"
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover"
                >
                  <Book className="w-4 h-4" />
                  Example Projects
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
