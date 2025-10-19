"use client";

import { useState, useEffect } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { ListPage } from "@/components/templates";
import { DataTable } from "@/components/organisms/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { UserPlus, Mail, MoreVertical, Shield, User } from "lucide-react";

type TeamMember = {
  id: string;
  userId: string;
  role: string;
  isActive: boolean;
  joinedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    name: string;
  };
};

/**
 * Settings Team Page
 *
 * Team member management using ListPage template.
 * Shows member list and invite dialog.
 */
export default function SettingsTeamPage() {
  const { currentWorkspace } = useWorkspace();
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  useEffect(() => {
    async function fetchMembers() {
      if (!currentWorkspace?.id) return;

      try {
        const res = await fetch(
          `/api/workspaces/current/members?workspaceId=${currentWorkspace.id}`,
        );
        if (!res.ok) throw new Error("Failed to fetch members");
        const data = await res.json();
        setTeamMembers(data.members);
      } catch (error) {
        toast.error("Failed to load team members");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembers();
  }, [currentWorkspace?.id]);

  const handleInvite = async () => {
    if (!currentWorkspace?.id || !inviteEmail) return;

    try {
      const res = await fetch("/api/workspaces/current/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: currentWorkspace.id,
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      if (!res.ok) throw new Error("Failed to invite member");
      toast.success("Invitation sent successfully");
      setIsInviteOpen(false);
      setInviteEmail("");
      setInviteRole("member");
    } catch (error) {
      toast.error("Failed to send invitation");
    }
  };

  // Filter members
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      searchQuery === "" ||
      member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const roleFilter = activeFilters.role || [];
    const matchesRole =
      roleFilter.length === 0 || roleFilter.includes(member.role);

    const statusFilter = activeFilters.status || [];
    const statusValue = member.isActive ? "active" : "inactive";
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(statusValue);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleFilterChange = (filterId: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: values,
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
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
      title="Team Settings"
      subtitle="Manage team members and permissions"
      breadcrumbs={[
        { label: "Settings", href: "/settings" },
        { label: "Team" },
      ]}
      actions={
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your workspace
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsInviteOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleInvite}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      }
      searchQuery={searchQuery}
      searchPlaceholder="Search team members..."
      onSearchChange={setSearchQuery}
      showViewToggle={false}
      filters={[
        {
          id: "role",
          label: "Role",
          type: "checkbox",
          options: [
            { value: "owner", label: "Owner", count: 1 },
            { value: "admin", label: "Admin", count: 1 },
            { value: "member", label: "Member", count: 2 },
          ],
        },
        {
          id: "status",
          label: "Status",
          type: "checkbox",
          options: [
            { value: "active", label: "Active", count: 3 },
            { value: "invited", label: "Invited", count: 1 },
          ],
        },
      ]}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      isEmpty={filteredMembers.length === 0}
      emptyMessage="No team members found"
    >
      {/* Team Members Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary">
                          <User className="h-5 w-5" />
                        </div>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">
                          {member.user.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {member.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {member.role === "owner" && (
                        <Shield className="h-4 w-4 text-warning" />
                      )}
                      <span className="capitalize text-foreground">
                        {member.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={member.isActive ? "success" : "secondary"}>
                      {member.isActive ? "active" : "inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
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
