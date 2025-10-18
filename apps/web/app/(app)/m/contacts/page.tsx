import { Metadata } from "next";
import {
  Search,
  Phone,
  Mail,
  Building2,
  Plus,
  Filter,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Contacts | GalaxyCo.ai",
  description: "Mobile contact management",
};

// Mock contacts data
const contacts = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@acme.com",
    phone: "+1 555-123-4567",
    company: "Acme Corp",
    role: "Marketing Director",
    status: "active",
    avatar: "SJ",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@techstart.io",
    phone: "+1 555-234-5678",
    company: "TechStart",
    role: "CTO",
    status: "lead",
    avatar: "MC",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@global.com",
    phone: "+1 555-345-6789",
    company: "Global Ventures",
    role: "Sales Manager",
    status: "active",
    avatar: "ER",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david@innovate.com",
    phone: "+1 555-456-7890",
    company: "InnovateLab",
    role: "Founder",
    status: "prospect",
    avatar: "DK",
  },
];

export default function MobileContactsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "lead":
        return "secondary";
      case "prospect":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <h1 className="text-xl font-semibold mb-3">Contacts</h1>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <Input
            placeholder="Search contacts..."
            className="pl-10 h-10"
            aria-label="Search contacts"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button variant="default" size="sm" className="whitespace-nowrap">
            All
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Active
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Leads
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            <Filter className="h-3 w-3 mr-1" />
            More
          </Button>
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="border-b border-border px-4 py-4 active:bg-background-subtle transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <Avatar fallback={contact.avatar} size="lg" />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-foreground-muted truncate">
                      {contact.role}
                    </p>
                  </div>
                  <button
                    className="ml-2 p-1 touch-manipulation"
                    aria-label="More options"
                  >
                    <MoreVertical className="h-5 w-5 text-foreground-muted" />
                  </button>
                </div>

                {/* Company */}
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-3.5 w-3.5 text-foreground-muted shrink-0" />
                  <span className="text-sm text-foreground-muted truncate">
                    {contact.company}
                  </span>
                </div>

                {/* Contact Methods */}
                <div className="flex items-center gap-3 mb-2">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-1.5 text-sm text-primary touch-manipulation"
                    aria-label={`Call ${contact.name}`}
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-1.5 text-sm text-primary touch-manipulation"
                    aria-label={`Email ${contact.name}`}
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Email</span>
                  </a>
                </div>

                {/* Status */}
                <Badge
                  variant={
                    getStatusColor(contact.status) as
                      | "default"
                      | "secondary"
                      | "outline"
                  }
                  size="sm"
                >
                  {contact.status}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-elevation-high flex items-center justify-center active:scale-95 transition-transform touch-manipulation"
        aria-label="Add new contact"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
