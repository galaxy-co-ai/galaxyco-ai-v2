"use client";

import React, { useState } from "react";
import { ListPage } from "@/components/templates/list-page";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserPlus } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "member" | "viewer";
  status: "active" | "inactive" | "suspended";
  lastActive: string;
  workspace: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@company.com",
    role: "admin",
    status: "active",
    lastActive: "2 minutes ago",
    workspace: "Acme Corp",
  },
  {
    id: "2",
    name: "John Smith",
    email: "john@startup.io",
    role: "member",
    status: "active",
    lastActive: "1 hour ago",
    workspace: "Startup Inc",
  },
  {
    id: "3",
    name: "Emily Johnson",
    email: "emily@enterprise.com",
    role: "admin",
    status: "active",
    lastActive: "3 hours ago",
    workspace: "Enterprise LLC",
  },
  {
    id: "4",
    name: "Michael Brown",
    email: "michael@tech.com",
    role: "member",
    status: "inactive",
    lastActive: "2 days ago",
    workspace: "Tech Solutions",
  },
  {
    id: "5",
    name: "Lisa Garcia",
    email: "lisa@agency.co",
    role: "viewer",
    status: "suspended",
    lastActive: "1 week ago",
    workspace: "Digital Agency",
  },
];

const roleColors = {
  admin:
    "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  member: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  viewer: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const statusColors = {
  active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  inactive:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  suspended: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );

  const filteredUsers = mockUsers.filter((user) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !user.name.toLowerCase().includes(query) &&
        !user.email.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    const roleFilter = activeFilters.role || [];
    if (roleFilter.length > 0 && !roleFilter.includes(user.role)) {
      return false;
    }

    const statusFilter = activeFilters.status || [];
    if (statusFilter.length > 0 && !statusFilter.includes(user.status)) {
      return false;
    }

    return true;
  });

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
            { value: "admin", label: "Admin" },
            { value: "member", label: "Member" },
            { value: "viewer", label: "Viewer" },
          ],
        },
        {
          id: "status",
          label: "Status",
          type: "checkbox",
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
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
                    <Badge
                      variant="secondary"
                      className={roleColors[user.role]}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={statusColors[user.status]}
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
