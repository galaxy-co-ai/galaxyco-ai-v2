'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { TrendingUp, Users, FileText, Mail } from 'lucide-react'

export default function TestDashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Test Dashboard - No Auth Required
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            This page bypasses authentication to test UI components
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Users</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">1,234</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12% from last month
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Documents</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">456</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8% from last week
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Emails Sent</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">789</p>
              </div>
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15% from last week
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Conversions</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">23%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +3% from last month
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
            Test Actions
          </h2>
          <div className="flex gap-4">
            <Button>Primary Button</Button>
            <Button variant="outline">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
        </div>
      </div>
    </div>
  )
}