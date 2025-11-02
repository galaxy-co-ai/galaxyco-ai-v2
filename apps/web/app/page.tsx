/**
 * GalaxyCo.ai Landing Page
 * Built with strict Kibo UI patterns
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ArrowRight, Bot, Workflow, BarChart3, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { CreditCard } from '@/src/components/kibo-ui/credit-card';
import { Spinner } from '@/src/components/kibo-ui/spinner';

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

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
            Make Multi-Agent AI
            <br />
            <span className="gradient-framer-blue bg-clip-text text-transparent">
              Useful in Minutes
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get personalized dashboards with AI agent &ldquo;Packs&rdquo; that deliver measurable
            outcomes from Day 1. No setup. No waiting. Just results.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2">
                Start Free Trial
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section - Using Kibo UI CreditCard */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">Everything you need to scale with AI</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Production-ready AI tools that integrate seamlessly with your existing workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 @container">
            {/* AI Agents Card - Framer Primary Blue */}
            <CreditCard className="gradient-framer-blue border-0">
              <div className="p-6 h-full flex flex-col gap-4">
                <div className="size-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Bot className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">AI Agents</h3>
                  <p className="text-white/95 text-sm leading-relaxed">
                    Research, email, and CRM agents working 24/7 to grow your business
                  </p>
                </div>
              </div>
            </CreditCard>

            {/* Smart Workflows Card - Framer Secondary Blue */}
            <CreditCard className="bg-gradient-to-br from-[#0099FF] to-[#0077DD] border-0">
              <div className="p-6 h-full flex flex-col gap-4">
                <div className="size-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Workflow className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Smart Workflows</h3>
                  <p className="text-white/95 text-sm leading-relaxed">
                    End-to-end automation pipelines that adapt to your business needs
                  </p>
                </div>
              </div>
            </CreditCard>

            {/* Real Analytics Card - Framer Primary Blue */}
            <CreditCard className="gradient-framer-blue border-0">
              <div className="p-6 h-full flex flex-col gap-4">
                <div className="size-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <BarChart3 className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Real Analytics</h3>
                  <p className="text-white/95 text-sm leading-relaxed">
                    Track measurable outcomes and ROI from every AI action
                  </p>
                </div>
              </div>
            </CreditCard>

            {/* Instant Setup Card - Framer Secondary Blue */}
            <CreditCard className="bg-gradient-to-br from-[#0099FF] to-[#0077DD] border-0">
              <div className="p-6 h-full flex flex-col gap-4">
                <div className="size-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Zap className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Instant Setup</h3>
                  <p className="text-white/95 text-sm leading-relaxed">
                    Get started in under 60 seconds with pre-built agent templates
                  </p>
                </div>
              </div>
            </CreditCard>

            {/* Continuous Learning Card - Framer Primary Blue */}
            <CreditCard className="gradient-framer-blue border-0">
              <div className="p-6 h-full flex flex-col gap-4">
                <div className="size-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <TrendingUp className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Continuous Learning</h3>
                  <p className="text-white/95 text-sm leading-relaxed">
                    AI that learns from your business and gets smarter over time
                  </p>
                </div>
              </div>
            </CreditCard>

            {/* Natural Language Card - Framer Secondary Blue */}
            <CreditCard className="bg-gradient-to-br from-[#0099FF] to-[#0077DD] border-0">
              <div className="p-6 h-full flex flex-col gap-4">
                <div className="size-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Sparkles className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Natural Language</h3>
                  <p className="text-white/95 text-sm leading-relaxed">
                    Build complex workflows by simply describing what you want
                  </p>
                </div>
              </div>
            </CreditCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 mt-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-8 gradient-framer-blue rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2025 GalaxyCo.ai — AI tools that get sh*t done.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="/docs" className="hover:text-primary transition-colors">
                Docs
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
