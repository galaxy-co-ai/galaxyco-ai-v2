/**
 * Workflow Templates Page
 * Browse and select pre-built workflow templates
 */

'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TemplateBrowser } from '@/components/templates/TemplateBrowser';
import type { WorkflowTemplate } from '@/lib/templates/types';

export default function WorkflowTemplatesPage() {
  const router = useRouter();

  function handleSelectTemplate(template: WorkflowTemplate) {
    // Navigate to flow builder with template data
    router.push(`/workflows/builder?templateId=${template.id}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/workflows">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workflow Templates</h1>
            <p className="text-muted-foreground mt-1">
              Start with a pre-built template and customize it to your needs
            </p>
          </div>
        </div>

        {/* Template Browser */}
        <TemplateBrowser onSelectTemplate={handleSelectTemplate} />
      </div>
    </div>
  );
}
