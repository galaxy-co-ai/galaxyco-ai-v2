import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type BuilderStep = "prompt" | "variants" | "iteration" | "test";

export type WorkflowNodeType = "start" | "action" | "condition" | "end";
export type WorkflowNodeStatus = "pending" | "active" | "complete" | "error";

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  description?: string;
  integration?: string;
  status?: WorkflowNodeStatus;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
}

export type VariantType = "basic" | "advanced" | "minimal";
export type ComplexityLevel = "low" | "medium" | "high";

export interface AgentVariant {
  id: string;
  type: VariantType;
  name: string;
  description: string;
  workflow: WorkflowNode[];
  edges: WorkflowEdge[];
  estimatedSteps: number;
  complexity: ComplexityLevel;
  integrations: string[];
}

export interface Iteration {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  workflowUpdate?: WorkflowNode[];
}

export interface TestInputs {
  triggerType: "manual" | "scheduled" | "event";
  sampleData: Record<string, any>;
  mockIntegrations: boolean;
}

// Import TestResult from test-types instead of defining here
import type { TestResult as TestResultType } from "@/lib/agents/test-types";
export type TestResult = TestResultType;

interface AgentBuilderState {
  // Current builder state
  currentStep: BuilderStep;
  agentId: string | null; // Saved agent ID after deploy
  promptText: string;
  enhancedPrompt: string | null;
  variants: AgentVariant[];
  selectedVariant: AgentVariant | null;
  iterations: Iteration[];
  workflow: WorkflowNode[];
  testResults: TestResult | null;

  // UI state
  isGenerating: boolean;
  isEnhancing: boolean;
  isTesting: boolean;
  isSaving: boolean;

  // Actions
  setStep: (step: BuilderStep) => void;
  setAgentId: (id: string | null) => void;
  setPrompt: (prompt: string) => void;
  setEnhancedPrompt: (prompt: string) => void;
  setVariants: (variants: AgentVariant[]) => void;
  selectVariant: (variant: AgentVariant) => void;
  addIteration: (iteration: Iteration) => void;
  updateWorkflow: (workflow: WorkflowNode[]) => void;
  setTestResults: (results: TestResult) => void;

  // UI state setters
  setIsGenerating: (value: boolean) => void;
  setIsEnhancing: (value: boolean) => void;
  setIsTesting: (value: boolean) => void;
  setIsSaving: (value: boolean) => void;

  reset: () => void;
}

const initialState = {
  currentStep: "prompt" as BuilderStep,
  agentId: null,
  promptText: "",
  enhancedPrompt: null,
  variants: [],
  selectedVariant: null,
  iterations: [],
  workflow: [],
  testResults: null,
  isGenerating: false,
  isEnhancing: false,
  isTesting: false,
  isSaving: false,
};

export const useAgentBuilder = create<AgentBuilderState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Actions
        setStep: (step) => set({ currentStep: step }),

        setAgentId: (id) => set({ agentId: id }),

        setPrompt: (prompt) => set({ promptText: prompt }),

        setEnhancedPrompt: (prompt) => set({ enhancedPrompt: prompt }),

        setVariants: (variants) => set({ variants, currentStep: "variants" }),

        selectVariant: (variant) =>
          set({
            selectedVariant: variant,
            workflow: variant.workflow,
            currentStep: "iteration",
          }),

        addIteration: (iteration) =>
          set((state) => ({ iterations: [...state.iterations, iteration] })),

        updateWorkflow: (workflow) => set({ workflow }),

        setTestResults: (results) => set({ testResults: results }),

        // UI state setters
        setIsGenerating: (value) => set({ isGenerating: value }),
        setIsEnhancing: (value) => set({ isEnhancing: value }),
        setIsTesting: (value) => set({ isTesting: value }),
        setIsSaving: (value) => set({ isSaving: value }),

        reset: () => set(initialState),
      }),
      {
        name: "agent-builder-storage",
        partialize: (state) => ({
          promptText: state.promptText,
          enhancedPrompt: state.enhancedPrompt,
          selectedVariant: state.selectedVariant,
          workflow: state.workflow,
        }),
      },
    ),
  ),
);
