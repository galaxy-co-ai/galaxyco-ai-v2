import { useState, useCallback, useEffect, useRef } from 'react';
import { AgentTemplate } from '@/lib/constants/agent-templates';
import { createAgent, updateAgent } from '@/lib/actions/agent-actions';
import { useWorkspaceAuth } from '@/hooks/use-workspace-auth';

export interface AgentBuilderState {
  basicInfo: {
    name: string;
    icon: string;
    description: string;
    tags: string[];
  };
  configuration: {
    trigger: 'webhook' | 'schedule' | 'manual' | 'event';
    aiProvider: 'openai' | 'anthropic' | 'custom';
    model: string;
    temperature: number;
    systemPrompt: string;
    maxTokens?: number;
  };
  knowledgeBase: {
    enabled: boolean;
    scope?: 'all' | 'collections';
    collectionIds?: string[];
    maxResults?: number;
  };
  isDirty: boolean;
  isSaving: boolean;
  errors: Record<string, string>;
  agentId?: string;
  status: 'draft' | 'active' | 'paused';
}

interface ValidationErrors {
  [key: string]: string;
}

export const useAgentBuilder = () => {
  const [state, setState] = useState<AgentBuilderState>({
    basicInfo: {
      name: '',
      icon: '🤖',
      description: '',
      tags: [],
    },
    configuration: {
      trigger: 'webhook',
      aiProvider: 'openai',
      model: 'gpt-4',
      temperature: 0.7,
      systemPrompt: '',
    },
    knowledgeBase: {
      enabled: false,
      scope: 'all',
      collectionIds: [],
      maxResults: 5,
    },
    isDirty: false,
    isSaving: false,
    errors: {},
    status: 'draft',
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Validation functions
  const validateBasicInfo = useCallback(
    (basicInfo: AgentBuilderState['basicInfo']): ValidationErrors => {
      const errors: ValidationErrors = {};

      if (!basicInfo.name.trim()) {
        errors.name = 'Name is required';
      } else if (basicInfo.name.length < 3) {
        errors.name = 'Name must be at least 3 characters';
      } else if (basicInfo.name.length > 50) {
        errors.name = 'Name must not exceed 50 characters';
      }

      if (!basicInfo.description.trim()) {
        errors.description = 'Description is required';
      } else if (basicInfo.description.length < 10) {
        errors.description = 'Description must be at least 10 characters';
      } else if (basicInfo.description.length > 500) {
        errors.description = 'Description must not exceed 500 characters';
      }

      return errors;
    },
    [],
  );

  const validateConfiguration = useCallback(
    (configuration: AgentBuilderState['configuration']): ValidationErrors => {
      const errors: ValidationErrors = {};

      if (!configuration.systemPrompt.trim()) {
        errors.systemPrompt = 'System prompt is required';
      } else if (configuration.systemPrompt.length < 20) {
        errors.systemPrompt = 'System prompt must be at least 20 characters';
      } else if (configuration.systemPrompt.length > 2000) {
        errors.systemPrompt = 'System prompt must not exceed 2000 characters';
      }

      if (
        configuration.maxTokens &&
        (configuration.maxTokens < 1 || configuration.maxTokens > 128000)
      ) {
        errors.maxTokens = 'Max tokens must be between 1 and 128000';
      }

      return errors;
    },
    [],
  );

  const validateKnowledgeBase = useCallback(
    (knowledgeBase: AgentBuilderState['knowledgeBase']): ValidationErrors => {
      const errors: ValidationErrors = {};

      // If knowledge base is enabled and scope is 'collections', ensure at least one collection is selected
      if (knowledgeBase.enabled && knowledgeBase.scope === 'collections') {
        if (!knowledgeBase.collectionIds || knowledgeBase.collectionIds.length === 0) {
          errors.knowledgeBase =
            'Please select at least one collection when using specific collections scope';
        }
      }

      // Validate maxResults if knowledge base is enabled
      if (knowledgeBase.enabled && knowledgeBase.maxResults) {
        if (knowledgeBase.maxResults < 1 || knowledgeBase.maxResults > 20) {
          errors.knowledgeBaseMaxResults = 'Max results must be between 1 and 20';
        }
      }

      return errors;
    },
    [],
  );

  const validateAll = useCallback((): boolean => {
    const basicInfoErrors = validateBasicInfo(state.basicInfo);
    const configurationErrors = validateConfiguration(state.configuration);
    const knowledgeBaseErrors = validateKnowledgeBase(state.knowledgeBase);
    const allErrors = {
      ...basicInfoErrors,
      ...configurationErrors,
      ...knowledgeBaseErrors,
    };

    setState((prev) => ({ ...prev, errors: allErrors }));
    return Object.keys(allErrors).length === 0;
  }, [
    state.basicInfo,
    state.configuration,
    state.knowledgeBase,
    validateBasicInfo,
    validateConfiguration,
    validateKnowledgeBase,
  ]);

  // Apply template
  const applyTemplate = useCallback((template: AgentTemplate) => {
    setState((prev) => ({
      ...prev,
      basicInfo: {
        name: template.name,
        icon: template.icon,
        description: template.description,
        tags: template.tags,
      },
      configuration: {
        trigger: template.prefilledConfig.trigger,
        aiProvider: template.prefilledConfig.aiProvider,
        model: template.prefilledConfig.model,
        temperature: template.prefilledConfig.temperature,
        systemPrompt: template.prefilledConfig.systemPrompt,
        maxTokens: template.prefilledConfig.maxTokens,
      },
      knowledgeBase: template.prefilledConfig.knowledgeBase || {
        enabled: false,
        scope: 'all',
        collectionIds: [],
        maxResults: 5,
      },
      isDirty: true,
    }));
  }, []);

  // Update basic info
  const updateBasicInfo = useCallback(
    (updates: Partial<AgentBuilderState['basicInfo']>) => {
      setState((prev) => {
        const newBasicInfo = { ...prev.basicInfo, ...updates };
        const errors = validateBasicInfo(newBasicInfo);

        return {
          ...prev,
          basicInfo: newBasicInfo,
          isDirty: true,
          errors: { ...prev.errors, ...errors },
        };
      });
    },
    [validateBasicInfo],
  );

  // Update configuration
  const updateConfiguration = useCallback(
    (updates: Partial<AgentBuilderState['configuration']>) => {
      setState((prev) => {
        const newConfiguration = { ...prev.configuration, ...updates };
        const errors = validateConfiguration(newConfiguration);

        return {
          ...prev,
          configuration: newConfiguration,
          isDirty: true,
          errors: { ...prev.errors, ...errors },
        };
      });
    },
    [validateConfiguration],
  );

  // Update knowledge base configuration
  const updateKnowledgeBase = useCallback(
    (updates: Partial<AgentBuilderState['knowledgeBase']>) => {
      setState((prev) => {
        const newKnowledgeBase = { ...prev.knowledgeBase, ...updates };
        const errors = validateKnowledgeBase(newKnowledgeBase);

        return {
          ...prev,
          knowledgeBase: newKnowledgeBase,
          isDirty: true,
          errors: { ...prev.errors, ...errors },
        };
      });
    },
    [validateKnowledgeBase],
  );

  // Save draft (debounced)
  const { getAuthHeaders } = useWorkspaceAuth();

  const saveDraft = useCallback(async (): Promise<boolean> => {
    if (!validateAll()) {
      return false;
    }

    setState((prev) => ({ ...prev, isSaving: true }));

    try {
      const agentData = {
        name: state.basicInfo.name,
        description: state.basicInfo.description,
        icon: state.basicInfo.icon,
        tags: state.basicInfo.tags,
        type: 'custom' as const,
        trigger: state.configuration.trigger,
        aiProvider: state.configuration.aiProvider,
        model: state.configuration.model,
        systemPrompt: state.configuration.systemPrompt,
        temperature: state.configuration.temperature,
        maxTokens: state.configuration.maxTokens,
        knowledgeBase: state.knowledgeBase,
        status: 'draft' as const,
      };

      const headers = await getAuthHeaders();

      let result;
      if (state.agentId) {
        // Update existing agent
        result = await updateAgent(state.agentId, agentData, headers);
      } else {
        // Create new agent
        result = await createAgent(agentData, headers);
      }

      if (result.success && result.data) {
        setState((prev) => ({
          ...prev,
          agentId: result.data.id,
          isDirty: false,
          isSaving: false,
        }));
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          isSaving: false,
          errors: {
            ...prev.errors,
            save: result.error || 'Failed to save agent',
          },
        }));
        return false;
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isSaving: false,
        errors: { ...prev.errors, save: 'An unexpected error occurred' },
      }));
      return false;
    }
  }, [state, validateAll]);

  // Debounced autosave
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (state.isDirty && !state.isSaving) {
        saveDraft();
      }
    }, 30000); // 30 seconds
  }, [state.isDirty, state.isSaving, saveDraft]);

  // Publish agent
  const publish = useCallback(async (): Promise<boolean> => {
    if (!validateAll()) {
      return false;
    }

    setState((prev) => ({ ...prev, isSaving: true }));

    try {
      const agentData = {
        name: state.basicInfo.name,
        description: state.basicInfo.description,
        icon: state.basicInfo.icon,
        tags: state.basicInfo.tags,
        type: 'custom' as const,
        trigger: state.configuration.trigger,
        aiProvider: state.configuration.aiProvider,
        model: state.configuration.model,
        systemPrompt: state.configuration.systemPrompt,
        temperature: state.configuration.temperature,
        maxTokens: state.configuration.maxTokens,
        knowledgeBase: state.knowledgeBase,
        status: 'active' as const,
      };

      const headers = await getAuthHeaders();

      let result;
      if (state.agentId) {
        result = await updateAgent(state.agentId, agentData, headers);
      } else {
        result = await createAgent(agentData, headers);
      }

      if (result.success && result.data) {
        setState((prev) => ({
          ...prev,
          agentId: result.data.id,
          status: 'active',
          isDirty: false,
          isSaving: false,
        }));
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          isSaving: false,
          errors: {
            ...prev.errors,
            publish: result.error || 'Failed to publish agent',
          },
        }));
        return false;
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isSaving: false,
        errors: { ...prev.errors, publish: 'An unexpected error occurred' },
      }));
      return false;
    }
  }, [state, validateAll]);

  // Autosave effect
  useEffect(() => {
    if (state.isDirty && !state.isSaving) {
      debouncedSave();
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state.isDirty, state.isSaving, debouncedSave]);

  return {
    state,
    applyTemplate,
    updateBasicInfo,
    updateConfiguration,
    updateKnowledgeBase,
    saveDraft,
    publish,
    validateAll,
  };
};
