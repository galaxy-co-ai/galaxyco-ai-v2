export type TestTriggerType = 'manual' | 'scheduled' | 'event';

export interface TestInputs {
  triggerType: TestTriggerType;
  sampleData: Record<string, any>;
  mockIntegrations: boolean;
}

export interface TestPlaygroundInput extends TestInputs {
  sampleTriggerData: Record<string, any>;
}

export interface TestExecutionLog {
  id: string;
  step: string;
  status: 'running' | 'completed' | 'failed';
  message: string;
  timestamp: Date;
  duration?: number;
  details?: string;
  error?: string;
}

export interface TestAgentOutput {
  id: string;
  type: 'ai-result' | 'notification' | 'data';
  content: string;
  timestamp: Date;
}

export interface TestResult {
  success: boolean;
  logs: TestExecutionLog[];
  outputs: TestAgentOutput[];
  totalDuration: number;
  executedSteps: number;
  totalSteps: number;
  error?: string;
}

// Legacy types for backward compatibility
export interface StepExecution {
  id: string;
  label: string;
  status: 'queued' | 'running' | 'success' | 'error';
  startedAt?: number;
  endedAt?: number;
  durationMs?: number;
  output?: any;
  error?: string | null;
}

export interface AgentOutput {
  type: 'document' | 'email' | 'notification';
  title?: string;
  content: any;
  metadata?: Record<string, any>;
}
