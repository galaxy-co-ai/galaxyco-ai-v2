'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAgentBuilder } from '@/lib/stores/agent-builder-store';
import { useWorkspace } from '@/contexts/workspace-context';
import { PromptInput } from '@/components/agents/prompt-input';
import { TemplateGallery, type Template } from '@/components/agents/template-gallery';
import { VariantGrid } from '@/components/agents/variant-grid';
import { ProgressStream } from '@/components/agents/progress-stream';
import { WorkflowVisualizer } from '@/components/agents/workflow-visualizer';
import { IterationChat } from '@/components/agents/iteration-chat';
import { TestPlayground } from '@/components/agents/test-playground';
import { ErrorBoundary } from '@/components/shared/error-boundary';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import type { TestResult } from '@/lib/agents/test-types';

export default function AgentBuilderPage() {
  const router = useRouter();
  const { currentWorkspace } = useWorkspace();
  const {
    currentStep,
    agentId,
    promptText,
    enhancedPrompt,
    variants,
    selectedVariant,
    workflow,
    iterations,
    isGenerating,
    isTesting,
    testResults,
    setPrompt,
    setEnhancedPrompt,
    setVariants,
    setIsEnhancing,
    setIsGenerating,
    setIsTesting,
    setTestResults,
    setStep,
    setAgentId,
    selectVariant,
    addIteration,
    updateWorkflow,
  } = useAgentBuilder();

  const [progressSteps, setProgressSteps] = useState<Array<{ label: string; status: 'pending' | 'active' | 'complete' }>>([]);

  const handleEnhance = async () => {
    setIsEnhancing(true);
    try {
      const response = await fetch('/api/ai/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!response.ok) throw new Error('Failed to enhance prompt');

      const data = await response.json();
      
      if (!data.enhanced) {
        throw new Error('No enhanced prompt returned');
      }
      
      setEnhancedPrompt(data.enhanced);
      toast.success('Prompt enhanced with AI suggestions!');
    } catch (error) {
      console.error('Enhance error:', error);
      const message = error instanceof Error ? error.message : 'Failed to enhance prompt';
      toast.error(message);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Initialize progress steps
    const steps = [
      { label: 'Parsing prompt', status: 'active' as const },
      { label: 'Identifying integrations', status: 'pending' as const },
      { label: 'Generating workflows', status: 'pending' as const },
      { label: 'Finalizing variants', status: 'pending' as const },
    ];
    setProgressSteps(steps);

    try {
      // Simulate step progression
      setTimeout(() => {
        setProgressSteps([
          { label: 'Parsing prompt', status: 'complete' },
          { label: 'Identifying integrations', status: 'active' },
          { label: 'Generating workflows', status: 'pending' },
          { label: 'Finalizing variants', status: 'pending' },
        ]);
      }, 800);

      setTimeout(() => {
        setProgressSteps([
          { label: 'Parsing prompt', status: 'complete' },
          { label: 'Identifying integrations', status: 'complete' },
          { label: 'Generating workflows', status: 'active' },
          { label: 'Finalizing variants', status: 'pending' },
        ]);
      }, 1600);

      const response = await fetch('/api/ai/generate-variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: promptText,
          enhancedPrompt,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate variants');

      const data = await response.json();
      
      if (!data.variants || data.variants.length === 0) {
        throw new Error('No variants generated. Try a more specific prompt.');
      }
      
      // Complete progress
      setProgressSteps([
        { label: 'Parsing prompt', status: 'complete' },
        { label: 'Identifying integrations', status: 'complete' },
        { label: 'Generating workflows', status: 'complete' },
        { label: 'Finalizing variants', status: 'complete' },
      ]);

      setTimeout(() => {
        setVariants(data.variants);
        setProgressSteps([]);
        toast.success(`Generated ${data.variants.length} agent variants!`);
      }, 800);
    } catch (error) {
      console.error('Generate error:', error);
      const message = error instanceof Error ? error.message : 'Failed to generate agent variants';
      toast.error(message);
      setProgressSteps([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setPrompt(template.prompt);
    toast.success(`Template "${template.name}" loaded`);
  };

  const handleVariantSelect = (variant: any) => {
    selectVariant(variant);
    toast.success('Variant selected! Refine your agent using the chat.');
  };

  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const handleContinueToTest = () => {
    setStep('test');
    toast.success('Ready to test your agent!');
  };

  const handleRunTest = async (inputs: any) => {
    if (!selectedVariant || !workflow) {
      toast.error('No workflow to test');
      return;
    }

    setIsTesting(true);

    try {
      const response = await fetch('/api/agents/test-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: selectedVariant.name,
          workflowSteps: workflow,
          ...inputs,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Test execution failed');
      }

      const result: TestResult = await response.json();
      setTestResults(result);

      if (result.success) {
        toast.success(`Test completed! All ${result.executedSteps} steps passed.`);
      } else {
        toast.error(`Test failed: ${result.error || 'Unknown error'}`);
      }

      return result;
    } catch (error) {
      console.error('Test run error:', error);
      const message = error instanceof Error ? error.message : 'Failed to run test';
      toast.error(message);
      throw error;
    } finally {
      setIsTesting(false);
    }
  };

  const handleDeploy = async () => {
    if (!selectedVariant || !testResults?.success) {
      toast.error('Test must pass before deploying');
      return;
    }

    if (!currentWorkspace?.id) {
      toast.error('No workspace selected');
      return;
    }

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: currentWorkspace.id,
          name: selectedVariant.name,
          description: selectedVariant.description,
          workflow,
          edges: selectedVariant.edges,
          variantType: selectedVariant.type,
          originalPrompt: promptText,
          enhancedPrompt,
          integrations: selectedVariant.integrations,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save agent');
      }

      const data = await response.json();
      
      if (data.success && data.agent?.id) {
        setAgentId(data.agent.id);
        toast.success(`Agent "${data.agent.name}" saved as draft!`);
        // Redirect to agents list or show deploy modal
        // router.push(`/agents/${data.agent.id}`);
      }
    } catch (error) {
      console.error('Deploy error:', error);
      const message = error instanceof Error ? error.message : 'Failed to save agent';
      toast.error(message);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedVariant) return;

    setIsSendingMessage(true);

    // Add user message
    addIteration({
      id: nanoid(),
      role: 'user',
      content,
      timestamp: new Date(),
    });

    try {
      const response = await fetch('/api/ai/iterate-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentWorkflow: workflow,
          currentEdges: selectedVariant.edges,
          message: content,
          variantId: selectedVariant.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to iterate workflow');

      const data = await response.json();
      
      if (!data.explanation || !data.workflow) {
        throw new Error('Invalid response from AI');
      }

      // Add assistant message
      addIteration({
        id: nanoid(),
        role: 'assistant',
        content: data.explanation,
        timestamp: new Date(),
        workflowUpdate: data.workflow,
      });

      // Update workflow in store
      updateWorkflow(data.workflow);

      toast.success('Workflow updated!');
    } catch (error) {
      console.error('Iterate error:', error);
      const message = error instanceof Error ? error.message : 'Failed to update workflow';
      toast.error(message);
      
      // Add error message
      addIteration({
        id: nanoid(),
        role: 'system',
        content: 'Failed to process your request. Please try again.',
        timestamp: new Date(),
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-white dark:bg-neutral-900 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Agents
          </button>
          <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Create New Agent
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {currentStep === 'prompt' && (
          <>
            {/* Template Gallery */}
            <TemplateGallery onSelectTemplate={handleTemplateSelect} />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300 dark:border-neutral-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-neutral-950 px-4 text-neutral-600 dark:text-neutral-400">
                  or describe your own
                </span>
              </div>
            </div>

            {/* Prompt Input */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Describe Your Agent
              </h2>
              <PromptInput onEnhance={handleEnhance} onGenerate={handleGenerate} />
            </div>
          </>
        )}

        {currentStep === 'variants' && variants.length > 0 && (
          <VariantGrid variants={variants} onSelectVariant={handleVariantSelect} />
        )}

        {currentStep === 'iteration' && selectedVariant && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Refine Your Agent
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Use the chat to describe changes. The workflow updates in real-time.
            </p>

            {/* Desktop: Split layout, Mobile: Stacked */}
            <div className="grid gap-6 lg:grid-cols-2 lg:h-[600px]">
              {/* Workflow Visualizer */}
              <ErrorBoundary>
                <div className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden">
                  <div className="border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                      Workflow
                    </h3>
                  </div>
                  <div className="h-[400px] lg:h-[calc(100%-57px)]">
                    <WorkflowVisualizer
                      nodes={workflow}
                      edges={selectedVariant.edges}
                      interactive={false}
                    />
                  </div>
                </div>
              </ErrorBoundary>

              {/* Iteration Chat */}
              <ErrorBoundary>
                <div className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 h-[600px]">
                  <IterationChat
                    messages={iterations}
                    onSendMessage={handleSendMessage}
                    isSending={isSendingMessage}
                  />
                </div>
              </ErrorBoundary>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => selectVariant(null as any)}
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                ← Choose Different Variant
              </button>
              <button
                onClick={handleContinueToTest}
                className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Continue to Test →
              </button>
            </div>
          </div>
        )}

        {currentStep === 'test' && selectedVariant && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Test Your Agent
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Run a test with sample data to verify your workflow
                </p>
              </div>
              <button
                onClick={() => setStep('iteration')}
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                ← Back to Refine
              </button>
            </div>

            <ErrorBoundary>
              <TestPlayground
                agentName={selectedVariant.name}
                workflowSteps={workflow}
                onRunTest={handleRunTest}
                onDeploy={handleDeploy}
                isRunning={isTesting}
              />
            </ErrorBoundary>
          </div>
        )}
      </div>

      {/* Progress Modal */}
      <ProgressStream steps={progressSteps} isOpen={progressSteps.length > 0} />
    </div>
  );
}
