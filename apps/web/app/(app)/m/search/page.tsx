import { Metadata } from 'next';
import { Search, Clock, TrendingUp, FileText, Users, Calendar, Bot, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

export const metadata: Metadata = {
  title: 'Search | GalaxyCo.ai',
  description: 'Global search',
};

// Mock recent searches
const recentSearches = [
  'Q4 marketing strategy',
  'Sarah Johnson',
  'API documentation',
  'Team meeting notes',
];

// Mock trending
const trending = [
  { term: 'Automation workflows', count: 234 },
  { term: 'Sales reports', count: 189 },
  { term: 'Contact management', count: 156 },
];

// Mock search results
const searchResults = [
  {
    id: '1',
    type: 'agent',
    title: 'Marketing Automation Agent',
    description: 'Automated email campaigns and lead scoring',
    icon: Bot,
    meta: 'Agent · Last used 2h ago',
  },
  {
    id: '2',
    type: 'contact',
    title: 'Sarah Johnson',
    description: 'Marketing Director at Acme Corp',
    icon: Users,
    meta: 'Contact · Acme Corporation',
    avatar: 'SJ',
  },
  {
    id: '3',
    type: 'document',
    title: 'Q4 Strategy Document.pdf',
    description: 'Marketing plan and budget allocation',
    icon: FileText,
    meta: 'Document · Updated 3d ago',
  },
  {
    id: '4',
    type: 'event',
    title: 'Team Standup Meeting',
    description: 'Daily team sync at 9:00 AM',
    icon: Calendar,
    meta: 'Event · Tomorrow at 9:00 AM',
  },
];

export default function MobileSearchPage() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted" />
          <Input
            placeholder="Search everything..."
            className="pl-11 pr-10 h-12 text-base"
            aria-label="Global search"
            autoFocus
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 touch-manipulation"
            aria-label="Clear search"
          >
            <X className="h-5 w-5 text-foreground-muted" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Recent Searches */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-foreground-muted" />
              <h2 className="font-semibold text-sm">Recent</h2>
            </div>
            <button className="text-sm text-primary touch-manipulation">Clear</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-background-subtle rounded-full text-sm active:bg-border transition-colors touch-manipulation"
              >
                <span>{search}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-foreground-muted" />
            <h2 className="font-semibold text-sm">Trending</h2>
          </div>
          <div className="space-y-2">
            {trending.map((item, index) => (
              <button
                key={index}
                className="flex items-center justify-between w-full py-2 active:bg-background-subtle rounded-md transition-colors touch-manipulation"
              >
                <span className="text-sm">{item.term}</span>
                <span className="text-xs text-foreground-muted">{item.count} searches</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="px-4 py-4">
          <h2 className="font-semibold text-sm mb-3 text-foreground-muted">Results</h2>
          <div className="space-y-3">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="flex items-start gap-3 p-3 rounded-lg active:bg-background-subtle transition-colors touch-manipulation"
              >
                {/* Icon or Avatar */}
                {result.avatar ? (
                  <Avatar fallback={result.avatar} size="lg" />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-background-subtle flex items-center justify-center shrink-0">
                    <result.icon className="h-5 w-5 text-foreground-muted" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-0.5 truncate">{result.title}</h3>
                  <p className="text-sm text-foreground-muted line-clamp-2 mb-1">
                    {result.description}
                  </p>
                  <p className="text-xs text-foreground-muted">{result.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {searchResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <Search className="h-12 w-12 text-foreground-muted mb-3" />
            <h3 className="font-semibold text-lg mb-2">No results found</h3>
            <p className="text-sm text-foreground-muted">
              Try different keywords or check your spelling
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
