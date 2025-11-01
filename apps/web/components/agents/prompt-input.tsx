'use client';

import { useState } from 'react';
import { Sparkles, Mic, FileText, Loader2 } from 'lucide-react';
import { useAgentBuilder } from '@/lib/stores/agent-builder-store';

interface PromptInputProps {
  onEnhance: () => Promise<void>;
  onGenerate: () => Promise<void>;
}

export function PromptInput({ onEnhance, onGenerate }: PromptInputProps) {
  const { promptText, enhancedPrompt, isEnhancing, isGenerating, setPrompt, setEnhancedPrompt } =
    useAgentBuilder();

  const [showEnhanced, setShowEnhanced] = useState(false);

  const handleEnhanceClick = async () => {
    if (!promptText.trim() || promptText.trim().length < 10) {
      return; // Validation handled by disabled state
    }
    setShowEnhanced(true);
    await onEnhance();
  };

  const handleUseEnhanced = () => {
    if (enhancedPrompt) {
      setPrompt(enhancedPrompt);
      setShowEnhanced(false);
    }
  };

  const handleKeepOriginal = () => {
    setShowEnhanced(false);
  };

  const charCount = promptText.length;
  const canGenerate = promptText.trim().length >= 10 && !isGenerating;
  const canEnhance = promptText.trim().length >= 10 && !isEnhancing;

  return (
    <div className="space-y-4">
      {/* Main Textarea */}
      <div className="relative">
        <label htmlFor="agent-prompt" className="sr-only">
          Describe your agent
        </label>
        <textarea
          id="agent-prompt"
          value={promptText}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what your agent should do... (e.g., Review my calendar every morning, pull LinkedIn profiles for meetings, and draft personalized notes)"
          className="w-full min-h-[120px] max-h-[240px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          disabled={isGenerating}
          rows={4}
        />
        {charCount > 0 && (
          <div className="absolute bottom-2 right-2 text-xs text-neutral-500">
            {charCount} characters
          </div>
        )}
      </div>

      {/* Voice & Upload (Stubs for v1) */}
      <div className="flex gap-2">
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors opacity-50 cursor-not-allowed"
        >
          <Mic className="h-4 w-4" />
          Voice Input
        </button>
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors opacity-50 cursor-not-allowed"
        >
          <FileText className="h-4 w-4" />
          Upload SOP
        </button>
      </div>

      {/* Enhanced Version Display */}
      {showEnhanced && enhancedPrompt && (
        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-2">
            <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                ✨ Enhanced Version:
              </p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {enhancedPrompt}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUseEnhanced}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Use Enhanced
            </button>
            <button
              type="button"
              onClick={handleKeepOriginal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Keep Original
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleEnhanceClick}
          disabled={!canEnhance || isEnhancing}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEnhancing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isEnhancing ? 'Enhancing...' : 'Enhance Prompt'}
        </button>

        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Agents →'
          )}
        </button>
      </div>
    </div>
  );
}
