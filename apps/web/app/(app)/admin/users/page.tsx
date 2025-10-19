"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ListPage } from "@/components/templates/list-page";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserPlus } from "lucide-react";

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
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ListPage>
  );
}
