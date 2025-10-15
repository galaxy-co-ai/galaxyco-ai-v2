/**
 * GalaxyCo.ai Landing Page
 * October 15, 2025
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ArrowRight, Bot, Workflow, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
      {/* Navigation */}
      <nav className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold text-neutral-900 dark:text-white">GalaxyCo.ai</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/sign-in">
                <button className="px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/sign-up">
                <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg font-medium transition-colors">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
            Make Multi-Agent AI
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Useful in Minutes
            </span>
          </h1>
          
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
            Get personalized dashboards with AI agent &ldquo;Packs&rdquo; that deliver measurable outcomes from Day 1. 
            No setup. No waiting. Just results.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/sign-up">
              <button className="flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg font-semibold text-lg transition-colors">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </Link>
            <Link href="/sign-in">
              <button className="px-8 py-3 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-semibold text-lg transition-colors">
                View Demo
              </button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white">AI Agents</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Research, email, and CRM agents working 24/7 to grow your business
              </p>
            </div>
            
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Workflow className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white">Smart Workflows</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                End-to-end automation pipelines that adapt to your business needs
              </p>
            </div>
            
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white">Real Analytics</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Track measurable outcomes and ROI from every AI action
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-neutral-600 dark:text-neutral-400">
          <p>© 2025 GalaxyCo.ai — AI tools that get sh*t done.</p>
        </div>
      </footer>
    </div>
  )
}