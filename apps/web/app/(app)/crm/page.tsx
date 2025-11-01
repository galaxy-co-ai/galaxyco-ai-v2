/**
 * CRM Dashboard - GalaxyCo.ai 2.0
 * Customer Relationship Management hub
 * October 19, 2025
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWorkspace } from '@/contexts/workspace-context';
import { Spinner } from '@/components/ui/spinner';
import { WorkspaceGuard } from '@/components/workspace/workspace-guard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Users, UserCircle, Briefcase, Target, TrendingUp, ChevronRight } from 'lucide-react';

interface CRMMetrics {
  totalCustomers: number;
  totalContacts: number;
  totalProjects: number;
  totalProspects: number;
  activeCustomers: number;
  activeProjects: number;
}

export default function CRMDashboard() {
  return (
    <WorkspaceGuard>
      <CRMContent />
    </WorkspaceGuard>
  );
}

function CRMContent() {
  const { currentWorkspace } = useWorkspace();
  const [metrics, setMetrics] = useState<CRMMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);

        // Fetch CRM metrics
        const [customersRes, contactsRes, projectsRes, prospectsRes] = await Promise.all([
          fetch(`/api/customers?workspaceId=${currentWorkspace.id}&limit=1`),
          fetch(`/api/contacts?workspaceId=${currentWorkspace.id}&limit=1`),
          fetch(`/api/projects?workspaceId=${currentWorkspace.id}&limit=1`),
          fetch(`/api/prospects?workspaceId=${currentWorkspace.id}&limit=1`),
        ]);

        const customers = customersRes.ok ? await customersRes.json() : { total: 0 };
        const contacts = contactsRes.ok ? await contactsRes.json() : { total: 0 };
        const projects = projectsRes.ok ? await projectsRes.json() : { total: 0 };
        const prospects = prospectsRes.ok ? await prospectsRes.json() : { total: 0 };

        setMetrics({
          totalCustomers: customers.total || 0,
          totalContacts: contacts.total || 0,
          totalProjects: projects.total || 0,
          totalProspects: prospects.total || 0,
          activeCustomers: customers.active || 0,
          activeProjects: projects.active || 0,
        });
      } catch (error) {
        console.error('Failed to fetch CRM metrics:', error);
        toast.error('Failed to load CRM dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetrics();
  }, [currentWorkspace?.id]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const crmSections = [
    {
      title: 'Customers',
      href: '/crm/customers',
      icon: Users,
      description: 'Manage customer accounts and relationships',
      count: metrics?.totalCustomers || 0,
      activeCount: metrics?.activeCustomers || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Contacts',
      href: '/crm/contacts',
      icon: UserCircle,
      description: 'Individual contacts and decision makers',
      count: metrics?.totalContacts || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Projects',
      href: '/crm/projects',
      icon: Briefcase,
      description: 'Active projects and engagements',
      count: metrics?.totalProjects || 0,
      activeCount: metrics?.activeProjects || 0,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Prospects',
      href: '/crm/prospects',
      icon: Target,
      description: 'Potential customers and leads',
      count: metrics?.totalProspects || 0,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Segments',
      href: '/crm/segments',
      icon: TrendingUp,
      description: 'Customer segmentation and targeting',
      count: 0,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">CRM</h1>
            <p className="text-sm text-muted-foreground mt-1">Customer Relationship Management</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {metrics?.totalCustomers || 0} Customers
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {metrics?.totalContacts || 0} Contacts
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {crmSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${section.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${section.color}`} />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-1">{section.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{section.description}</p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-foreground">{section.count}</span>
                      <span className="text-sm text-muted-foreground">total</span>
                    </div>
                    {section.activeCount !== undefined && (
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-semibold text-primary">
                          {section.activeCount}
                        </span>
                        <span className="text-xs text-muted-foreground">active</span>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
