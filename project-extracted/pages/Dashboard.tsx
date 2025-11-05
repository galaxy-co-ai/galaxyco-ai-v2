import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { 
  Bot, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Plus,
  BookOpen,
  Plug,
  MessageSquare,
  FileText,
  Code,
  Users,
  Video,
  Sparkles,
  Zap,
  Activity,
  GitBranch,
  X,
  Search,
  Mail,
  Calendar,
  Database,
  Briefcase,
  DollarSign,
  ShoppingCart,
  Slack,
  Send,
  Github,
  Twitter,
  Linkedin,
  Chrome,
  Clock3,
  PlayCircle,
  PauseCircle,
  Filter,
  ArrowRight,
  Check
} from "lucide-react";

const stats = [
  {
    label: "Active Agents",
    value: 12,
    icon: Bot,
    color: "blue",
    gradient: "from-blue-500/10 to-blue-500/20",
    textColor: "text-blue-600",
    shadowColor: "shadow-[0_2px_10px_rgb(59,130,246,0.15)] hover:shadow-[0_4px_20px_rgb(59,130,246,0.25)]"
  },
  {
    label: "Tasks Completed",
    value: "1,247",
    icon: CheckCircle2,
    color: "green",
    gradient: "from-green-500/10 to-green-500/20",
    textColor: "text-green-600",
    shadowColor: "shadow-[0_2px_10px_rgb(34,197,94,0.15)] hover:shadow-[0_4px_20px_rgb(34,197,94,0.25)]"
  },
  {
    label: "Hours Saved",
    value: "342",
    icon: Clock,
    color: "purple",
    gradient: "from-purple-500/10 to-purple-500/20",
    textColor: "text-purple-600",
    shadowColor: "shadow-[0_2px_10px_rgb(168,85,247,0.15)] hover:shadow-[0_4px_20px_rgb(168,85,247,0.25)]"
  },
  {
    label: "Success Rate",
    value: "98.5%",
    icon: TrendingUp,
    color: "orange",
    gradient: "from-orange-500/10 to-orange-500/20",
    textColor: "text-orange-600",
    shadowColor: "shadow-[0_2px_10px_rgb(249,115,22,0.15)] hover:shadow-[0_4px_20px_rgb(249,115,22,0.25)]"
  },
];

interface ActiveAgent {
  id: string;
  name: string;
  status: "active" | "idle" | "processing";
  tasksCompleted: number;
  lastActive: string;
  type: string;
}

const activeAgents: ActiveAgent[] = [
  {
    id: "1",
    name: "Email Triage Agent",
    status: "processing",
    tasksCompleted: 342,
    lastActive: "2 min ago",
    type: "Email Automation"
  },
  {
    id: "2",
    name: "CRM Data Sync",
    status: "active",
    tasksCompleted: 156,
    lastActive: "5 min ago",
    type: "CRM Integration"
  },
  {
    id: "3",
    name: "Meeting Notes Generator",
    status: "active",
    tasksCompleted: 89,
    lastActive: "12 min ago",
    type: "Document Generation"
  },
  {
    id: "4",
    name: "Invoice Processor",
    status: "idle",
    tasksCompleted: 234,
    lastActive: "1 hour ago",
    type: "Financial Automation"
  },
  {
    id: "5",
    name: "Lead Qualifier",
    status: "processing",
    tasksCompleted: 426,
    lastActive: "Just now",
    type: "Sales Automation"
  }
];

interface RecentActivity {
  id: string;
  agent: string;
  action: string;
  time: string;
  status: "success" | "warning" | "error";
}

const recentActivity: RecentActivity[] = [
  {
    id: "1",
    agent: "Email Triage Agent",
    action: "Processed 12 high-priority emails",
    time: "2 min ago",
    status: "success"
  },
  {
    id: "2",
    agent: "Lead Qualifier",
    action: "Qualified 3 new leads from website",
    time: "5 min ago",
    status: "success"
  },
  {
    id: "3",
    agent: "Meeting Notes Generator",
    action: "Generated notes for TechCorp call",
    time: "15 min ago",
    status: "success"
  },
  {
    id: "4",
    agent: "CRM Data Sync",
    action: "Synced 24 contacts to Salesforce",
    time: "30 min ago",
    status: "success"
  },
  {
    id: "5",
    agent: "Invoice Processor",
    action: "Waiting for approval on invoice #1247",
    time: "1 hour ago",
    status: "warning"
  }
];

const workflows = [
  {
    id: "1",
    name: "Email to CRM Pipeline",
    status: "active",
    triggers: 3,
    actions: 7,
    runs: 342,
    nodes: [
      { id: "trigger", type: "trigger", label: "New Email", icon: Mail, position: { x: 50, y: 100 } },
      { id: "filter", type: "filter", label: "Filter Priority", icon: Filter, position: { x: 250, y: 100 } },
      { id: "crm", type: "action", label: "Add to CRM", icon: Database, position: { x: 450, y: 100 } }
    ]
  },
  {
    id: "2",
    name: "Meeting Notes Automation",
    status: "active",
    triggers: 2,
    actions: 5,
    runs: 156,
    nodes: [
      { id: "trigger", type: "trigger", label: "Meeting Ends", icon: Calendar, position: { x: 50, y: 100 } },
      { id: "transcribe", type: "action", label: "Transcribe", icon: FileText, position: { x: 250, y: 100 } },
      { id: "summarize", type: "action", label: "AI Summary", icon: Sparkles, position: { x: 450, y: 100 } }
    ]
  },
  {
    id: "3",
    name: "Lead Qualification Flow",
    status: "processing",
    triggers: 4,
    actions: 8,
    runs: 426,
    nodes: [
      { id: "trigger", type: "trigger", label: "New Lead", icon: Users, position: { x: 50, y: 100 } },
      { id: "score", type: "action", label: "AI Score", icon: Sparkles, position: { x: 250, y: 100 } },
      { id: "notify", type: "action", label: "Notify Sales", icon: Send, position: { x: 450, y: 100 } }
    ]
  }
];

const automations = [
  {
    id: "1",
    name: "Invoice Processing",
    trigger: "New invoice email received",
    actions: ["Extract data", "Validate", "Add to accounting"],
    frequency: "15-20 times/day",
    icon: DollarSign,
    color: "green"
  },
  {
    id: "2",
    name: "Lead Enrichment",
    trigger: "New contact added",
    actions: ["Find social profiles", "Get company data", "Update CRM"],
    frequency: "30-40 times/day",
    icon: Users,
    color: "blue"
  },
  {
    id: "3",
    name: "Meeting Prep",
    trigger: "Calendar event in 1 hour",
    actions: ["Gather context", "Pull recent emails", "Create brief"],
    frequency: "5-10 times/day",
    icon: Briefcase,
    color: "purple"
  },
  {
    id: "4",
    name: "Document Generation",
    trigger: "Deal marked as won",
    actions: ["Generate contract", "Get signatures", "File in system"],
    frequency: "2-5 times/day",
    icon: FileText,
    color: "orange"
  }
];

const integrations = [
  {
    id: "1",
    name: "Gmail",
    description: "Connect your Gmail account for email automation",
    icon: Mail,
    category: "Email",
    connected: true,
    color: "from-red-500 to-red-600"
  },
  {
    id: "2",
    name: "Google Calendar",
    description: "Sync meetings and automate scheduling",
    icon: Calendar,
    category: "Calendar",
    connected: true,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "3",
    name: "Salesforce",
    description: "Integrate with your CRM for seamless data flow",
    icon: Database,
    category: "CRM",
    connected: true,
    color: "from-cyan-500 to-cyan-600"
  },
  {
    id: "4",
    name: "Slack",
    description: "Get notifications and control agents from Slack",
    icon: Slack,
    category: "Communication",
    connected: false,
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "5",
    name: "HubSpot",
    description: "Connect your HubSpot CRM and marketing tools",
    icon: Briefcase,
    category: "CRM",
    connected: false,
    color: "from-orange-500 to-orange-600"
  },
  {
    id: "6",
    name: "GitHub",
    description: "Automate your development workflows",
    icon: Github,
    category: "Development",
    connected: false,
    color: "from-gray-700 to-gray-800"
  },
  {
    id: "7",
    name: "Stripe",
    description: "Process payments and manage subscriptions",
    icon: DollarSign,
    category: "Payments",
    connected: false,
    color: "from-indigo-500 to-indigo-600"
  },
  {
    id: "8",
    name: "Shopify",
    description: "Sync your e-commerce store data",
    icon: ShoppingCart,
    category: "E-commerce",
    connected: false,
    color: "from-green-500 to-green-600"
  },
  {
    id: "9",
    name: "Twitter",
    description: "Monitor and engage with your audience",
    icon: Twitter,
    category: "Social Media",
    connected: false,
    color: "from-sky-500 to-sky-600"
  },
  {
    id: "10",
    name: "LinkedIn",
    description: "Automate your professional networking",
    icon: Linkedin,
    category: "Social Media",
    connected: false,
    color: "from-blue-600 to-blue-700"
  },
  {
    id: "11",
    name: "Notion",
    description: "Sync documents and knowledge base",
    icon: FileText,
    category: "Documentation",
    connected: false,
    color: "from-gray-600 to-gray-700"
  },
  {
    id: "12",
    name: "Zoom",
    description: "Record and transcribe meetings automatically",
    icon: Video,
    category: "Video",
    connected: false,
    color: "from-blue-500 to-blue-600"
  }
];

export function Dashboard() {
  const [openDialog, setOpenDialog] = useState<"workflows" | "automations" | "integrations" | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: ActiveAgent["status"]) => {
    switch (status) {
      case "active": return "text-green-500";
      case "processing": return "text-blue-500";
      case "idle": return "text-gray-400";
    }
  };

  const getActivityStatusColor = (status: RecentActivity["status"]) => {
    switch (status) {
      case "success": return "bg-green-500/10 text-green-600";
      case "warning": return "bg-yellow-500/10 text-yellow-600";
      case "error": return "bg-red-500/10 text-red-600";
    }
  };

  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your AI agents and workflows.
        </p>
      </div>

      {/* Stats Pills */}
      <div className="flex items-center gap-3 flex-wrap">
        {stats.map((stat) => (
          <Badge 
            key={stat.label}
            variant="outline" 
            className={`h-8 px-4 rounded-full border-0 bg-gradient-to-br ${stat.gradient} ${stat.textColor} ${stat.shadowColor} transition-all`}
          >
            <stat.icon className="h-3.5 w-3.5 mr-2" />
            <span className="text-xs">{stat.value} {stat.label}</span>
          </Badge>
        ))}
      </div>

      {/* Floating Toolbar */}
      <div className="flex justify-center">
        <TooltipProvider>
          <div className="bg-background/80 backdrop-blur-lg border border-border rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-3 py-2 flex items-center gap-1">
            {/* Quick Actions */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-accent">
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-full py-1 px-3">
                Create New Agent
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-accent">
                  <BookOpen className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-full py-1 px-3">
                View Knowledge Base
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-accent">
                  <Plug className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-full py-1 px-3">
                Manage Integrations
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-accent bg-gradient-to-br from-purple-500/10 to-purple-700/10">
                  <MessageSquare className="h-4 w-4 text-purple-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-full py-1 px-3">
                Talk to AI Assistant
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Resources */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-accent">
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-full py-1 px-3">
                Documentation
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-accent">
                  <Code className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-full py-1 px-3">
                API Reference
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-accent">
                  <Users className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-full py-1 px-3">
                Community Forum
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-accent">
                  <Video className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-full py-1 px-3">
                Video Tutorials
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Agents */}
        <Card className="lg:col-span-2 p-0 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-0 rounded-2xl overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3>Active Agents</h3>
                <p className="text-sm text-muted-foreground">Your AI workforce in action</p>
              </div>
              <Badge variant="outline" className="bg-gradient-to-br from-blue-500/10 to-blue-500/20 text-blue-600 border-0 rounded-full">
                <Activity className="h-3 w-3 mr-1" />
                {activeAgents.filter(a => a.status !== "idle").length} Running
              </Badge>
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="p-6 space-y-3">
              {activeAgents.map((agent) => (
                <Card 
                  key={agent.id}
                  className="p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl hover:shadow-[0_6px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center shrink-0">
                      <Bot className="h-6 w-6 text-purple-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{agent.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{agent.type}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`shrink-0 border-0 text-xs rounded-full ${
                            agent.status === "processing" 
                              ? "bg-blue-500/10 text-blue-600" 
                              : agent.status === "active"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-gray-500/10 text-gray-600"
                          }`}
                        >
                          <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                            agent.status === "processing" 
                              ? "bg-blue-600 animate-pulse" 
                              : agent.status === "active"
                              ? "bg-green-600"
                              : "bg-gray-600"
                          }`} />
                          {agent.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{agent.tasksCompleted} tasks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{agent.lastActive}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Recent Activity */}
        <Card className="p-0 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-0 rounded-2xl overflow-hidden">
          <div className="p-6 border-b">
            <h3>Recent Activity</h3>
            <p className="text-sm text-muted-foreground">Latest agent actions</p>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="p-6 space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={activity.id}>
                  <div className="flex gap-3">
                    <div className="relative flex flex-col items-center">
                      <div className={`h-2 w-2 rounded-full ${
                        activity.status === "success" 
                          ? "bg-green-500" 
                          : activity.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`} />
                      {idx < recentActivity.length - 1 && (
                        <div className="w-px h-full bg-border mt-2" />
                      )}
                    </div>

                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.agent}</p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Workflow Insights */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card 
          className="p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all cursor-pointer group"
          onClick={() => setOpenDialog("workflows")}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GitBranch className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Workflows</p>
              <p className="text-2xl">8</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Running across all your agents
          </p>
        </Card>

        <Card 
          className="p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all cursor-pointer group"
          onClick={() => setOpenDialog("automations")}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">AI Automations</p>
              <p className="text-2xl">24</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Smart tasks running automatically
          </p>
        </Card>

        <Card 
          className="p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all cursor-pointer group"
          onClick={() => setOpenDialog("integrations")}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Integrations</p>
              <p className="text-2xl">12</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Connected tools and services
          </p>
        </Card>
      </div>

      {/* Workflows Dialog */}
      <Dialog open={openDialog === "workflows"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="!w-[95vw] !max-w-[1800px] h-[90vh] p-0 flex flex-col sm:!max-w-[1800px]">
          <DialogHeader className="p-6 pb-4 border-b shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Active Workflows</DialogTitle>
                <DialogDescription>
                  Visual overview of your automated workflows
                </DialogDescription>
              </div>
              <Button variant="outline" size="sm" className="rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                New Workflow
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden min-h-0">
            {/* Workflows List */}
            <div className="w-80 border-r flex flex-col min-h-0">
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {workflows.map((workflow) => (
                    <Card
                      key={workflow.id}
                      className={`p-4 cursor-pointer transition-all border-0 shadow-sm hover:shadow-md ${
                        selectedWorkflow === workflow.id
                          ? "bg-blue-500/5 ring-2 ring-blue-500/20"
                          : ""
                      }`}
                      onClick={() => setSelectedWorkflow(workflow.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm">{workflow.name}</p>
                        <Badge
                          variant="outline"
                          className={`text-xs border-0 rounded-full ${
                            workflow.status === "active"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-blue-500/10 text-blue-600"
                          }`}
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                              workflow.status === "active"
                                ? "bg-green-600"
                                : "bg-blue-600 animate-pulse"
                            }`}
                          />
                          {workflow.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{workflow.triggers} triggers</span>
                        <span>{workflow.actions} actions</span>
                        <span>{workflow.runs} runs</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Workflow Visualizer */}
            <div className="flex-1 relative min-h-0">
              {selectedWorkflow ? (
                <div className="absolute inset-0 p-8">
                  <div className="h-full rounded-xl border bg-gradient-to-br from-background/95 via-background/80 to-background/95 relative overflow-hidden">
                    {/* Dot Grid Background */}
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, hsl(var(--muted-foreground)) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                    />

                    {/* Workflow Nodes */}
                    <div className="relative h-full flex items-center justify-center p-12">
                      <svg
                        className="absolute inset-0 pointer-events-none"
                        style={{ width: "100%", height: "100%" }}
                      >
                        {workflows
                          .find((w) => w.id === selectedWorkflow)
                          ?.nodes.map((node, idx, arr) => {
                            if (idx === arr.length - 1) return null;
                            const nextNode = arr[idx + 1];
                            return (
                              <line
                                key={idx}
                                x1={node.position.x + 60}
                                y1={node.position.y + 40}
                                x2={nextNode.position.x + 60}
                                y2={nextNode.position.y + 40}
                                stroke="#6366f1"
                                strokeWidth="2"
                                opacity="0.4"
                                strokeDasharray="5,5"
                              />
                            );
                          })}
                      </svg>

                      <div className="relative flex items-center gap-12">
                        {workflows
                          .find((w) => w.id === selectedWorkflow)
                          ?.nodes.map((node, idx) => (
                            <div key={node.id} className="flex flex-col items-center gap-3">
                              <div className="relative">
                                <div
                                  className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${
                                    node.type === "trigger"
                                      ? "from-blue-500 to-blue-600"
                                      : node.type === "filter"
                                      ? "from-yellow-500 to-yellow-600"
                                      : "from-purple-500 to-purple-600"
                                  } shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform`}
                                >
                                  <node.icon className="h-8 w-8 text-white" />
                                </div>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-2 bg-gradient-to-br from-purple-500/20 to-purple-500/10 blur-sm rounded-full" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm">{node.label}</p>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {node.type}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Select a workflow to view details
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Automations Dialog */}
      <Dialog open={openDialog === "automations"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="!w-[95vw] !max-w-[1800px] h-[90vh] p-0 flex flex-col sm:!max-w-[1800px]">
          <DialogHeader className="p-6 pb-4 border-b shrink-0">
            <DialogTitle>AI Automations</DialogTitle>
            <DialogDescription>
              Smart tasks that run automatically based on triggers
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-6 space-y-4">
              {automations.map((automation) => (
                <Card
                  key={automation.id}
                  className="p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl hover:shadow-[0_6px_30px_rgb(0,0,0,0.08)] transition-all"
                >
                  <div className="flex gap-6">
                    <div
                      className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${
                        automation.color === "green"
                          ? "from-green-500 to-green-600"
                          : automation.color === "blue"
                          ? "from-blue-500 to-blue-600"
                          : automation.color === "purple"
                          ? "from-purple-500 to-purple-600"
                          : "from-orange-500 to-orange-600"
                      } shadow-lg flex items-center justify-center shrink-0`}
                    >
                      <automation.icon className="h-7 w-7 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4>{automation.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Runs {automation.frequency}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-600 border-0 rounded-full"
                        >
                          <PlayCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Trigger</p>
                          <div className="flex items-center gap-2 text-sm">
                            <Zap className="h-4 w-4 text-blue-500" />
                            <span>{automation.trigger}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Actions</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {automation.actions.map((action, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="bg-muted border-0 text-xs rounded-full"
                                >
                                  {idx + 1}. {action}
                                </Badge>
                                {idx < automation.actions.length - 1 && (
                                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Integrations Marketplace Dialog */}
      <Dialog open={openDialog === "integrations"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="!w-[95vw] !max-w-[1800px] h-[90vh] p-0 flex flex-col sm:!max-w-[1800px]">
          <DialogHeader className="p-6 pb-4 border-b shrink-0">
            <div className="space-y-4">
              <div>
                <DialogTitle>Integration Marketplace</DialogTitle>
                <DialogDescription>
                  Connect your favorite tools and services to GalaxyCo.ai
                </DialogDescription>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-full"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="rounded-full cursor-pointer hover:bg-accent">
                  All
                </Badge>
                <Badge variant="outline" className="rounded-full cursor-pointer hover:bg-accent">
                  Email
                </Badge>
                <Badge variant="outline" className="rounded-full cursor-pointer hover:bg-accent">
                  CRM
                </Badge>
                <Badge variant="outline" className="rounded-full cursor-pointer hover:bg-accent">
                  Communication
                </Badge>
                <Badge variant="outline" className="rounded-full cursor-pointer hover:bg-accent">
                  Development
                </Badge>
                <Badge variant="outline" className="rounded-full cursor-pointer hover:bg-accent">
                  Social Media
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIntegrations.map((integration) => (
                  <Card
                    key={integration.id}
                    className="p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl hover:shadow-[0_6px_30px_rgb(0,0,0,0.08)] transition-all group"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${integration.color} shadow-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        <integration.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="truncate">{integration.name}</h4>
                          {integration.connected && (
                            <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 rounded-full shrink-0">
                              <Check className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {integration.category}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {integration.description}
                    </p>

                    <Button
                      variant={integration.connected ? "outline" : "default"}
                      size="sm"
                      className="w-full rounded-full"
                    >
                      {integration.connected ? (
                        <>
                          <Check className="h-3 w-3 mr-2" />
                          Connected
                        </>
                      ) : (
                        <>
                          <Plug className="h-3 w-3 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
