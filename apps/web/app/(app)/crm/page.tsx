/**
 * CRM Page - Figma Design
 * Complete rebuild to match Figma design exactly
 * Updated: November 5, 2025
 */

'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, DollarSign, Calendar, Zap, Clock, Search } from 'lucide-react';
import { MetricsBar, ContactCard, ContactDetail } from '@/components/figma/crm';
import type { CRMMetric } from '@/components/figma/crm/MetricsBar';
import type { ContactCardProps } from '@/components/figma/crm/ContactCard';

export default function CRMPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContactId, setSelectedContactId] = useState('1');

  // Top Metrics (from Figma)
  const metrics: CRMMetric[] = [
    {
      icon: Users,
      label: 'Contacts',
      value: 248,
      change: '+12%',
      changeType: 'increase',
    },
    {
      icon: DollarSign,
      label: 'Pipeline',
      value: '$1.2M',
      change: '+8%',
      changeType: 'increase',
    },
    {
      icon: Calendar,
      label: 'This Week',
      value: 38,
      change: '+24%',
      changeType: 'increase',
    },
    {
      icon: Zap,
      label: 'Hot Leads',
      value: 12,
      badge: 'Active',
      badgeColor: 'bg-red-500/10 text-red-600 border-red-500/20',
    },
    {
      icon: Clock,
      label: 'Avg Response',
      value: '2.4h',
      change: '-15%',
      changeType: 'decrease',
    },
  ];

  // Contacts Data (from Figma)
  const contacts: Omit<ContactCardProps, 'onClick' | 'className'>[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      company: 'TechCorp Inc',
      initials: 'SC',
      score: 92,
      aiInsight: 'Highly engaged, mentioned budget approval',
      status: 'hot',
      dealValue: '$45,000',
      isSelected: selectedContactId === '1',
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      company: 'InnovateLabs',
      initials: 'MR',
      score: 76,
      aiInsight: 'Interested in API integrations',
      status: 'warm',
      dealValue: '$28,000',
      isSelected: selectedContactId === '2',
    },
    {
      id: '3',
      name: 'Emma Thompson',
      company: 'Global Systems',
      initials: 'ET',
      score: 68,
      aiInsight: 'Needs legal review on SLA terms',
      status: 'warm',
      dealValue: '$62,000',
      isSelected: selectedContactId === '3',
    },
    {
      id: '4',
      name: 'James Park',
      company: 'StartupXYZ',
      initials: 'JP',
      score: 42,
      aiInsight: 'No response to last 2 follow-ups',
      status: 'cold',
      dealValue: '$15,000',
      isSelected: selectedContactId === '4',
    },
  ];

  // Selected Contact Details
  const selectedContact = {
    name: 'Sarah Chen',
    company: 'TechCorp Inc',
    initials: 'SC',
    score: 92,
    status: 'hot' as const,
    aiInsight: 'Highly engaged, mentioned budget approval',
    nextAction: 'Send Q4 proposal by Friday',
    dealValue: '$45,000',
    interactions: 12,
    lastContact: '2 hours ago',
    sentiment: 'positive' as const,
  };

  const interactionHistory = [
    {
      id: '1',
      type: 'call' as const,
      sentiment: 'positive' as const,
      time: 'Today, 2:30 PM',
      duration: '23 min',
      description:
        'Discussed Q4 implementation timeline and budget allocation. Sarah expressed strong interest in expanding the partnership and mentioned their team is ready to move forward pending executive approval.',
      actionItems: [
        'Send proposal by Friday',
        'Schedule technical demo for next week',
        'Connect with their CTO',
      ],
      hasTranscript: true,
    },
    {
      id: '2',
      type: 'email' as const,
      sentiment: 'neutral' as const,
      time: 'Yesterday, 9:15 AM',
      description: 'Follow-up email regarding technical requirements and integration timeline.',
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">CRM</h1>
          <p className="text-muted-foreground">
            Auto-transcribe and organize calls, meetings, and emails
          </p>
        </div>

        {/* Metrics Bar */}
        <MetricsBar metrics={metrics} />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="contacts" className="w-full">
        {/* Tabs */}
        <TabsList>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Contact List (1/3) */}
            <div className="lg:col-span-1 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Contact Cards */}
              <ScrollArea className="h-[calc(100vh-20rem)]">
                <div className="space-y-3 pr-4">
                  {contacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      {...contact}
                      onClick={() => setSelectedContactId(contact.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Right: Contact Detail (2/3) */}
            <div className="lg:col-span-2">
              <ContactDetail contact={selectedContact} interactions={interactionHistory} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Projects view coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Sales view coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
