/**
 * GalaxyCo.ai Landing Page
 * Linear-inspired minimal design + Framer blue accent
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ArrowRight, Bot, Workflow, BarChart3, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const user = await currentUser();

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Framer-style gradient glow effect */}
                <div className="absolute inset-0 gradient-framer-blue rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                {/* Logo container */}
                <div className="relative size-10 gradient-framer-blue rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                GalaxyCo.ai
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>
                  Get Started
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Linear Style */}
      <main className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl lg:text-7xl font-bold">
            Build AI agents in
            <br />
            natural language
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            GalaxyCo is THE AI operating system for businesses.
            Plan, build, and deploy multi-agent systems in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2">
                Get started
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline">
                View demo
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section - Linear Minimal Style */}
      <section className="container mx-auto px-4 py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold">Everything you need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Production-ready AI tools that integrate seamlessly with your existing workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* AI Agents - Minimal style */}
            <div className="space-y-3">
              <div className="size-12 rounded-lg bg-muted flex items-center justify-center">
                <Bot className="size-6 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold">AI Agents</h3>
              <p className="text-muted-foreground leading-relaxed">
                Research, email, and CRM agents working 24/7 to grow your business
              </p>
            </div>

            {/* Smart Workflows */}
            <div className="space-y-3">
              <div className="size-12 rounded-lg bg-muted flex items-center justify-center">
                <Workflow className="size-6 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Smart Workflows</h3>
              <p className="text-muted-foreground leading-relaxed">
                End-to-end automation pipelines that adapt to your business needs
              </p>
            </div>

            {/* Real Analytics */}
            <div className="space-y-3">
              <div className="size-12 rounded-lg bg-muted flex items-center justify-center">
                <BarChart3 className="size-6 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Real Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track measurable outcomes and ROI from every AI action
              </p>
            </div>

            {/* Instant Setup */}
            <div className="space-y-3">
              <div className="size-12 rounded-lg bg-muted flex items-center justify-center">
                <Zap className="size-6 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Instant Setup</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get started in under 60 seconds with pre-built agent templates
              </p>
            </div>

            {/* Continuous Learning */}
            <div className="space-y-3">
              <div className="size-12 rounded-lg bg-muted flex items-center justify-center">
                <TrendingUp className="size-6 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Continuous Learning</h3>
              <p className="text-muted-foreground leading-relaxed">
                AI that learns from your business and gets smarter over time
              </p>
            </div>

            {/* Natural Language */}
            <div className="space-y-3">
              <div className="size-12 rounded-lg bg-muted flex items-center justify-center">
                <Sparkles className="size-6 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Natural Language</h3>
              <p className="text-muted-foreground leading-relaxed">
                Build complex workflows by simply describing what you want
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Linear Minimal */}
      <footer className="border-t py-16 mt-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-foreground rounded-md flex items-center justify-center">
                <span className="text-background font-bold text-sm">G</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2025 GalaxyCo.ai
              </p>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/docs" className="hover:text-foreground transition-colors">
                Docs
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
