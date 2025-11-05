/**
 * Contact Detail - Figma CRM Component
 * Right panel showing detailed contact information
 * Matches Figma design exactly
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import {
  Mail,
  Phone,
  Calendar,
  Star,
  Zap,
  Target,
  DollarSign,
  MessageSquare,
  Clock,
  TrendingUp,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ContactDetailProps {
  contact: {
    name: string;
    company: string;
    initials: string;
    score: number;
    status: 'hot' | 'warm' | 'cold';
    aiInsight: string;
    nextAction: string;
    dealValue: string;
    interactions: number;
    lastContact: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  };
  interactions: Array<{
    id: string;
    type: 'call' | 'email' | 'meeting';
    sentiment: 'positive' | 'neutral' | 'negative';
    time: string;
    duration?: string;
    description: string;
    actionItems?: string[];
    hasTranscript?: boolean;
  }>;
  className?: string;
}

const statusConfig = {
  hot: { color: 'bg-red-500/10 text-red-600 border-red-500/20' },
  warm: { color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  cold: { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
};

const sentimentConfig = {
  positive: { color: 'bg-green-500/10 text-green-600 border-green-500/20', label: 'Positive' },
  neutral: { color: 'bg-gray-500/10 text-gray-600 border-gray-500/20', label: 'Neutral' },
  negative: { color: 'bg-red-500/10 text-red-600 border-red-500/20', label: 'Negative' },
};

export function ContactDetail({ contact, interactions, className }: ContactDetailProps) {
  return (
    <Card className={cn('figma-card p-0 h-[calc(100vh-12rem)] flex flex-col', className)}>
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Contact Header */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar
                className="h-12 w-12 bg-blue-500/10 text-blue-600 font-semibold text-lg"
                fallback={contact.initials}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{contact.name}</h3>
                  <Badge className={statusConfig[contact.status].color}>{contact.status}</Badge>
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {contact.score}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{contact.company}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>

          {/* AI Insights */}
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
              <Zap className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-purple-600 font-medium mb-1">AI Insight</p>
                <p className="text-sm">{contact.aiInsight}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
              <Target className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-blue-600 font-medium mb-1">Next Action</p>
                <p className="text-sm">{contact.nextAction}</p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs">Deal Value</span>
              </div>
              <p className="text-lg font-semibold">{contact.dealValue}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs">Interactions</span>
              </div>
              <p className="text-lg font-semibold">{contact.interactions}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Last Contact</span>
              </div>
              <p className="text-lg font-semibold">{contact.lastContact}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">Sentiment</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{sentimentConfig[contact.sentiment].label}</p>
              </div>
            </div>
          </div>

          {/* Interaction History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Interaction History ({interactions.length})</h4>
              <Button variant="outline" size="sm">
                + Log Interaction
              </Button>
            </div>

            <div className="space-y-4">
              {interactions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="p-4 border rounded-lg space-y-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'h-8 w-8 rounded-lg flex items-center justify-center',
                          interaction.type === 'call' ? 'bg-green-500/10' : 'bg-blue-500/10',
                        )}
                      >
                        {interaction.type === 'call' ? (
                          <Phone className="h-4 w-4 text-green-600" />
                        ) : (
                          <Mail className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm capitalize">{interaction.type}</span>
                          <Badge className={sentimentConfig[interaction.sentiment].color}>
                            {sentimentConfig[interaction.sentiment].label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {interaction.time}
                          {interaction.duration && ` • ${interaction.duration}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{interaction.description}</p>

                  {interaction.actionItems && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium">Action Items:</p>
                      <div className="space-y-1">
                        {interaction.actionItems.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {interaction.hasTranscript && (
                    <Button variant="ghost" size="sm" className="text-xs h-8">
                      <FileText className="h-3 w-3 mr-2" />
                      View Full Transcript
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}
