"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ListPage } from "@/components/templates/list-page";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserPlus, Edit, Trash2, Eye } from "lucide-react";
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

interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  lastLoginAt: string | null;
  workspaceMembers?: Array<{
    role: string;
    isActive: boolean;
    workspace: { id: string; name: string };
  }>;
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/admin/users?limit=100`);
        if (!res.ok) throw new Error("Failed to fetch users");
        const json = await res.json();
        setUsers(json.users || []);
      } catch (e) {
        console.error("Failed to load users", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  async function handleUpdateUser(updatedData: Partial<AdminUser>) {
    if (!editUser) return;
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update user");
      // Refresh users list
      const usersRes = await fetch(`/api/admin/users?limit=100`);
      if (usersRes.ok) {
        const json = await usersRes.json();
        setUsers(json.users || []);
      }
      setEditUser(null);
    } catch (e) {
      console.error("Failed to update user", e);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeleteUser() {
    if (!deleteUser) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/users/${deleteUser.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      // Remove from local state
      setUsers(users.filter((u) => u.id !== deleteUser.id));
      setDeleteUser(null);
    } catch (e) {
      console.error("Failed to delete user", e);
    } finally {
      setIsDeleting(false);
    }
  }

  const rows = useMemo(() => {
    return users.map((u) => ({
      id: u.id,
      name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email,
      email: u.email,
      role: u.workspaceMembers?.[0]?.role || "member",
      status: u.workspaceMembers?.[0]?.isActive ? "active" : "inactive",
      lastActive: u.lastLoginAt
        ? new Date(u.lastLoginAt).toLocaleString()
        : "—",
      workspace: u.workspaceMembers?.[0]?.workspace?.name || "—",
    }));
  }, [users]);

  const filteredUsers = rows.filter((user) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      q === "" ||
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q);

    const roleFilter = activeFilters.role || [];
    const statusFilter = activeFilters.status || [];

    const matchesRole =
      roleFilter.length === 0 || roleFilter.includes(user.role);
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(user.status);

    return matchesSearch && matchesRole && matchesStatus;
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
      title="User Management"
      subtitle="Manage platform users and permissions"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Users" },
      ]}
      searchQuery={searchQuery}
      searchPlaceholder="Search by name or email..."
      onSearchChange={setSearchQuery}
      showViewToggle={false}
      filters={[
        {
          id: "role",
          label: "Role",
          type: "checkbox",
          options: [
            { value: "owner", label: "Owner" },
            { value: "admin", label: "Admin" },
            { value: "member", label: "Member" },
          ],
        },
        {
          id: "status",
          label: "Status",
          type: "checkbox",
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
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
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      }
    >
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  User
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Workspace
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Last Active
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        fallback={user.name.substring(0, 2).toUpperCase()}
                      />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{user.role}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        user.status === "active" ? "success" : "secondary"
                      }
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">{user.workspace}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {user.lastActive}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            setSelectedUser(
                              users.find((u) => u.id === user.id) || null,
                            )
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setEditUser(
                              users.find((u) => u.id === user.id) || null,
                            )
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setDeleteUser(
                              users.find((u) => u.id === user.id) || null,
                            )
                          }
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View detailed information about this user.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar
                  fallback={(
                    `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim() ||
                    selectedUser.email
                  )
                    .substring(0, 2)
                    .toUpperCase()}
                />
                <div>
                  <p className="font-medium">
                    {`${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim() ||
                      selectedUser.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">User ID</p>
                  <p className="text-muted-foreground">{selectedUser.id}</p>
                </div>
                <div>
                  <p className="font-medium">Last Login</p>
                  <p className="text-muted-foreground">
                    {selectedUser.lastLoginAt
                      ? new Date(selectedUser.lastLoginAt).toLocaleString()
                      : "Never"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Role</p>
                  <p className="text-muted-foreground">
                    {selectedUser.workspaceMembers?.[0]?.role || "member"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-muted-foreground">
                    {selectedUser.workspaceMembers?.[0]?.isActive
                      ? "Active"
                      : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          {editUser && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpdateUser({
                  firstName: formData.get("firstName") as string,
                  lastName: formData.get("lastName") as string,
                  email: formData.get("email") as string,
                });
              }}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      defaultValue={editUser.firstName || ""}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      defaultValue={editUser.lastName || ""}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={editUser.email}
                    required
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditUser(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update User"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Modal */}
      <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {deleteUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Avatar
                  fallback={(
                    `${deleteUser.firstName || ""} ${deleteUser.lastName || ""}`.trim() ||
                    deleteUser.email
                  )
                    .substring(0, 2)
                    .toUpperCase()}
                />
                <div>
                  <p className="font-medium">
                    {`${deleteUser.firstName || ""} ${deleteUser.lastName || ""}`.trim() ||
                      deleteUser.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {deleteUser.email}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ListPage>
  );
}
