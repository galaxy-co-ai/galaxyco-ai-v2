'use client';

import { useState, useEffect } from 'react';
import { ListPage } from '@/components/templates/list-page';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { useWorkspace } from '@/contexts/workspace-context';
import { toast } from 'sonner';
import { Calendar, CheckCircle2, Clock, MoreVertical, Plus, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  workspaceId: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignedTo: string | null;
  createdBy: string;
  projectId: string | null;
  customerId: string | null;
  dueDate: string | null;
  startDate: string | null;
  completedAt: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function TasksPage() {
  const { currentWorkspace } = useWorkspace();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function fetchTasks() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/tasks?workspaceId=${currentWorkspace.id}&limit=100`);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, [currentWorkspace?.id]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const renderTaskCard = (task: Task) => {
    const priorityColors: Record<string, 'destructive' | 'default' | 'secondary' | 'outline'> = {
      urgent: 'destructive',
      high: 'default',
      medium: 'secondary',
      low: 'outline',
    };

    const statusColors: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      todo: 'secondary',
      in_progress: 'default',
      done: 'outline',
      blocked: 'destructive',
    };

    const statusIcons: Record<string, React.ReactElement> = {
      todo: <Clock className="h-4 w-4" />,
      in_progress: <AlertCircle className="h-4 w-4" />,
      done: <CheckCircle2 className="h-4 w-4" />,
      blocked: <AlertCircle className="h-4 w-4" />,
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

    return (
      <div
        key={task.id}
        className={`group relative rounded-lg border bg-card p-6 hover:shadow-md transition-all ${
          isOverdue
            ? 'border-destructive/50 bg-destructive/5'
            : 'border-border hover:border-primary/50'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description || 'No description'}
            </p>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={priorityColors[task.priority]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          <Badge variant={statusColors[task.status]} className="gap-1">
            {statusIcons[task.status]}
            {task.status === 'in_progress'
              ? 'In Progress'
              : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
          {isOverdue && <Badge variant="destructive">Overdue</Badge>}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {task.assignedTo && (
            <div className="flex items-center gap-2">
              <Avatar
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${task.assignedTo}`}
                alt="Assignee"
                fallback="A"
                size="sm"
              />
              <span className="text-sm text-muted-foreground">Assigned</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <ListPage
      title="Tasks"
      subtitle="Manage your tasks and track progress"
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Tasks' }]}
      searchPlaceholder="Search tasks..."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      showFilters={false}
      actions={
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      }
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => renderTaskCard(task))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No tasks found</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setPriorityFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </ListPage>
  );
}
