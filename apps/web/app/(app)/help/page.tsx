'use client';

import React, { useState } from 'react';
import { PageShell } from '@/components/templates/page-shell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  MessageCircle,
  FileQuestion,
  Video,
  Code,
  Users,
  Search,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const helpCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    description: 'Learn the basics and get up and running quickly',
    articleCount: 12,
    href: '/docs/getting-started',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'guides',
    title: 'Guides & Tutorials',
    icon: Video,
    description: 'Step-by-step tutorials for common tasks',
    articleCount: 24,
    href: '/docs/guides',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    id: 'api',
    title: 'API Reference',
    icon: Code,
    description: 'Complete API documentation and examples',
    articleCount: 48,
    href: '/docs/api-reference',
    color: 'bg-cyan-50 text-cyan-600',
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: FileQuestion,
    description: 'Answers to frequently asked questions',
    articleCount: 36,
    href: '/help/faq',
    color: 'bg-green-50 text-green-600',
  },
  {
    id: 'community',
    title: 'Community',
    icon: Users,
    description: 'Connect with other users and share knowledge',
    articleCount: 0,
    href: 'https://community.galaxyco.ai',
    external: true,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    id: 'contact',
    title: 'Contact Support',
    icon: MessageCircle,
    description: 'Get help from our support team',
    articleCount: 0,
    href: '/help/contact',
    color: 'bg-pink-50 text-pink-600',
  },
];

const popularArticles = [
  {
    title: 'How to create your first AI agent',
    category: 'Getting Started',
    readTime: '5 min read',
    href: '/docs/getting-started#create-agent',
  },
  {
    title: 'Connecting external data sources',
    category: 'Guides',
    readTime: '8 min read',
    href: '/docs/guides/data-sources',
  },
  {
    title: 'Agent execution and monitoring',
    category: 'Guides',
    readTime: '6 min read',
    href: '/docs/guides/monitoring',
  },
  {
    title: 'API authentication and rate limits',
    category: 'API Reference',
    readTime: '4 min read',
    href: '/docs/api-reference#auth',
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <PageShell
      title="Help Center"
      subtitle="Find answers, explore guides, and get support"
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Help' }]}
    >
      <div className="space-y-8">
        {/* Search Section */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            How can we help you?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Search our knowledge base or browse by category
          </p>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg bg-white dark:bg-gray-800"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  target={category.external ? '_blank' : undefined}
                  rel={category.external ? 'noopener noreferrer' : undefined}
                  className="group relative rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md hover:border-primary/50"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-lg',
                        category.color,
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          {category.title}
                        </h4>
                        {category.external && (
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                      {category.articleCount > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {category.articleCount} articles
                        </p>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Popular Articles */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Popular Articles</h3>
          <div className="space-y-3">
            {popularArticles.map((article, index) => (
              <Link
                key={index}
                href={article.href}
                className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/50"
              >
                <div className="flex-1">
                  <h4 className="font-medium group-hover:text-primary transition-colors mb-1">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{article.category}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h4 className="font-semibold mb-2">System Status</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Check the current status of our services
            </p>
            <Link href="/status">
              <Button variant="outline" size="sm">
                View Status
              </Button>
            </Link>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h4 className="font-semibold mb-2">Contact Support</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Can&apos;t find what you&apos;re looking for? Get in touch
            </p>
            <Link href="/help/contact">
              <Button variant="outline" size="sm">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
