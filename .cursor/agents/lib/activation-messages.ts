/**
 * Agent Activation Messages
 * Copy-paste messages to start new chat sessions with each agent
 */

import { AgentId } from '../schemas/agent-state.schema';
import fs from 'fs/promises';
import path from 'path';

export interface ActivationMessage {
  agentId: AgentId;
  agentName: string;
  message: string;
  color: string;
}

/**
 * Generate activation message for an agent
 */
export async function generateActivationMessage(agentId: AgentId): Promise<ActivationMessage> {
  const agentConfig = getAgentConfig(agentId);
  const hasHandoff = await checkForHandoff(agentId);

  const baseMessage = getBaseActivationMessage(agentId, agentConfig, hasHandoff);

  return {
    agentId,
    agentName: agentConfig.name,
    message: baseMessage,
    color: agentConfig.color,
  };
}

/**
 * Get all activation messages
 */
export async function getAllActivationMessages(): Promise<ActivationMessage[]> {
  const agentIds: AgentId[] = [
    'frontend-architect',
    'backend-systems',
    'devops-infrastructure',
    'quality-testing',
  ];

  return Promise.all(agentIds.map((id) => generateActivationMessage(id)));
}

/**
 * Check if handoff file exists for agent
 */
async function checkForHandoff(agentId: AgentId): Promise<boolean> {
  const stateDir = path.join(process.cwd(), '.cursor/agents/state', agentId);
  try {
    const files = await fs.readdir(stateDir);
    return files.some((f) => f.startsWith('handoff-') && f.endsWith('.md'));
  } catch {
    return false;
  }
}

/**
 * Get base activation message
 */
function getBaseActivationMessage(
  agentId: AgentId,
  config: AgentConfig,
  hasHandoff: boolean,
): string {
  if (hasHandoff) {
    return `Activate ${config.name} Agent

🤖 I am the ${config.name} Agent for GalaxyCo.ai

✅ Handoff file detected - Loading previous session state...
📂 Restoring context from last session...
🎯 Ready to continue where we left off!

My specialization:
${config.expertise.map((e) => `- ${e}`).join('\n')}

My scope:
${config.scope.directories.map((d) => `- ${d}`).join('\n')}

Please read my handoff file and continue with the work outlined there.`;
  }

  return `Activate ${config.name} Agent

🤖 I am the ${config.name} Agent for GalaxyCo.ai

🆕 Starting new session - No previous handoff found

My specialization:
${config.expertise.map((e) => `- ${e}`).join('\n')}

My scope:
${config.scope.directories.map((d) => `- ${d}`).join('\n')}

Ready to help with ${config.name.toLowerCase()} tasks! What would you like me to work on?`;
}

/**
 * Agent configuration
 */
interface AgentConfig {
  name: string;
  color: string;
  expertise: string[];
  scope: {
    directories: string[];
    filePatterns: string[];
  };
}

function getAgentConfig(agentId: AgentId): AgentConfig {
  const configs: Record<AgentId, AgentConfig> = {
    'frontend-architect': {
      name: 'Frontend Architect',
      color: '🔵',
      expertise: [
        'React/Next.js components and pages',
        'UI/UX design and implementation',
        'Client-side state management',
        'Styling (Tailwind, shadcn/ui, Kibo UI)',
        'Form validation and user interactions',
        'Accessibility and responsive design',
      ],
      scope: {
        directories: [
          'apps/web/app/',
          'apps/web/components/',
          'apps/web/hooks/',
          'apps/web/styles/',
          'apps/web/lib/ui/',
        ],
        filePatterns: ['**/*.tsx', '**/*.ts', '**/*.css'],
      },
    },
    'backend-systems': {
      name: 'Backend Systems',
      color: '🟢',
      expertise: [
        'NestJS API development',
        'Database schema and migrations',
        'Server actions and API routes',
        'Business logic and data validation',
        'Authentication and authorization',
        'Multi-tenant data isolation',
      ],
      scope: {
        directories: [
          'apps/api/',
          'apps/web/app/api/',
          'apps/web/lib/actions/',
          'packages/database/',
        ],
        filePatterns: ['**/*.route.ts', '**/*.controller.ts', '**/*.service.ts'],
      },
    },
    'devops-infrastructure': {
      name: 'DevOps & Infrastructure',
      color: '🟠',
      expertise: [
        'Vercel deployment configuration',
        'GitHub Actions workflows',
        'Docker containerization',
        'AWS infrastructure',
        'Monitoring and logging',
        'Build optimization',
      ],
      scope: {
        directories: ['.github/workflows/', 'infra/', 'scripts/deployment/'],
        filePatterns: ['**/Dockerfile', '**/*.yml', '**/*.yaml', 'vercel.json'],
      },
    },
    'quality-testing': {
      name: 'Quality & Testing',
      color: '🟣',
      expertise: [
        'Unit testing (Vitest)',
        'Integration testing',
        'E2E testing (Playwright)',
        'Code quality and linting',
        'Test coverage monitoring',
        'Performance testing',
        'Accessibility testing',
      ],
      scope: {
        directories: ['tests/'],
        filePatterns: ['**/*.test.ts', '**/*.spec.ts', 'playwright.config.ts'],
      },
    },
  };

  return configs[agentId];
}

/**
 * Generate formatted activation messages for display
 */
export async function generateFormattedActivationMessages(): Promise<string> {
  const messages = await getAllActivationMessages();

  let output = '# 🤖 Agent Activation Messages\n\n';
  output += 'Copy and paste the message below to activate each agent:\n\n';
  output += '---\n\n';

  for (const msg of messages) {
    output += `## ${msg.color} ${msg.agentName}\n\n`;
    output += '```\n';
    output += msg.message;
    output += '\n```\n\n';
    output += '---\n\n';
  }

  return output;
}
