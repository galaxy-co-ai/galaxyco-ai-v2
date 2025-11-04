/**
 * Workflow Examples Page
 * Browse and use pre-built workflow examples with integrations
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Clock,
  Zap,
  Mail,
  MessageCircle,
  Users,
  Calendar,
  ArrowRight,
  TrendingUp,
  Headphones,
  Briefcase,
} from 'lucide-react';
import {
  WORKFLOW_EXAMPLES,
  getWorkflowExamplesByCategory,
  type WorkflowExample,
} from '@/lib/integrations/example-workflows';
import { toast } from 'sonner';

const categoryIcons = {
  sales: TrendingUp,
  marketing: Mail,
  support: Headphones,
  productivity: Briefcase,
};

const difficultyColors = {
  beginner: 'bg-green-500/10 text-green-700 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-700 border-red-500/20',
};

const integrationIcons = {
  gmail: Mail,
  slack: MessageCircle,
  hubspot: Users,
  'google-calendar': Calendar,
};

export default function WorkflowExamplesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WorkflowExample['category'] | 'all'>(
    'all',
  );

  const filteredWorkflows = WORKFLOW_EXAMPLES.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || workflow.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  function handleUseWorkflow(workflow: WorkflowExample) {
    // Store workflow template in session storage
    sessionStorage.setItem('workflow-template', JSON.stringify(workflow));

    // Navigate to flow builder
    router.push('/workflows/builder?template=' + workflow.id);

    toast.success(`Loading "${workflow.name}" template...`);
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Workflow Examples</h1>
              <p className="text-muted-foreground">
                Pre-built workflows you can use immediately. Just connect your integrations and go!
              </p>
            </div>
            <Link href="/workflows/builder">
              <Button variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                Build from Scratch
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All ({WORKFLOW_EXAMPLES.length})</TabsTrigger>
            <TabsTrigger value="sales">
              Sales ({getWorkflowExamplesByCategory('sales').length})
            </TabsTrigger>
            <TabsTrigger value="marketing">
              Marketing ({getWorkflowExamplesByCategory('marketing').length})
            </TabsTrigger>
            <TabsTrigger value="support">
              Support ({getWorkflowExamplesByCategory('support').length})
            </TabsTrigger>
            <TabsTrigger value="productivity">
              Productivity ({getWorkflowExamplesByCategory('productivity').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-6">
            {/* Workflow Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkflows.map((workflow) => {
                const CategoryIcon = categoryIcons[workflow.category];

                return (
                  <Card
                    key={workflow.id}
                    className="p-6 hover:shadow-lg transition-shadow flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <CategoryIcon className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="outline" className={difficultyColors[workflow.difficulty]}>
                        {workflow.difficulty}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{workflow.name}</h3>
                        <p className="text-sm text-muted-foreground">{workflow.description}</p>
                      </div>

                      {/* Integrations Used */}
                      <div className="flex flex-wrap gap-2">
                        {workflow.integrations.map((integrationId) => {
                          const Icon = integrationIcons[integrationId];
                          return (
                            <div
                              key={integrationId}
                              className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs"
                            >
                              <Icon className="h-3 w-3" />
                              {integrationId}
                            </div>
                          );
                        })}
                      </div>

                      {/* Steps Count */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {workflow.steps.length} steps
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {workflow.estimatedTime}
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <Button
                      onClick={() => handleUseWorkflow(workflow)}
                      className="mt-4 w-full"
                      size="sm"
                    >
                      Use This Workflow
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Card>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredWorkflows.length === 0 && (
              <Card className="p-12">
                <div className="text-center space-y-4">
                  <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">No workflows found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or category filter
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Info Banner */}
        <Card className="p-6 bg-muted/30">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              How to Use Workflow Examples
            </h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Click &quot;Use This Workflow&quot; on any example</li>
              <li>The workflow will load in the Visual Flow Builder</li>
              <li>Connect required integrations if not already connected</li>
              <li>Customize parameters to match your needs</li>
              <li>Test the workflow with sample data</li>
              <li>Save and activate when ready!</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}
