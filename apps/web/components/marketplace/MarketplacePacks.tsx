'use client';

import AgentPackCard from './AgentPackCard';
import { colors } from '@/lib/constants/design-system';
import { useState } from 'react';

// Mock data - will be replaced with API call
const STARTER_PACKS = [
  {
    id: '1',
    name: 'Founder Ops Pack',
    description: 'Everything you need to run your startup efficiently. Automate browser tasks, capture meeting notes, and orchestrate cross-app workflows.',
    category: 'Productivity',
    agentCount: 4,
    agentNames: [
      'Browser Automation Agent',
      'Meeting Notes Orchestrator',
      'Cross-App Do-It-For-Me',
      'Task & Roadmap Agent'
    ],
    badgeText: 'STARTER PACK',
    rating: 480, // 4.8 stars
    reviewCount: 142,
    installCount: 1847,
    installs7d: 234,
    kpis: {
      timeSavedPerWeek: '12 hrs/wk',
      setupTime: '5 mins',
      completionRate: 92
    },
    integrations: ['Gmail', 'Calendar', 'Slack', 'Notion', 'Browser'],
    tags: ['startup', 'ops', 'automation']
  },
  {
    id: '2',
    name: 'Sales GTM Pack',
    description: 'Accelerate your go-to-market motion. Prospect smarter, personalize outreach, and keep your CRM up-to-date automatically.',
    category: 'Sales',
    agentCount: 4,
    agentNames: [
      'Sales GTM Copilot',
      'Research & Web Summary Agent',
      'Email Automation Agent',
      'Data Enrichment Agent'
    ],
    badgeText: 'POPULAR',
    rating: 470, // 4.7 stars
    reviewCount: 198,
    installCount: 2134,
    installs7d: 312,
    kpis: {
      timeSavedPerWeek: '15 hrs/wk',
      setupTime: '8 mins',
      completionRate: 88
    },
    integrations: ['HubSpot', 'Salesforce', 'Gmail', 'LinkedIn', 'Slack'],
    tags: ['sales', 'crm', 'prospecting']
  },
  {
    id: '3',
    name: 'Knowledge Hub Pack',
    description: 'Build your AI-powered knowledge base. Get instant answers with citations, summarize research, and create content from your sources.',
    category: 'Knowledge',
    agentCount: 3,
    agentNames: [
      'Knowledge RAG Agent',
      'Research & Web Summary Agent',
      'Content Generation Agent'
    ],
    badgeText: 'NEW',
    rating: 485, // 4.85 stars
    reviewCount: 87,
    installCount: 923,
    installs7d: 156,
    kpis: {
      timeSavedPerWeek: '10 hrs/wk',
      setupTime: '6 mins',
      completionRate: 93
    },
    integrations: ['Notion', 'Google Drive', 'Confluence', 'Slack'],
    tags: ['knowledge', 'research', 'rag']
  },
  {
    id: '4',
    name: 'Productivity Pack',
    description: 'Get more done with less effort. Orchestrate tasks across apps, automate meeting follow-ups, and manage your daily workflow.',
    category: 'Productivity',
    agentCount: 4,
    agentNames: [
      'Cross-App Do-It-For-Me',
      'Meeting Notes Orchestrator',
      'Task & Roadmap Agent',
      'Email Triage Agent'
    ],
    rating: 475, // 4.75 stars
    reviewCount: 156,
    installCount: 1567,
    installs7d: 203,
    kpis: {
      timeSavedPerWeek: '14 hrs/wk',
      setupTime: '7 mins',
      completionRate: 90
    },
    integrations: ['Gmail', 'Calendar', 'Slack', 'Notion', 'Asana'],
    tags: ['productivity', 'workflow', 'automation']
  },
  {
    id: '5',
    name: 'Trust & Compliance Pack',
    description: 'Ensure security and compliance across your AI operations. Check agents, extract data safely, and maintain audit trails.',
    category: 'Security',
    agentCount: 3,
    agentNames: [
      'Trust & Security Checker',
      'Data Extraction Agent',
      'Audit & Compliance Agent'
    ],
    rating: 460, // 4.6 stars
    reviewCount: 72,
    installCount: 734,
    installs7d: 98,
    kpis: {
      timeSavedPerWeek: '6 hrs/wk',
      setupTime: '10 mins',
      completionRate: 96
    },
    integrations: ['Supabase', 'Google Sheets', 'AWS', 'Slack'],
    tags: ['security', 'compliance', 'audit']
  }
];

interface MarketplacePacksProps {
  onInstallPack?: (packId: string) => void;
  onPreviewPack?: (packId: string) => void;
}

export default function MarketplacePacks({ onInstallPack, onPreviewPack }: MarketplacePacksProps) {
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');

  const sortedPacks = [...STARTER_PACKS].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.installCount - a.installCount;
    } else if (sortBy === 'newest') {
      return (b.installs7d || 0) - (a.installs7d || 0);
    } else {
      return b.rating - a.rating;
    }
  });

  return (
    <div style={{
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '3rem 1.5rem'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '2.5rem'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: colors.text.primary,
          marginBottom: '0.75rem'
        }}>
          Starter Packs
        </h2>
        <p style={{
          fontSize: '1.125rem',
          color: colors.text.secondary,
          marginBottom: '2rem'
        }}>
          Pre-configured agent teams for instant productivity. Install a pack to get multiple agents working together.
        </p>

        {/* Sort & Filter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <span style={{
            fontSize: '0.875rem',
            color: colors.text.tertiary,
            fontWeight: '500'
          }}>
            Sort by:
          </span>
          <div style={{
            display: 'flex',
            gap: '0.5rem'
          }}>
            {(['popular', 'newest', 'rating'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                style={{
                  padding: '0.5rem 1rem',
                  background: sortBy === option ? colors.primary[500] : 'transparent',
                  color: sortBy === option ? 'white' : colors.text.secondary,
                  border: `1px solid ${sortBy === option ? colors.primary[500] : colors.border.default}`,
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize'
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '2rem'
      }}>
        {sortedPacks.map((pack) => (
          <AgentPackCard
            key={pack.id}
            pack={pack}
            onInstall={onInstallPack}
            onPreview={onPreviewPack}
          />
        ))}
      </div>

      {/* Stats Footer */}
      <div style={{
        marginTop: '4rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(77, 111, 255, 0.05) 0%, rgba(77, 111, 255, 0.02) 100%)',
        borderRadius: '16px',
        border: `1px solid ${colors.primary[100]}`,
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: colors.text.primary,
          marginBottom: '0.5rem'
        }}>
          Can&apos;t find the perfect pack?
        </h3>
        <p style={{
          fontSize: '1rem',
          color: colors.text.secondary,
          marginBottom: '1.5rem'
        }}>
          Browse individual agents or create your own custom pack with the Agent Builder
        </p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <button
            style={{
              padding: '0.875rem 1.5rem',
              background: colors.primary[500],
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.primary[600];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.primary[500];
            }}
          >
            Browse All Agents
          </button>
          <button
            style={{
              padding: '0.875rem 1.5rem',
              background: 'transparent',
              color: colors.primary[500],
              border: `2px solid ${colors.primary[500]}`,
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.primary[50];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Create Custom Pack
          </button>
        </div>
      </div>
    </div>
  );
}
