'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import {
  Mail,
  Phone,
  Building2,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Filter,
  Plus,
} from 'lucide-react';
import { useState } from 'react';

interface Prospect {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  score: number;
  status: 'hot' | 'warm' | 'cold';
  value: number;
  lastContact: string;
  avatar: string;
}

const prospects: Prospect[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechCorp Inc',
    title: 'VP of Sales',
    email: 'sarah@techcorp.com',
    phone: '+1 (555) 123-4567',
    score: 92,
    status: 'hot',
    value: 125000,
    lastContact: 'Today',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SJ',
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'Global Solutions',
    title: 'Director',
    email: 'michael@globalsol.com',
    phone: '+1 (555) 234-5678',
    score: 78,
    status: 'warm',
    value: 85000,
    lastContact: 'Yesterday',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MC',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    company: 'Startup Labs',
    title: 'Founder',
    email: 'emily@startuplabs.io',
    phone: '+1 (555) 345-6789',
    score: 45,
    status: 'cold',
    value: 25000,
    lastContact: '5 days ago',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ER',
  },
  {
    id: '4',
    name: 'David Kim',
    company: 'Enterprise Co',
    title: 'CTO',
    email: 'david@enterprise.com',
    phone: '+1 (555) 456-7890',
    score: 88,
    status: 'hot',
    value: 210000,
    lastContact: '2 hours ago',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DK',
  },
];

const statusConfig = {
  hot: {
    label: 'Hot',
    className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  },
  warm: {
    label: 'Warm',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  },
  cold: {
    label: 'Cold',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
};

export default function MobileProspectsPage() {
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');

  const filteredProspects = prospects.filter((p) => filter === 'all' || p.status === filter);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Prospects</h1>
              <p className="text-sm text-muted-foreground">{prospects.length} leads</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Filter className="h-4 w-4" />
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'hot' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('hot')}
            >
              🔥 Hot
            </Button>
            <Button
              variant={filter === 'warm' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('warm')}
            >
              Warm
            </Button>
            <Button
              variant={filter === 'cold' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('cold')}
            >
              Cold
            </Button>
          </div>
        </div>
      </div>

      {/* Prospect List */}
      <div className="p-4 space-y-3">
        {filteredProspects.map((prospect) => (
          <div
            key={prospect.id}
            className="rounded-lg border border-border bg-card overflow-hidden active:bg-accent transition-colors"
          >
            {/* Header */}
            <div className="p-4 pb-3">
              <div className="flex items-start gap-3 mb-3">
                <Avatar
                  src={prospect.avatar}
                  alt={prospect.name}
                  fallback={prospect.name.substring(0, 2)}
                  size="default"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold truncate">{prospect.name}</h3>
                    <Badge className={statusConfig[prospect.status].className}>
                      {statusConfig[prospect.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{prospect.title}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Building2 className="h-3 w-3" />
                    <span className="truncate">{prospect.company}</span>
                  </div>
                </div>
              </div>

              {/* Score Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Lead Score</span>
                  <span className="font-semibold">{prospect.score}/100</span>
                </div>
                <div className="h-1.5 bg-background-subtle rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      prospect.score >= 80
                        ? 'bg-green-500'
                        : prospect.score >= 60
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                    }`}
                    style={{ width: `${prospect.score}%` }}
                  />
                </div>
              </div>

              {/* Value & Contact */}
              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="h-3 w-3" />
                  <span className="font-semibold">${(prospect.value / 1000).toFixed(0)}K</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Last contact: {prospect.lastContact}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-border bg-background-subtle/50 p-2 flex gap-2">
              <Button size="sm" variant="ghost" className="flex-1">
                <Mail className="h-3 w-3 mr-1" />
                Email
              </Button>
              <Button size="sm" variant="ghost" className="flex-1">
                <Phone className="h-3 w-3 mr-1" />
                Call
              </Button>
              <Button size="sm" variant="ghost">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProspects.length === 0 && (
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">No prospects found</p>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Prospect
          </Button>
        </div>
      )}
    </div>
  );
}
