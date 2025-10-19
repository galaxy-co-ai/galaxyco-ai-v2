"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ListPage } from "@/components/templates/list-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Bot,
  Database,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminWorkspace {
  id: string;
  name: string;
  slug: string | null;
  subscriptionTier: string | null;
  subscriptionStatus: string | null;
  isActive: boolean | null;
  createdAt: string;
  members?: Array<{ userId: string }>;
}

export default function AdminWorkspacesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [workspaces, setWorkspaces] = useState<AdminWorkspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<AdminWorkspace | null>(null);
  const [editWorkspace, setEditWorkspace] = useState<AdminWorkspace | null>(
    null,
  );
  const [deleteWorkspace, setDeleteWorkspace] = useState<AdminWorkspace | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalWorkspaces, setTotalWorkspaces] = useState(0);
  const limit = 15;

  useEffect(() => {
    async function fetchWorkspaces() {
      try {
        setIsLoading(true);
        const offset = (page - 1) * limit;
        const res = await fetch(
          `/api/admin/workspaces?limit=${limit}&offset=${offset}`,
        );
        if (!res.ok) throw new Error("Failed to fetch workspaces");
        const json = await res.json();
        setWorkspaces(json.workspaces || []);
        setTotalWorkspaces(json.total || json.workspaces?.length || 0);
      } catch (e) {
        console.error("Failed to load workspaces", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWorkspaces();
  }, [page]);

  async function handleUpdateWorkspace(updatedData: Partial<AdminWorkspace>) {
    if (!editWorkspace) return;
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/admin/workspaces/${editWorkspace.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update workspace");
      setEditWorkspace(null);
      // Refresh current page
      const offset = (page - 1) * limit;
      const workspacesRes = await fetch(
        `/api/admin/workspaces?limit=${limit}&offset=${offset}`,
      );
      if (workspacesRes.ok) {
        const json = await workspacesRes.json();
        setWorkspaces(json.workspaces || []);
      }
    } catch (e) {
      console.error("Failed to update workspace", e);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeleteWorkspace() {
    if (!deleteWorkspace) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/workspaces/${deleteWorkspace.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete workspace");
      // Remove from local state
      setWorkspaces(workspaces.filter((w) => w.id !== deleteWorkspace.id));
      setDeleteWorkspace(null);
    } catch (e) {
      console.error("Failed to delete workspace", e);
    } finally {
      setIsDeleting(false);
    }
  }

  const rows = useMemo(() => {
    return workspaces.map((w) => ({
      id: w.id,
      name: w.name,
      plan: (w.subscriptionTier as "free" | "pro" | "enterprise") || "free",
      users: w.members?.length || 0,
      agents: 0,
      storage: "—",
      created: w.createdAt,
      status: w.isActive ? "active" : "suspended",
    }));
  }, [workspaces]);

  const filteredWorkspaces = rows.filter((workspace) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = q === "" || workspace.name.toLowerCase().includes(q);

    const planFilter = activeFilters.plan || [];
    const statusFilter = activeFilters.status || [];
    const matchesPlan =
      planFilter.length === 0 || planFilter.includes(workspace.plan);
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(workspace.status);

    return matchesSearch && matchesPlan && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <ListPage
      title="Workspace Management"
      subtitle="Manage workspaces and usage"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Workspaces" },
      ]}
      searchQuery={searchQuery}
      searchPlaceholder="Search workspaces..."
      onSearchChange={setSearchQuery}
      showViewToggle={false}
      filters={[
        {
          id: "plan",
          label: "Plan",
          type: "checkbox",
          options: [
            { value: "free", label: "Free" },
            { value: "pro", label: "Pro" },
            { value: "enterprise", label: "Enterprise" },
          ],
        },
        {
          id: "status",
          label: "Status",
          type: "checkbox",
          options: [
            { value: "active", label: "Active" },
            { value: "suspended", label: "Suspended" },
          ],
        },
      ]}
      activeFilters={activeFilters}
      onFilterChange={(filterId, values) =>
        setActiveFilters({ ...activeFilters, [filterId]: values })
      }
      onClearFilters={() => {
        setActiveFilters({});
        setSearchQuery("");
      }}
      actions={
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Workspace
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredWorkspaces.map((workspace) => (
          <div
            key={workspace.id}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{workspace.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(workspace.created).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      setSelectedWorkspace(
                        workspaces.find((w) => w.id === workspace.id) || null,
                      )
                    }
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      setEditWorkspace(
                        workspaces.find((w) => w.id === workspace.id) || null,
                      )
                    }
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Workspace
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      setDeleteWorkspace(
                        workspaces.find((w) => w.id === workspace.id) || null,
                      )
                    }
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Workspace
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex gap-2 mb-4">
              <Badge
                variant="secondary"
                className={
                  workspace.plan === "enterprise"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                    : workspace.plan === "pro"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }
              >
                {workspace.plan}
              </Badge>
              <Badge
                variant="secondary"
                className={
                  workspace.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                }
              >
                {workspace.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Users className="h-3.5 w-3.5" />
                  <span className="text-xs">Users</span>
                </div>
                <p className="text-lg font-semibold">{workspace.users}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Bot className="h-3.5 w-3.5" />
                  <span className="text-xs">Agents</span>
                </div>
                <p className="text-lg font-semibold">{workspace.agents}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Database className="h-3.5 w-3.5" />
                  <span className="text-xs">Storage</span>
                </div>
                <p className="text-sm font-semibold">{workspace.storage}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() =>
                setSelectedWorkspace(
                  workspaces.find((w) => w.id === workspace.id) || null,
                )
              }
            >
              View Details
            </Button>
          </div>
        ))}
      </div>

      {/* View Workspace Modal */}
      <Dialog
        open={!!selectedWorkspace}
        onOpenChange={() => setSelectedWorkspace(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Workspace Details</DialogTitle>
            <DialogDescription>
              View detailed information about this workspace.
            </DialogDescription>
          </DialogHeader>
          {selectedWorkspace && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedWorkspace.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ID: {selectedWorkspace.id}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Slug</p>
                  <p className="text-muted-foreground">
                    {selectedWorkspace.slug || "—"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-muted-foreground">
                    {new Date(selectedWorkspace.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Subscription</p>
                  <p className="text-muted-foreground">
                    {selectedWorkspace.subscriptionTier || "Free"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-muted-foreground">
                    {selectedWorkspace.isActive ? "Active" : "Suspended"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Members</p>
                  <p className="text-muted-foreground">
                    {selectedWorkspace.members?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Billing Status</p>
                  <p className="text-muted-foreground">
                    {selectedWorkspace.subscriptionStatus || "—"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedWorkspace(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Workspace Modal */}
      <Dialog
        open={!!editWorkspace}
        onOpenChange={() => setEditWorkspace(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Workspace</DialogTitle>
            <DialogDescription>
              Update workspace information and settings.
            </DialogDescription>
          </DialogHeader>
          {editWorkspace && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpdateWorkspace({
                  name: formData.get("name") as string,
                  slug: formData.get("slug") as string,
                  subscriptionTier: formData.get("subscriptionTier") as string,
                  isActive: formData.get("isActive") === "true",
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Workspace Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editWorkspace.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={editWorkspace.slug || ""}
                    placeholder="workspace-slug"
                  />
                </div>
                <div>
                  <Label htmlFor="subscriptionTier">Subscription Tier</Label>
                  <Select
                    name="subscriptionTier"
                    defaultValue={editWorkspace.subscriptionTier || "free"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="isActive">Status</Label>
                  <Select
                    name="isActive"
                    defaultValue={editWorkspace.isActive ? "true" : "false"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditWorkspace(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Workspace"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Workspace Modal */}
      <Dialog
        open={!!deleteWorkspace}
        onOpenChange={() => setDeleteWorkspace(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workspace</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workspace? This action cannot
              be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          {deleteWorkspace && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{deleteWorkspace.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {deleteWorkspace.members?.length || 0} members • Created{" "}
                    {new Date(deleteWorkspace.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteWorkspace(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteWorkspace}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Workspace"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {totalWorkspaces > limit && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Showing {Math.min((page - 1) * limit + 1, totalWorkspaces)} to{" "}
            {Math.min(page * limit, totalWorkspaces)} of {totalWorkspaces}{" "}
            workspaces
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page * limit >= totalWorkspaces || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </ListPage>
  );
}
