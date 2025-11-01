'use client';

import { PageShell } from '@/components/templates/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Search as SearchIcon,
  Sparkles,
  FileText,
  Users,
  Workflow,
  ChevronDown,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

type SearchCategory = 'agents' | 'documents' | 'team' | 'workflows';

interface SearchResult {
  id: string;
  category: SearchCategory;
  title: string;
  snippet: string;
  url: string;
  metadata: Record<string, string>;
}

const mockResults: SearchResult[] = [
  // Agents
  {
    id: 'agent_001',
    category: 'agents',
    title: 'Sales Lead Qualifier',
    snippet: 'AI agent that automatically qualifies sales leads based on scoring criteria...',
    url: '/agents/agent_001',
    metadata: { status: 'Active', runs: '1,234' },
  },
  {
    id: 'agent_002',
    category: 'agents',
    title: 'Email Generator',
    snippet: 'Generate personalized sales emails using AI-powered templates and customer data...',
    url: '/agents/agent_002',
    metadata: { status: 'Active', runs: '892' },
  },
  {
    id: 'agent_003',
    category: 'agents',
    title: 'Content Optimizer',
    snippet: 'Optimize marketing content for SEO and readability using advanced AI analysis...',
    url: '/agents/agent_003',
    metadata: { status: 'Active', runs: '567' },
  },
  {
    id: 'agent_004',
    category: 'agents',
    title: 'Data Validator',
    snippet: 'Validate and clean customer data automatically to maintain database integrity...',
    url: '/agents/agent_004',
    metadata: { status: 'Inactive', runs: '234' },
  },
  {
    id: 'agent_005',
    category: 'agents',
    title: 'Sentiment Analyzer',
    snippet: 'Analyze customer feedback and reviews to gauge sentiment and satisfaction levels...',
    url: '/agents/agent_005',
    metadata: { status: 'Active', runs: '1,567' },
  },

  // Documents
  {
    id: 'doc_001',
    category: 'documents',
    title: 'Sales Playbook 2024.pdf',
    snippet: 'Complete sales methodology and process documentation for the 2024 fiscal year...',
    url: '/documents/doc_001',
    metadata: { type: 'PDF', size: '2.4 MB', modified: '2 days ago' },
  },
  {
    id: 'doc_002',
    category: 'documents',
    title: 'Q4 Sales Report.xlsx',
    snippet: 'Quarterly sales performance report including revenue, pipeline, and forecasts...',
    url: '/documents/doc_002',
    metadata: { type: 'Excel', size: '1.2 MB', modified: '1 week ago' },
  },
  {
    id: 'doc_003',
    category: 'documents',
    title: 'Product Roadmap Q1 2024.pdf',
    snippet: 'Strategic product roadmap outlining key initiatives and milestones for Q1...',
    url: '/documents/doc_003',
    metadata: { type: 'PDF', size: '3.1 MB', modified: '3 days ago' },
  },
  {
    id: 'doc_004',
    category: 'documents',
    title: 'Marketing Strategy.docx',
    snippet: 'Comprehensive marketing strategy document covering campaigns, channels, and goals...',
    url: '/documents/doc_004',
    metadata: { type: 'Word', size: '0.9 MB', modified: '5 days ago' },
  },
  {
    id: 'doc_005',
    category: 'documents',
    title: 'Customer Personas.pdf',
    snippet: 'Detailed customer persona profiles based on market research and data analysis...',
    url: '/documents/doc_005',
    metadata: { type: 'PDF', size: '1.8 MB', modified: '1 week ago' },
  },

  // Team Members
  {
    id: 'member_001',
    category: 'team',
    title: 'Sarah Johnson',
    snippet: 'Product Manager at GalaxyCo • sarah.johnson@company.com',
    url: '/team/member_001',
    metadata: { role: 'Product Manager', department: 'Product' },
  },
  {
    id: 'member_002',
    category: 'team',
    title: 'Michael Chen',
    snippet: 'Senior Developer at GalaxyCo • michael.chen@company.com',
    url: '/team/member_002',
    metadata: { role: 'Senior Developer', department: 'Engineering' },
  },
  {
    id: 'member_003',
    category: 'team',
    title: 'Emily Rodriguez',
    snippet: 'UX Designer at GalaxyCo • emily.rodriguez@company.com',
    url: '/team/member_003',
    metadata: { role: 'UX Designer', department: 'Design' },
  },

  // Workflows
  {
    id: 'wf_001',
    category: 'workflows',
    title: 'Lead Nurture Campaign',
    snippet: 'Automated workflow for nurturing sales leads through personalized email sequences...',
    url: '/workflows/wf_001',
    metadata: { status: 'Active', executions: '1,234' },
  },
  {
    id: 'wf_002',
    category: 'workflows',
    title: 'Customer Onboarding Flow',
    snippet: 'Step-by-step onboarding process for new customers including training and setup...',
    url: '/workflows/wf_002',
    metadata: { status: 'Active', executions: '567' },
  },
  {
    id: 'wf_003',
    category: 'workflows',
    title: 'Data Sync Pipeline',
    snippet: 'Automated data synchronization between CRM, marketing platform, and database...',
    url: '/workflows/wf_003',
    metadata: { status: 'Active', executions: '8,901' },
  },
  {
    id: 'wf_004',
    category: 'workflows',
    title: 'Weekly Report Generator',
    snippet: 'Generate and distribute weekly performance reports to stakeholders automatically...',
    url: '/workflows/wf_004',
    metadata: { status: 'Active', executions: '234' },
  },
];

const categoryConfig: Record<
  SearchCategory,
  { icon: React.ReactNode; label: string; color: string }
> = {
  agents: {
    icon: <Sparkles className="h-4 w-4" />,
    label: 'Agents',
    color: 'text-purple-500',
  },
  documents: {
    icon: <FileText className="h-4 w-4" />,
    label: 'Documents',
    color: 'text-blue-500',
  },
  team: {
    icon: <Users className="h-4 w-4" />,
    label: 'Team Members',
    color: 'text-green-500',
  },
  workflows: {
    icon: <Workflow className="h-4 w-4" />,
    label: 'Workflows',
    color: 'text-orange-500',
  },
};

function highlightText(text: string, query: string): React.ReactNode {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-900">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function SearchResultItem({ result, query }: { result: SearchResult; query: string }) {
  const config = categoryConfig[result.category];

  return (
    <Card className="p-4 transition-shadow hover:shadow-md">
      <div className="flex gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${config.color}`}
        >
          {config.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-foreground hover:text-primary">
                <a href={result.url}>{highlightText(result.title, query)}</a>
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {highlightText(result.snippet, query)}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Badge variant="secondary" className="text-xs">
                  {config.label}
                </Badge>
                {Object.entries(result.metadata).map(([key, value]) => (
                  <span key={key} className="text-xs text-muted-foreground">
                    {key}: {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function CategorySection({
  category,
  results,
  query,
  isExpanded,
  onToggle,
}: {
  category: SearchCategory;
  results: SearchResult[];
  query: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const config = categoryConfig[category];

  return (
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-lg bg-muted/50 p-3 hover:bg-muted"
      >
        <div className="flex items-center gap-3">
          <div className={config.color}>{config.icon}</div>
          <span className="font-semibold">{config.label}</span>
          <Badge variant="secondary">{results.length}</Badge>
        </div>
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {isExpanded && (
        <div className="space-y-3">
          {results.map((result) => (
            <SearchResultItem key={result.id} result={result} query={query} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState<SearchCategory[]>([
    'agents',
    'documents',
    'team',
    'workflows',
  ]);
  const [expandedCategories, setExpandedCategories] = useState<SearchCategory[]>([
    'agents',
    'documents',
    'team',
    'workflows',
  ]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    // Save search query to recent searches
    if (query && !recentSearches.includes(query)) {
      const updated = [query, ...recentSearches].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  }, [query, recentSearches]);

  const handleCategoryToggle = (category: SearchCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  };

  const handleExpandToggle = (category: SearchCategory) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  };

  const filteredResults = mockResults.filter((result) =>
    selectedCategories.includes(result.category),
  );

  const resultsByCategory = selectedCategories.map((category) => ({
    category,
    results: filteredResults.filter((r) => r.category === category),
  }));

  const totalResults = filteredResults.length;

  return (
    <PageShell
      title="Search Results"
      subtitle={query ? `${totalResults} results for "${query}"` : 'Enter a search query'}
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Search' }]}
    >
      <div className="space-y-6">
        {/* Search Input */}
        <Card className="p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search agents, documents, team members, workflows..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {recentSearches.length > 0 && !query && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Recent Searches</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(search)}
                    className="text-xs"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="mb-4 font-semibold">Filters</h3>
              <div className="space-y-3">
                <p className="text-sm font-medium">Categories</p>
                {(Object.keys(categoryConfig) as SearchCategory[]).map((category) => {
                  const config = categoryConfig[category];
                  const count = mockResults.filter((r) => r.category === category).length;

                  return (
                    <div key={category} className="flex items-center gap-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label
                        htmlFor={category}
                        className="flex flex-1 cursor-pointer items-center gap-2 text-sm"
                      >
                        <div className={config.color}>{config.icon}</div>
                        <span>{config.label}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {count}
                        </Badge>
                      </label>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="space-y-6 lg:col-span-3">
            {totalResults > 0 ? (
              resultsByCategory.map(
                ({ category, results }) =>
                  results.length > 0 && (
                    <CategorySection
                      key={category}
                      category={category}
                      results={results}
                      query={query}
                      isExpanded={expandedCategories.includes(category)}
                      onToggle={() => handleExpandToggle(category)}
                    />
                  ),
              )
            ) : (
              <Card className="p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <SearchIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No results found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search query or filters.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
