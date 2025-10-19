"use client";

import { useState } from "react";
import { ListPage } from "@/components/templates/list-page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  MoreVertical,
  UserPlus,
  Download,
  Upload,
} from "lucide-react";

// Mock data for contacts
const mockContacts = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@acmecorp.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corporation",
    role: "Marketing Director",
    type: "customer",
    status: "active",
    lastContact: "2025-10-15",
    tags: ["Enterprise", "Priority"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@techstart.io",
    phone: "+1 (555) 234-5678",
    company: "TechStart Inc",
    role: "CTO",
    type: "lead",
    status: "active",
    lastContact: "2025-10-16",
    tags: ["Tech", "Decision Maker"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@globalventures.com",
    phone: "+1 (555) 345-6789",
    company: "Global Ventures",
    role: "Sales Manager",
    type: "customer",
    status: "active",
    lastContact: "2025-10-14",
    tags: ["Sales", "High Value"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david@innovatelab.com",
    phone: "+1 (555) 456-7890",
    company: "InnovateLab",
    role: "Founder",
    type: "lead",
    status: "nurturing",
    lastContact: "2025-10-10",
    tags: ["Startup", "Warm Lead"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    id: "5",
    name: "Jessica Martinez",
    email: "j.martinez@enterprise-solutions.com",
    phone: "+1 (555) 567-8901",
    company: "Enterprise Solutions",
    role: "VP Operations",
    type: "customer",
    status: "active",
    lastContact: "2025-10-17",
    tags: ["Enterprise", "Champion"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
  },
  {
    id: "6",
    name: "Robert Taylor",
    email: "rtaylor@futuretech.net",
    phone: "+1 (555) 678-9012",
    company: "FutureTech",
    role: "Head of Product",
    type: "lead",
    status: "cold",
    lastContact: "2025-09-20",
    tags: ["Product", "Cold Lead"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
  },
];

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "customer", label: "Customer" },
  { value: "lead", label: "Lead" },
  { value: "partner", label: "Partner" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "nurturing", label: "Nurturing" },
  { value: "cold", label: "Cold" },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState(mockContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter contacts based on search and filters
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      searchQuery === "" ||
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || contact.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || contact.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const renderContactCard = (contact: (typeof mockContacts)[0]) => {
    const statusColors: Record<string, "default" | "secondary" | "outline"> = {
      active: "default",
      nurturing: "secondary",
      cold: "outline",
    };

    const typeColors: Record<string, "default" | "secondary" | "outline"> = {
      customer: "default",
      lead: "secondary",
      partner: "outline",
    };

    return (
      <div
        key={contact.id}
        className="group relative rounded-lg border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={contact.avatar}
              alt={contact.name}
              fallback={contact.name.slice(0, 2).toUpperCase()}
              size="lg"
            />
            <div>
              <h3 className="font-semibold text-lg">{contact.name}</h3>
              <p className="text-sm text-muted-foreground">{contact.role}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Company */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span>{contact.company}</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground truncate">
              {contact.email}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{contact.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Last contact: {new Date(contact.lastContact).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={typeColors[contact.type]}>
            {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
          </Badge>
          <Badge variant={statusColors[contact.status]}>
            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
          </Badge>
        </div>

        {/* Tags */}
        {contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {contact.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions (show on hover) */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-card border-t border-border rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Phone className="mr-2 h-4 w-4" />
              Call
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ListPage
      title="Contacts"
      subtitle="Manage your contacts and relationships"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Contacts" }]}
      searchPlaceholder="Search contacts..."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      showFilters={false}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      }
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => renderContactCard(contact))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No contacts found</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setTypeFilter("all");
              setStatusFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </ListPage>
  );
}
