'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CreateWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateWorkspaceModal({ open, onClose, onSuccess }: CreateWorkspaceModalProps) {
  const { user } = useUser();
  const [workspaceName, setWorkspaceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workspaceName.trim()) {
      toast.error('Please enter a workspace name');
      return;
    }

    if (!user) {
      toast.error('You must be signed in to create a workspace');
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: workspaceName.trim(),
          clerkUserId: user.id,
          userEmail: user.primaryEmailAddress?.emailAddress || 'user@example.com',
          userFirstName: user.firstName || 'User',
          userLastName: user.lastName || '',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create workspace');
      }

      const data = await response.json();

      toast.success('Workspace created successfully!');
      onSuccess();
      onClose();

      // Refresh page to load new workspace
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error creating workspace:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create workspace');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Your Workspace</DialogTitle>
          <DialogDescription>
            Choose a name for your workspace. You can change this later in settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">Workspace Name</Label>
            <Input
              id="workspace-name"
              placeholder="My Company"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              disabled={isCreating}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              This is your team&apos;s workspace where you&apos;ll manage agents and data.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Workspace'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
