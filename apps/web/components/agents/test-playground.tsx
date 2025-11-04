'use client';

import { useState } from 'react';
import { logger } from '@/lib/utils/logger';
import {
  Play,
  Check,
  AlertCircle,
  Loader2,
  FileText,
  Mail,
  Bell,
  Download,
  Sparkles,
  Database,
} from 'lucide-react';
import { DeployModal } from './deploy-modal';
import type { TestInputs, TestResult } from '@/lib/agents/test-types';
import type { ScheduleConfigInput } from '@/lib/agents/types';
import { toast } from 'sonner';

interface TestPlaygroundProps {
  agentId: string | null;
  agentName: string;
  workflowSteps: any[];
  onRunTest: (inputs: any) => Promise<TestResult | void>;
  isRunning?: boolean;
}

type TabView = 'inputs' | 'logs' | 'outputs';

export function TestPlayground({
  agentId,
  agentName,
  workflowSteps,
  onRunTest,
  isRunning = false,
}: TestPlaygroundProps) {
  const [triggerType, setTriggerType] = useState<'manual' | 'scheduled' | 'event'>('manual');
  const [sampleData, setSampleData] = useState<Record<string, string>>({
    customerName: 'John Doe',
    email: 'john@example.com',
    notes: 'Test inquiry about product pricing',
  });
  const [mockIntegrations, setMockIntegrations] = useState(true);

  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabView>('inputs');
  const [showDeployModal, setShowDeployModal] = useState(false);

  const handleRunTest = async () => {
    setTestResult(null);
    setActiveTab('logs');

    try {
      const result = await onRunTest({
        triggerType,
        sampleTriggerData: sampleData,
        mockIntegrations,
      });

      if (result) {
        setTestResult(result);
        if (result.success) {
          setActiveTab('outputs');
        }
      }
    } catch (error) {
      logger.error('Test error', error);
    }
  };

  const canRun = Object.values(sampleData).some((v) => v.trim() !== '') || triggerType === 'manual';

  const handleDeploy = async (scheduleConfig: ScheduleConfigInput) => {
    if (!agentId) {
      toast.error('Agent must be saved before deploying');
      return;
    }

    try {
      const response = await fetch(`/api/agents/${agentId}/activate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleConfig }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to activate agent');
      }

      const data = await response.json();

      // Show webhook secret if applicable
      if (data.schedule?.webhookSecret) {
        toast.success(`Agent activated! Webhook secret: ${data.schedule.webhookSecret}`, {
          duration: 10000,
        });
      } else {
        toast.success('Agent activated successfully!');
      }
    } catch (error) {
      logger.error('Activation error', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Desktop: 3 panels, Mobile: Tabs */}
      <div className="lg:hidden flex border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('inputs')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'inputs'
              ? 'border-b-2 border-primary text-primary'
              : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          Inputs
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'logs'
              ? 'border-b-2 border-primary text-primary'
              : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          Logs
        </button>
        <button
          onClick={() => setActiveTab('outputs')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'outputs'
              ? 'border-b-2 border-primary text-primary'
              : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          Outputs
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Inputs Panel */}
        <div
          className={`${activeTab === 'inputs' ? 'block' : 'hidden'} lg:block rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6`}
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Test Configuration</h3>

          <div className="space-y-4">
            {/* Trigger Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Trigger
              </label>
              <div className="space-y-2">
                {['manual', 'scheduled', 'event'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="trigger"
                      value={type}
                      checked={triggerType === type}
                      onChange={(e) => setTriggerType(e.target.value as any)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300 capitalize">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sample Data */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Sample Trigger Data
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={sampleData.customerName}
                  onChange={(e) =>
                    setSampleData({
                      ...sampleData,
                      customerName: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={sampleData.email}
                  onChange={(e) => setSampleData({ ...sampleData, email: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
                />
                <textarea
                  placeholder="Notes"
                  value={sampleData.notes}
                  onChange={(e) => setSampleData({ ...sampleData, notes: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Mock Integrations */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mockIntegrations}
                  onChange={(e) => setMockIntegrations(e.target.checked)}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Use Mock Integrations
                </span>
              </label>
              <p className="mt-1 text-xs text-neutral-500">Avoid real API calls during testing</p>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunTest}
              disabled={!canRun || isRunning}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running Test...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Test
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Logs Panel */}
        <div
          className={`${activeTab === 'logs' ? 'block' : 'hidden'} lg:block rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden`}
        >
          <div className="border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
            <h3 className="text-lg font-semibold text-foreground">Execution Log</h3>
          </div>
          <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
            {testResult ? (
              testResult.logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 text-sm">
                  {log.status === 'completed' ? (
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  ) : log.status === 'failed' ? (
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  ) : (
                    <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    {log.duration !== undefined && (
                      <span className="text-neutral-600 dark:text-neutral-400 font-mono text-xs">
                        {(log.duration / 1000).toFixed(2)}s
                      </span>
                    )}
                    <span className="ml-2 text-foreground">{log.message}</span>
                    {log.details && (
                      <div className="mt-1 text-xs text-neutral-500">{log.details}</div>
                    )}
                    {log.error && (
                      <div className="mt-1 text-xs text-red-600 dark:text-red-400">
                        Error: {log.error}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500 text-center py-8">
                {isRunning ? 'Starting test...' : 'Click &quot;Run Test&quot; to begin'}
              </p>
            )}
          </div>
        </div>

        {/* Outputs Panel */}
        <div
          className={`${activeTab === 'outputs' ? 'block' : 'hidden'} lg:block rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden`}
        >
          <div className="border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
            <h3 className="text-lg font-semibold text-foreground">Agent Output</h3>
          </div>
          <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
            {testResult?.outputs && testResult.outputs.length > 0 ? (
              testResult.outputs.map((output) => (
                <div
                  key={output.id}
                  className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4"
                >
                  <div className="flex items-start gap-3">
                    {output.type === 'ai-result' && (
                      <Sparkles className="h-5 w-5 text-primary shrink-0" />
                    )}
                    {output.type === 'notification' && (
                      <Bell className="h-5 w-5 text-primary shrink-0" />
                    )}
                    {output.type === 'data' && (
                      <Database className="h-5 w-5 text-primary shrink-0" />
                    )}

                    <div className="flex-1">
                      <div className="font-medium text-sm text-foreground mb-2 capitalize">
                        {output.type.replace('-', ' ')}
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
                        {output.content}
                      </div>
                      <div className="mt-2 text-xs text-neutral-500">
                        {new Date(output.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <button className="mt-3 inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors">
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500 text-center py-8">
                {isRunning
                  ? 'Waiting for outputs...'
                  : 'No outputs yet. Run a test to see results.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Deploy Button */}
      {testResult?.success && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowDeployModal(true)}
            disabled={!agentId}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="h-4 w-4" />
            Deploy Agent
          </button>
        </div>
      )}

      {/* Deploy Modal */}
      <DeployModal
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
        agentId={agentId}
        agentName={agentName}
        onDeploy={handleDeploy}
      />
    </div>
  );
}
