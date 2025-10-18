"use client";

import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  Globe,
  TrendingUp,
  Users,
  DollarSign,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  status: "active" | "inactive" | "lead";
  value: number;
  employees: number;
  industry: string;
  lastContact: string;
  avatar: string;
}

const customers: Customer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    company: "TechCorp Industries",
    email: "sarah@techcorp.com",
    phone: "+1 (555) 123-4567",
    website: "techcorp.com",
    status: "active",
    value: 125000,
    employees: 450,
    industry: "Technology",
    lastContact: "2025-10-15",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SJ",
  },
  {
    id: "2",
    name: "Michael Chen",
    company: "Global Solutions Inc",
    email: "michael@globalsolutions.com",
    phone: "+1 (555) 234-5678",
    website: "globalsolutions.com",
    status: "active",
    value: 85000,
    employees: 200,
    industry: "Consulting",
    lastContact: "2025-10-14",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MC",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    company: "Innovate Labs",
    email: "emily@innovatelabs.io",
    phone: "+1 (555) 345-6789",
    website: "innovatelabs.io",
    status: "lead",
    value: 0,
    employees: 75,
    industry: "SaaS",
    lastContact: "2025-10-10",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=ER",
  },
  {
    id: "4",
    name: "David Park",
    company: "Enterprise Systems",
    email: "david@enterprisesys.com",
    phone: "+1 (555) 456-7890",
    website: "enterprisesys.com",
    status: "active",
    value: 210000,
    employees: 1200,
    industry: "Enterprise Software",
    lastContact: "2025-10-12",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DP",
  },
];

const statusConfig = {
  active: {
    label: "Active",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
  },
  lead: {
    label: "Lead",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
};

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = customers
    .filter((c) => c.status === "active")
    .reduce((sum, c) => sum + c.value, 0);
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const leads = customers.filter((c) => c.status === "lead").length;

  return (
    <PageShell
      title="Customers"
      subtitle="Manage your customer relationships and accounts"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Customers" }]}
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      }
    >
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Active Customers
            </span>
          </div>
          <p className="text-2xl font-bold">{activeCustomers}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">New Leads</span>
          </div>
          <p className="text-2xl font-bold">{leads}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Total Value</span>
          </div>
          <p className="text-2xl font-bold">
            ${(totalValue / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="lead">Lead</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            List
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredCustomers.length} customer
          {filteredCustomers.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="group rounded-lg border border-border bg-card p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={customer.avatar}
                    alt={customer.name}
                    fallback={customer.name.substring(0, 2)}
                    size="default"
                  />
                  <div>
                    <h3 className="font-semibold">{customer.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {customer.company}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">
                    {customer.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {customer.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {customer.website}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Badge className={statusConfig[customer.status].className}>
                  {statusConfig[customer.status].label}
                </Badge>
                {customer.status === "active" && (
                  <span className="text-sm font-semibold">
                    ${(customer.value / 1000).toFixed(0)}K
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-subtle">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">
                    Customer
                  </th>
                  <th className="text-left p-4 font-medium text-sm">Company</th>
                  <th className="text-left p-4 font-medium text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-sm">
                    Industry
                  </th>
                  <th className="text-left p-4 font-medium text-sm">Value</th>
                  <th className="text-left p-4 font-medium text-sm">
                    Last Contact
                  </th>
                  <th className="text-left p-4 font-medium text-sm"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t border-border hover:bg-background-subtle transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={customer.avatar}
                          alt={customer.name}
                          fallback={customer.name.substring(0, 2)}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{customer.company}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={statusConfig[customer.status].className}
                      >
                        {statusConfig[customer.status].label}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {customer.industry}
                    </td>
                    <td className="p-4 font-semibold">
                      {customer.status === "active"
                        ? `$${(customer.value / 1000).toFixed(0)}K`
                        : "-"}
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {new Date(customer.lastContact).toLocaleDateString()}
                    </td>
                    <td className="p-4">
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
      )}

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No customers found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Customer
          </Button>
        </div>
      )}
    </PageShell>
  );
}
