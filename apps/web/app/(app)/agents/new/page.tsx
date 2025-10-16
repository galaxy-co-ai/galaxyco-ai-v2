'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAgentBuilder } from '@/lib/stores/agent-builder-store';
import { PromptInput } from '@/components/agents/prompt-input';
import { TemplateGallery, type Template } from '@/components/agents/template-gallery';
import { VariantGrid } from '@/components/agents/variant-grid';
import { ProgressStream } from '@/components/agents/progress-stream';
import { toast } from 'sonner';

export default function AgentBuilderPage() {
  const router = useRouter();
  const {
    currentStep,
    promptText,
    enhancedPrompt,
    variants,
    isGenerating,
    setPrompt,
    setEnhancedPrompt,
    setVariants,
    setIsEnhancing,
    setIsGenerating,
    selectVariant,
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
      setEnhancedPrompt(data.enhanced);
      toast.success('Prompt enhanced!');
    } catch (error) {
      console.error('Enhance error:', error);
      toast.error('Failed to enhance prompt');
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
      toast.error('Failed to generate agent variants');
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
    toast.success('Variant selected! (Iteration coming in Phase 2)');
    // TODO Phase 2: Navigate to iteration view
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
      </div>

      {/* Progress Modal */}
      <ProgressStream steps={progressSteps} isOpen={progressSteps.length > 0} />
    </div>
  );
}
