"use client";

import { useState, useEffect } from "react";
import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useWorkspace } from "@/contexts/workspace-context";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  MoreVertical,
  UserPlus,
  Search,
} from "lucide-react";

interface Contact {
  id: string;
  workspaceId: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  title: string | null;
  company: string | null;
  tags: string[];
  lastContactedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ContactsPage() {
  const { currentWorkspace } = useWorkspace();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchContacts() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          workspaceId: currentWorkspace.id,
          limit: "100",
        });

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        const res = await fetch(`/api/contacts?${params}`);
        if (!res.ok) throw new Error("Failed to fetch contacts");

        const data = await res.json();
        setContacts(data.contacts);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
        toast.error("Failed to load contacts");
      } finally {
        setIsLoading(false);
      }
    }

    fetchContacts();
  }, [currentWorkspace?.id, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const getFullName = (contact: Contact) => {
    return (
      [contact.firstName, contact.lastName].filter(Boolean).join(" ") ||
      contact.email
    );
  };

  return (
    <PageShell
      title="Contacts"
      subtitle="Manage your professional contacts"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Contacts" },
      ]}
      actions={
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      }
    >
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {contacts.length} contact{contacts.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Grid View */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="group rounded-lg border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(getFullName(contact))}`}
                  alt={getFullName(contact)}
                  fallback={getFullName(contact).substring(0, 2).toUpperCase()}
                  size="lg"
                />
                <div>
                  <h3 className="font-semibold text-lg">
                    {getFullName(contact)}
                  </h3>
                  {contact.title && (
                    <p className="text-sm text-muted-foreground">
                      {contact.title}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            {/* Company */}
            {contact.company && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.company}</span>
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground truncate">
                  {contact.email}
                </span>
              </div>
              {contact.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{contact.phone}</span>
                </div>
              )}
              {contact.lastContactedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Last contact:{" "}
                    {new Date(contact.lastContactedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            {contact.tags && contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                {contact.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {contacts.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <UserPlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "Try adjusting your search"
              : "Get started by adding your first contact"}
          </p>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Your First Contact
          </Button>
        </div>
      )}
    </PageShell>
  );
}
