"use client";

import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Send, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function TeamInvitePage() {
  const [invites, setInvites] = useState([
    { id: "1", email: "", role: "member" },
  ]);

  const addInvite = () => {
    setInvites([
      ...invites,
      { id: Math.random().toString(), email: "", role: "member" },
    ]);
  };

  const removeInvite = (id: string) => {
    setInvites(invites.filter((inv) => inv.id !== id));
  };

  const updateEmail = (id: string, email: string) => {
    setInvites(invites.map((inv) => (inv.id === id ? { ...inv, email } : inv)));
  };

  const updateRole = (id: string, role: string) => {
    setInvites(invites.map((inv) => (inv.id === id ? { ...inv, role } : inv)));
  };

  const sendInvites = () => {
    const validInvites = invites.filter((inv) => inv.email.trim());
    if (validInvites.length === 0) {
      toast.error("Please enter at least one email address");
      return;
    }
    toast.success(`Sent ${validInvites.length} invitation(s)`);
    setInvites([{ id: "1", email: "", role: "member" }]);
  };

  return (
    <PageShell
      title="Invite Team Members"
      subtitle="Send invitations to join your workspace"
      breadcrumbs={[
        { label: "Settings", href: "/settings" },
        { label: "Team", href: "/settings/team" },
        { label: "Invite" },
      ]}
    >
      <div className="max-w-2xl">
        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-4 mb-6">
            {invites.map((invite, index) => (
              <div key={invite.id} className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor={`email-${invite.id}`}>
                    Email {invites.length > 1 && `#${index + 1}`}
                  </Label>
                  <Input
                    id={`email-${invite.id}`}
                    type="email"
                    placeholder="colleague@company.com"
                    value={invite.email}
                    onChange={(e) => updateEmail(invite.id, e.target.value)}
                  />
                </div>
                <div className="w-48">
                  <Label htmlFor={`role-${invite.id}`}>Role</Label>
                  <Select
                    value={invite.role}
                    onValueChange={(val) => updateRole(invite.id, val)}
                  >
                    <SelectTrigger id={`role-${invite.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {invites.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-auto"
                    onClick={() => removeInvite(invite.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={addInvite} className="flex-1">
              <Plus className="mr-2 h-4 w-4" />
              Add Another
            </Button>
            <Button onClick={sendInvites} className="flex-1">
              <Send className="mr-2 h-4 w-4" />
              Send Invitations
            </Button>
          </div>
        </div>

        <div className="mt-6 rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-3">Role Permissions</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Admin:</span>
              <span className="text-muted-foreground ml-2">
                Full access to all features, settings, and billing
              </span>
            </div>
            <div>
              <span className="font-medium">Member:</span>
              <span className="text-muted-foreground ml-2">
                Can create and manage agents, workflows, and integrations
              </span>
            </div>
            <div>
              <span className="font-medium">Viewer:</span>
              <span className="text-muted-foreground ml-2">
                Read-only access to agents, workflows, and reports
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
