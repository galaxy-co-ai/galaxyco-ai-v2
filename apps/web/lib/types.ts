/**
 * GalaxyCo.ai TypeScript Types
 * Complete type definitions for nuclear rebuild
 * October 15, 2025
 */

// Base types
export type ID = string
export type Timestamp = string // ISO string

// User types
export interface User {
  id: ID
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: UserRole
  workspaceId: ID
  preferences: UserPreferences
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type UserRole = 'admin' | 'user' | 'viewer'

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications: NotificationPreferences
  timezone: string
  language: string
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  workflow: boolean
  agents: boolean
}

// Workspace/Tenant types
export interface Workspace {
  id: ID
  name: string
  slug: string
  plan: WorkspacePlan
  settings: WorkspaceSettings
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type WorkspacePlan = 'free' | 'pro' | 'enterprise'

export interface WorkspaceSettings {
  allowedDomains: string[]
  maxAgents: number
  maxWorkflows: number
  retentionDays: number
}

// Agent types
export type AgentType = 'research' | 'email' | 'crm' | 'workflow'
export type AgentStatus = 'idle' | 'running' | 'paused' | 'error' | 'disabled'

export interface Agent {
  id: ID
  workspaceId: ID
  type: AgentType
  name: string
  description: string
  status: AgentStatus
  config: AgentConfig
  metrics: AgentMetrics
  lastRunAt?: Timestamp
  nextRunAt?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: ID
}

export interface AgentConfig {
  // Base config shared by all agents
  enabled: boolean
  schedule: AgentSchedule
  maxRetries: number
  timeout: number
  
  // Type-specific config
  research?: ResearchAgentConfig
  email?: EmailAgentConfig
  crm?: CRMAgentConfig
  workflow?: WorkflowAgentConfig
}

export interface AgentSchedule {
  type: 'manual' | 'interval' | 'cron'
  interval?: number // minutes
  cron?: string
}

export interface ResearchAgentConfig {
  sources: string[]
  searchDepth: 'shallow' | 'deep'
  confidenceThreshold: number
  languages: string[]
  excludeTerms: string[]
}

export interface EmailAgentConfig {
  templates: EmailTemplate[]
  tone: 'professional' | 'casual' | 'friendly' | 'formal'
  maxEmailsPerDay: number
  waitBetweenEmails: number // hours
  trackOpens: boolean
  trackClicks: boolean
}

export interface CRMAgentConfig {
  crmProvider: 'salesforce' | 'hubspot' | 'pipedrive' | 'custom'
  syncDirection: 'import' | 'export' | 'bidirectional'
  fieldMappings: Record<string, string>
  autoSync: boolean
  syncInterval: number // minutes
}

export interface WorkflowAgentConfig {
  steps: WorkflowStep[]
  variables: Record<string, unknown>
  errorHandling: 'stop' | 'continue' | 'retry'
}

export interface AgentMetrics {
  totalRuns: number
  successfulRuns: number
  failedRuns: number
  averageRuntime: number // seconds
  lastError?: string
  performance: PerformanceMetrics
}

export interface PerformanceMetrics {
  successRate: number // 0-100
  averageLatency: number // ms
  throughput: number // operations per minute
  errorRate: number // 0-100
}

// Workflow types
export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'archived'
export type WorkflowStepType = 'research' | 'email' | 'crm' | 'webhook' | 'condition' | 'delay'

export interface Workflow {
  id: ID
  workspaceId: ID
  name: string
  description: string
  status: WorkflowStatus
  steps: WorkflowStep[]
  variables: Record<string, unknown>
  metrics: WorkflowMetrics
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: ID
}

export interface WorkflowStep {
  id: ID
  type: WorkflowStepType
  name: string
  config: WorkflowStepConfig
  position: { x: number; y: number }
  nextSteps: ID[]
  previousSteps: ID[]
}

export interface WorkflowStepConfig {
  // Common config
  timeout?: number
  retries?: number
  
  // Type-specific config
  [key: string]: unknown
}

export interface WorkflowMetrics {
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  averageExecutionTime: number
  lastExecutedAt?: Timestamp
}

// Email types
export type EmailStatus = 
  | 'draft' 
  | 'pending_review' 
  | 'approved' 
  | 'sent' 
  | 'delivered'
  | 'opened'
  | 'clicked'
  | 'replied' 
  | 'bounced'
  | 'spam'

export interface Email {
  id: ID
  workspaceId: ID
  prospectId?: ID
  prospect?: Prospect
  agentId: ID
  agent: Agent
  subject: string
  body: string
  htmlBody?: string
  status: EmailStatus
  confidenceScore: number
  researchInsights: ResearchInsight[]
  attachments: EmailAttachment[]
  scheduledAt?: Timestamp
  sentAt?: Timestamp
  deliveredAt?: Timestamp
  openedAt?: Timestamp
  clickedAt?: Timestamp
  repliedAt?: Timestamp
  bouncedAt?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface EmailTemplate {
  id: ID
  name: string
  subject: string
  body: string
  variables: string[]
  tags: string[]
}

export interface EmailAttachment {
  id: ID
  filename: string
  contentType: string
  size: number
  url: string
}

// Prospect types
export type ProspectStatus = 
  | 'new' 
  | 'researching'
  | 'enriched' 
  | 'email_sent' 
  | 'replied' 
  | 'meeting_booked' 
  | 'qualified'
  | 'lost'
  | 'archived'

export type EnrichmentStatus = 
  | 'pending'
  | 'in_progress' 
  | 'completed' 
  | 'failed'

export interface Prospect {
  id: ID
  workspaceId: ID
  name: string
  email: string
  company?: string
  title?: string
  phone?: string
  linkedinUrl?: string
  status: ProspectStatus
  enrichmentStatus: EnrichmentStatus
  enrichmentData?: EnrichmentData
  tags: string[]
  customFields: Record<string, unknown>
  lastContactedAt?: Timestamp
  nextContactAt?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: ID
}

export interface EnrichmentData {
  personalInfo?: PersonalInfo
  companyInfo?: CompanyInfo
  socialProfiles?: SocialProfile[]
  technographics?: Technology[]
  newsAndEvents?: NewsItem[]
  confidenceScore: number
  sources: string[]
  enrichedAt: Timestamp
}

export interface PersonalInfo {
  fullName: string
  firstName: string
  lastName: string
  title: string
  email: string
  phone?: string
  location?: string
  bio?: string
  education?: Education[]
  experience?: Experience[]
}

export interface CompanyInfo {
  name: string
  domain: string
  industry: string
  size: CompanySize
  revenue?: string
  founded?: number
  location?: string
  description?: string
  technologies?: string[]
}

export type CompanySize = 
  | '1-10' 
  | '11-50' 
  | '51-200' 
  | '201-500' 
  | '501-1000' 
  | '1001-5000' 
  | '5001-10000' 
  | '10000+'

export interface SocialProfile {
  platform: string
  url: string
  username?: string
  followers?: number
  verified?: boolean
}

export interface Technology {
  name: string
  category: string
  confidence: number
}

export interface NewsItem {
  title: string
  url: string
  publishedAt: Timestamp
  source: string
  sentiment: 'positive' | 'neutral' | 'negative'
}

export interface Education {
  institution: string
  degree?: string
  field?: string
  startYear?: number
  endYear?: number
}

export interface Experience {
  company: string
  title: string
  startDate?: string
  endDate?: string
  description?: string
}

// Research types
export interface ResearchInsight {
  id: ID
  type: ResearchInsightType
  title: string
  content: string
  source: string
  sourceUrl?: string
  confidenceScore: number
  relevanceScore: number
  createdAt: Timestamp
}

export type ResearchInsightType = 
  | 'company_news'
  | 'person_news'
  | 'industry_trend'
  | 'technology_adoption'
  | 'funding_event'
  | 'job_posting'
  | 'social_activity'
  | 'competitor_activity'

// Notification types
export type NotificationType = 
  | 'agent_success'
  | 'agent_error'
  | 'workflow_complete'
  | 'workflow_error'
  | 'email_sent'
  | 'email_reply'
  | 'prospect_qualified'
  | 'system_alert'

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface Notification {
  id: ID
  workspaceId: ID
  userId: ID
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  metadata?: Record<string, unknown>
  readAt?: Timestamp
  archivedAt?: Timestamp
  createdAt: Timestamp
}

// API types
export interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: APIError
  meta?: APIMetadata
}

export interface APIError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface APIMetadata {
  page?: number
  pageSize?: number
  total?: number
  hasMore?: boolean
}

export interface PaginatedResponse<T = unknown> extends APIResponse<T[]> {
  meta: APIMetadata & {
    page: number
    pageSize: number
    total: number
    hasMore: boolean
  }
}

// Form types
export interface FormField {
  name: string
  label: string
  type: FormFieldType
  placeholder?: string
  required?: boolean
  validation?: ValidationRule[]
  options?: FormFieldOption[]
}

export type FormFieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'textarea' 
  | 'select' 
  | 'multiselect'
  | 'checkbox' 
  | 'radio' 
  | 'date' 
  | 'number'
  | 'url'
  | 'file'

export interface FormFieldOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ValidationRule {
  type: 'required' | 'email' | 'url' | 'min' | 'max' | 'pattern' | 'custom'
  value?: number | string | RegExp
  message: string
}

// Chart and analytics types
export interface ChartDataPoint {
  x: string | number
  y: number
  label?: string
  color?: string
}

export interface MetricCard {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease'
  icon?: string
  color?: string
}

export interface DashboardStat extends MetricCard {
  trend?: ChartDataPoint[]
  target?: number
  unit?: string
}

// Search and filter types
export interface SearchFilters {
  query?: string
  status?: string[]
  type?: string[]
  dateRange?: DateRange
  tags?: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface DateRange {
  startDate: string
  endDate: string
}

// Integration types
export interface Integration {
  id: ID
  workspaceId: ID
  type: IntegrationType
  name: string
  status: IntegrationStatus
  config: IntegrationConfig
  credentials: IntegrationCredentials
  lastSyncAt?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type IntegrationType = 
  | 'crm'
  | 'email'
  | 'calendar' 
  | 'linkedin'
  | 'slack'
  | 'webhook'

export type IntegrationStatus = 'connected' | 'disconnected' | 'error'

export interface IntegrationConfig {
  syncInterval?: number
  fieldMappings?: Record<string, string>
  webhookUrl?: string
  [key: string]: unknown
}

export interface IntegrationCredentials {
  // Never include actual credentials, only metadata
  type: 'oauth' | 'api_key' | 'basic_auth'
  expiresAt?: Timestamp
  scopes?: string[]
  [key: string]: unknown
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

export interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ConfidenceScoreProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}