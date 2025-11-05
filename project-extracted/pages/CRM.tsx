import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip";
import { 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  Plus,
  Video,
  FileText,
  CheckCircle2,
  Circle,
  MoreVertical,
  Play,
  Pause,
  User,
  Building2,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Sparkles,
  AlertCircle,
  TrendingDown,
  Zap,
  Target,
  Briefcase,
  Users,
  Flag,
  ListTodo,
  Activity,
  FolderOpen,
  Edit
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  lastContact: string;
  status: "hot" | "warm" | "cold";
  value: string;
  interactions: number;
  aiHealthScore: number;
  aiInsight: string;
  nextAction: string;
  sentiment?: "positive" | "neutral" | "concerned";
}

interface Project {
  id: string;
  name: string;
  client: string;
  status: "active" | "planning" | "completed";
  progress: number;
  dueDate: string;
  team: string[];
  budget: string;
  spent: string;
  description: string;
  startDate: string;
  tasks: {
    id: string;
    title: string;
    status: "completed" | "in-progress" | "pending";
    assignee: string;
    dueDate: string;
  }[];
  milestones: {
    id: string;
    title: string;
    date: string;
    completed: boolean;
  }[];
  updates: {
    id: string;
    author: string;
    date: string;
    content: string;
  }[];
}

interface Deal {
  id: string;
  title: string;
  company: string;
  value: string;
  stage: "discovery" | "proposal" | "negotiation" | "closed";
  probability: number;
  closeDate: string;
  aiRisk?: "low" | "medium" | "high";
}

interface Interaction {
  id: string;
  type: "call" | "email" | "meeting";
  contactId: string;
  contact: string;
  date: string;
  duration?: string;
  summary: string;
  actionItems: string[];
  status: "transcribing" | "completed";
  sentiment?: "positive" | "neutral" | "negative";
  transcript?: string;
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Chen",
    company: "TechCorp Inc",
    email: "sarah.chen@techcorp.com",
    lastContact: "2 hours ago",
    status: "hot",
    value: "$45,000",
    interactions: 12,
    aiHealthScore: 92,
    aiInsight: "Highly engaged, mentioned budget approval",
    nextAction: "Send Q4 proposal by Friday",
    sentiment: "positive"
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    company: "InnovateLabs",
    email: "m.rodriguez@innovatelabs.com",
    lastContact: "Yesterday",
    status: "warm",
    value: "$28,000",
    interactions: 8,
    aiHealthScore: 76,
    aiInsight: "Interested in API integrations",
    nextAction: "Share technical documentation",
    sentiment: "neutral"
  },
  {
    id: "3",
    name: "Emma Thompson",
    company: "Global Systems",
    email: "emma.t@globalsys.com",
    lastContact: "3 days ago",
    status: "warm",
    value: "$62,000",
    interactions: 15,
    aiHealthScore: 68,
    aiInsight: "Needs legal review on SLA terms",
    nextAction: "Schedule call for Thursday",
    sentiment: "concerned"
  },
  {
    id: "4",
    name: "James Park",
    company: "StartupXYZ",
    email: "james@startupxyz.io",
    lastContact: "1 week ago",
    status: "cold",
    value: "$15,000",
    interactions: 4,
    aiHealthScore: 42,
    aiInsight: "No response to last 2 follow-ups",
    nextAction: "Re-engage with value proposition",
    sentiment: "neutral"
  }
];

const projects: Project[] = [
  {
    id: "1",
    name: "TechCorp Implementation",
    client: "TechCorp Inc",
    status: "active",
    progress: 65,
    dueDate: "Dec 15, 2025",
    startDate: "Oct 1, 2025",
    team: ["SC", "MR"],
    budget: "$45,000",
    spent: "$29,250",
    description: "Full-scale implementation of GalaxyCo.ai platform including AI Assistant, Knowledge Base, and CRM integration for TechCorp's 150+ employees.",
    tasks: [
      {
        id: "1",
        title: "Complete data migration from legacy CRM",
        status: "completed",
        assignee: "SC",
        dueDate: "Nov 1, 2025"
      },
      {
        id: "2",
        title: "Set up AI agent workflows for sales team",
        status: "in-progress",
        assignee: "MR",
        dueDate: "Nov 10, 2025"
      },
      {
        id: "3",
        title: "Configure knowledge base structure",
        status: "in-progress",
        assignee: "SC",
        dueDate: "Nov 15, 2025"
      },
      {
        id: "4",
        title: "User training sessions (3 sessions)",
        status: "pending",
        assignee: "MR",
        dueDate: "Dec 1, 2025"
      },
      {
        id: "5",
        title: "Final testing and QA",
        status: "pending",
        assignee: "SC",
        dueDate: "Dec 10, 2025"
      }
    ],
    milestones: [
      {
        id: "1",
        title: "Kickoff Meeting",
        date: "Oct 1, 2025",
        completed: true
      },
      {
        id: "2",
        title: "Data Migration Complete",
        date: "Nov 1, 2025",
        completed: true
      },
      {
        id: "3",
        title: "Core Features Deployed",
        date: "Nov 15, 2025",
        completed: false
      },
      {
        id: "4",
        title: "Training Complete",
        date: "Dec 1, 2025",
        completed: false
      },
      {
        id: "5",
        title: "Go-Live",
        date: "Dec 15, 2025",
        completed: false
      }
    ],
    updates: [
      {
        id: "1",
        author: "Sarah Chen",
        date: "Today, 3:00 PM",
        content: "Data migration completed successfully. All 5,000+ customer records transferred with zero data loss. Team is pleased with the results."
      },
      {
        id: "2",
        author: "Michael Rodriguez",
        date: "Yesterday, 11:30 AM",
        content: "Started configuring AI workflows for the sales team. Initial feedback is very positive - they're excited about the automation capabilities."
      },
      {
        id: "3",
        author: "Sarah Chen",
        date: "2 days ago, 4:15 PM",
        content: "Completed initial setup and configuration. Platform is ready for data migration phase."
      }
    ]
  },
  {
    id: "2",
    name: "InnovateLabs Integration",
    client: "InnovateLabs",
    status: "planning",
    progress: 20,
    dueDate: "Jan 30, 2026",
    startDate: "Nov 15, 2025",
    team: ["MR"],
    budget: "$28,000",
    spent: "$5,600",
    description: "API integration project to connect GalaxyCo.ai with InnovateLabs' existing tech stack including Salesforce, Slack, and custom internal tools.",
    tasks: [
      {
        id: "1",
        title: "API documentation review",
        status: "completed",
        assignee: "MR",
        dueDate: "Nov 10, 2025"
      },
      {
        id: "2",
        title: "Architecture design and approval",
        status: "in-progress",
        assignee: "MR",
        dueDate: "Nov 20, 2025"
      },
      {
        id: "3",
        title: "Salesforce integration development",
        status: "pending",
        assignee: "MR",
        dueDate: "Dec 15, 2025"
      },
      {
        id: "4",
        title: "Slack bot integration",
        status: "pending",
        assignee: "MR",
        dueDate: "Jan 10, 2026"
      }
    ],
    milestones: [
      {
        id: "1",
        title: "Project Kickoff",
        date: "Nov 15, 2025",
        completed: false
      },
      {
        id: "2",
        title: "Architecture Approved",
        date: "Nov 20, 2025",
        completed: false
      },
      {
        id: "3",
        title: "Salesforce Integration Live",
        date: "Dec 20, 2025",
        completed: false
      },
      {
        id: "4",
        title: "Full Integration Complete",
        date: "Jan 30, 2026",
        completed: false
      }
    ],
    updates: [
      {
        id: "1",
        author: "Michael Rodriguez",
        date: "Today, 10:00 AM",
        content: "Meeting with InnovateLabs tech team went well. They're eager to get started and have all API docs ready."
      }
    ]
  },
  {
    id: "3",
    name: "Global Systems Rollout",
    client: "Global Systems",
    status: "active",
    progress: 85,
    dueDate: "Nov 20, 2025",
    startDate: "Sep 1, 2025",
    team: ["ET", "JP"],
    budget: "$62,000",
    spent: "$52,700",
    description: "Enterprise rollout of GalaxyCo.ai across Global Systems' 5 regional offices with custom workflows and multi-language support.",
    tasks: [
      {
        id: "1",
        title: "Deploy to North America office",
        status: "completed",
        assignee: "ET",
        dueDate: "Sep 15, 2025"
      },
      {
        id: "2",
        title: "Deploy to Europe office",
        status: "completed",
        assignee: "JP",
        dueDate: "Oct 1, 2025"
      },
      {
        id: "3",
        title: "Deploy to Asia-Pacific offices",
        status: "completed",
        assignee: "ET",
        dueDate: "Oct 20, 2025"
      },
      {
        id: "4",
        title: "Finalize SLA documentation",
        status: "in-progress",
        assignee: "ET",
        dueDate: "Nov 15, 2025"
      },
      {
        id: "5",
        title: "Final sign-off and handover",
        status: "pending",
        assignee: "JP",
        dueDate: "Nov 20, 2025"
      }
    ],
    milestones: [
      {
        id: "1",
        title: "Contract Signed",
        date: "Sep 1, 2025",
        completed: true
      },
      {
        id: "2",
        title: "Phase 1 Rollout Complete",
        date: "Sep 15, 2025",
        completed: true
      },
      {
        id: "3",
        title: "Phase 2 Rollout Complete",
        date: "Oct 1, 2025",
        completed: true
      },
      {
        id: "4",
        title: "All Regions Deployed",
        date: "Oct 20, 2025",
        completed: true
      },
      {
        id: "5",
        title: "Project Complete",
        date: "Nov 20, 2025",
        completed: false
      }
    ],
    updates: [
      {
        id: "1",
        author: "Emma Thompson",
        date: "Yesterday, 4:15 PM",
        content: "Working on final SLA revisions with their legal team. Should have everything finalized by Thursday."
      },
      {
        id: "2",
        author: "James Park",
        date: "3 days ago, 2:00 PM",
        content: "Asia-Pacific deployment completed successfully. All regional teams are now live on the platform."
      },
      {
        id: "3",
        author: "Emma Thompson",
        date: "1 week ago, 10:00 AM",
        content: "Europe office deployment went smoothly. Positive feedback from the teams there."
      }
    ]
  }
];

const deals: Deal[] = [
  {
    id: "1",
    title: "Enterprise License",
    company: "TechCorp Inc",
    value: "$45,000",
    stage: "negotiation",
    probability: 85,
    closeDate: "Nov 30, 2025",
    aiRisk: "low"
  },
  {
    id: "2",
    title: "API Integration Package",
    company: "InnovateLabs",
    value: "$28,000",
    stage: "proposal",
    probability: 60,
    closeDate: "Dec 15, 2025",
    aiRisk: "medium"
  },
  {
    id: "3",
    title: "Custom Development",
    company: "Global Systems",
    value: "$62,000",
    stage: "negotiation",
    probability: 70,
    closeDate: "Dec 1, 2025",
    aiRisk: "medium"
  }
];

const interactions: Interaction[] = [
  // Sarah Chen interactions (contactId: "1")
  {
    id: "1",
    type: "call",
    contactId: "1",
    contact: "Sarah Chen",
    date: "Today, 2:30 PM",
    duration: "23 min",
    summary: "Discussed Q4 implementation timeline and budget allocation. Sarah expressed strong interest in expanding the partnership and mentioned their team is ready to move forward pending executive approval.",
    actionItems: [
      "Send proposal by Friday",
      "Schedule technical demo for next week",
      "Connect with their CTO"
    ],
    status: "completed",
    sentiment: "positive",
    transcript: "Full transcript available..."
  },
  {
    id: "2",
    type: "email",
    contactId: "1",
    contact: "Sarah Chen",
    date: "Yesterday, 9:15 AM",
    summary: "Sarah requested additional information about our enterprise security features and compliance certifications for their legal team review.",
    actionItems: [
      "Send SOC 2 compliance documentation",
      "Prepare security whitepaper"
    ],
    status: "completed",
    sentiment: "neutral"
  },
  {
    id: "3",
    type: "meeting",
    contactId: "1",
    contact: "Sarah Chen",
    date: "3 days ago, 3:00 PM",
    duration: "45 min",
    summary: "Initial discovery call. Discussed their current pain points with manual workflow processes and explored how our AI agents could help automate repetitive tasks.",
    actionItems: [
      "Send product demo recording",
      "Share case studies from similar companies"
    ],
    status: "completed",
    sentiment: "positive"
  },
  {
    id: "4",
    type: "call",
    contactId: "1",
    contact: "Sarah Chen",
    date: "1 week ago, 11:30 AM",
    duration: "15 min",
    summary: "Quick introductory call. Sarah mentioned TechCorp is actively looking for AI solutions to improve team productivity.",
    actionItems: [
      "Schedule full product demo"
    ],
    status: "completed",
    sentiment: "positive"
  },
  
  // Michael Rodriguez interactions (contactId: "2")
  {
    id: "5",
    type: "meeting",
    contactId: "2",
    contact: "Michael Rodriguez",
    date: "Today, 10:00 AM",
    duration: "45 min",
    summary: "Product roadmap review meeting. Discussed feature priorities and integration requirements with their existing tech stack.",
    actionItems: [
      "Share API documentation",
      "Provide pricing for enterprise tier"
    ],
    status: "transcribing",
    sentiment: "neutral"
  },
  {
    id: "6",
    type: "email",
    contactId: "2",
    contact: "Michael Rodriguez",
    date: "2 days ago, 2:00 PM",
    summary: "Michael asked about our API rate limits and webhook capabilities for real-time data sync.",
    actionItems: [
      "Schedule technical deep-dive call"
    ],
    status: "completed",
    sentiment: "neutral"
  },
  
  // Emma Thompson interactions (contactId: "3")
  {
    id: "7",
    type: "email",
    contactId: "3",
    contact: "Emma Thompson",
    date: "Yesterday, 4:15 PM",
    summary: "Follow-up on contract negotiations. Emma requested revisions to SLA terms, specifically around uptime guarantees and support response times.",
    actionItems: [
      "Review SLA with legal team",
      "Schedule call for Thursday"
    ],
    status: "completed",
    sentiment: "neutral"
  },
  {
    id: "8",
    type: "call",
    contactId: "3",
    contact: "Emma Thompson",
    date: "5 days ago, 1:00 PM",
    duration: "30 min",
    summary: "Contract review call. Emma's legal team raised concerns about data residency requirements and requested clarifications.",
    actionItems: [
      "Provide data residency documentation",
      "Connect with their legal counsel"
    ],
    status: "completed",
    sentiment: "neutral"
  },
  
  // James Park interactions (contactId: "4")
  {
    id: "9",
    type: "email",
    contactId: "4",
    contact: "James Park",
    date: "1 week ago, 10:00 AM",
    summary: "Sent follow-up email with pricing information and implementation timeline. No response yet.",
    actionItems: [
      "Wait for response",
      "Follow up next week if no reply"
    ],
    status: "completed",
    sentiment: "neutral"
  },
  {
    id: "10",
    type: "call",
    contactId: "4",
    contact: "James Park",
    date: "2 weeks ago, 4:30 PM",
    duration: "20 min",
    summary: "Initial outreach call. James seemed interested but mentioned budget constraints for this quarter.",
    actionItems: [
      "Send proposal with flexible payment terms"
    ],
    status: "completed",
    sentiment: "neutral"
  }
];

export default function CRM() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("contacts");
  const [selectedContact, setSelectedContact] = useState<string | null>("1");
  const [selectedProject, setSelectedProject] = useState<string | null>("1");
  const [selectedDeal, setSelectedDeal] = useState<string | null>("1");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "warm": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "cold": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "call": return Phone;
      case "email": return Mail;
      case "meeting": return Video;
      default: return MessageSquare;
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case "positive": return { icon: TrendingUp, color: "text-green-500" };
      case "concerned": return { icon: AlertCircle, color: "text-orange-500" };
      default: return { icon: TrendingDown, color: "text-muted-foreground" };
    }
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case "low": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>CRM</h1>
        <p className="text-muted-foreground">
          Auto-transcribe and organize calls, meetings, and emails
        </p>
      </div>

      {/* Stock Ticker Style KPIs */}
      <div className="flex gap-6 overflow-x-auto pb-1 scrollbar-hide">
        {/* Total Contacts */}
        <div className="flex items-center gap-2 min-w-fit">
          <User className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-muted-foreground">Contacts</span>
          <span className="tabular-nums">248</span>
          <span className="flex items-center gap-0.5 text-green-600 text-sm">
            <TrendingUp className="h-3 w-3" />
            +12%
          </span>
        </div>

        {/* Pipeline Value */}
        <div className="flex items-center gap-2 min-w-fit">
          <DollarSign className="h-4 w-4 text-green-500" />
          <span className="text-sm text-muted-foreground">Pipeline</span>
          <span className="tabular-nums">$1.2M</span>
          <span className="flex items-center gap-0.5 text-green-600 text-sm">
            <TrendingUp className="h-3 w-3" />
            +8%
          </span>
        </div>

        {/* Interactions */}
        <div className="flex items-center gap-2 min-w-fit">
          <MessageSquare className="h-4 w-4 text-purple-500" />
          <span className="text-sm text-muted-foreground">This Week</span>
          <span className="tabular-nums">38</span>
          <span className="flex items-center gap-0.5 text-green-600 text-sm">
            <TrendingUp className="h-3 w-3" />
            +24%
          </span>
        </div>

        {/* Hot Leads */}
        <div className="flex items-center gap-2 min-w-fit">
          <Zap className="h-4 w-4 text-red-500" />
          <span className="text-sm text-muted-foreground">Hot Leads</span>
          <span className="tabular-nums">12</span>
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-xs h-5 px-1.5">
            Active
          </Badge>
        </div>

        {/* Avg Response Time */}
        <div className="flex items-center gap-2 min-w-fit">
          <Clock className="h-4 w-4 text-orange-500" />
          <span className="text-sm text-muted-foreground">Avg Response</span>
          <span className="tabular-nums">2.4h</span>
          <span className="flex items-center gap-0.5 text-green-600 text-sm">
            <TrendingDown className="h-3 w-3" />
            -15%
          </span>
        </div>

        {/* Win Rate */}
        <div className="flex items-center gap-2 min-w-fit">
          <Target className="h-4 w-4 text-cyan-500" />
          <span className="text-sm text-muted-foreground">Win Rate</span>
          <span className="tabular-nums">68%</span>
          <span className="flex items-center gap-0.5 text-green-600 text-sm">
            <TrendingUp className="h-3 w-3" />
            +5%
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Sidebar with Tabs */}
        <Card className="lg:col-span-1 p-0 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-0 rounded-2xl overflow-hidden">
          {/* Tab Bar */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant={activeTab === "contacts" ? "default" : "ghost"}
                size="sm"
                className="h-8 flex-1"
                onClick={() => setActiveTab("contacts")}
              >
                <User className="h-4 w-4 mr-1.5" />
                Contacts
              </Button>
              <Button
                variant={activeTab === "projects" ? "default" : "ghost"}
                size="sm"
                className="h-8 flex-1"
                onClick={() => setActiveTab("projects")}
              >
                <Briefcase className="h-4 w-4 mr-1.5" />
                Projects
              </Button>
              <Button
                variant={activeTab === "sales" ? "default" : "ghost"}
                size="sm"
                className="h-8 flex-1"
                onClick={() => setActiveTab("sales")}
              >
                <Target className="h-4 w-4 mr-1.5" />
                Sales
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {/* Contacts View */}
            {activeTab === "contacts" && (
              <div className="p-2">
                {contacts.map((contact) => {
                  const sentimentData = getSentimentIcon(contact.sentiment);
                  const SentimentIcon = sentimentData.icon;
                  
                  return (
                    <button
                      key={contact.id}
                      onClick={() => setSelectedContact(contact.id)}
                      className={`w-full p-3 rounded-xl transition-all text-left mb-2 ${
                        selectedContact === contact.id 
                          ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.08)] scale-[1.02]" 
                          : "hover:bg-white/50 hover:shadow-[0_2px_10px_rgb(0,0,0,0.04)]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                            {contact.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate">{contact.name}</p>
                            <div className="flex items-center gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className={`flex items-center gap-1 ${getHealthScoreColor(contact.aiHealthScore)}`}>
                                    <Sparkles className="h-3 w-3" />
                                    <span className="text-xs">{contact.aiHealthScore}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="rounded-full py-1 px-3">
                                  AI Health Score
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {contact.company}
                          </p>
                          
                          {/* AI Insight */}
                          <div className="mt-2 flex items-start gap-1.5 bg-purple-500/5 rounded-lg px-2 py-1.5 border-0">
                            <Zap className="h-3 w-3 text-purple-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {contact.aiInsight}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className={`text-xs ${getStatusColor(contact.status)}`}>
                              {contact.status}
                            </Badge>
                            <p className="text-xs">{contact.value}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Projects View */}
            {activeTab === "projects" && (
              <div className="p-2">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={`w-full p-3 rounded-xl transition-all text-left mb-2 ${
                      selectedProject === project.id 
                        ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.08)] scale-[1.02]" 
                        : "hover:bg-white/50 hover:shadow-[0_2px_10px_rgb(0,0,0,0.04)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{project.name}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {project.client}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          project.status === "active" 
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : project.status === "planning"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                        }`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">Due {project.dueDate}</p>
                      <div className="flex -space-x-2">
                        {project.team.map((member, idx) => (
                          <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-700 text-white text-xs">
                              {member}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Sales View */}
            {activeTab === "sales" && (
              <div className="p-2">
                {deals.map((deal) => (
                  <button
                    key={deal.id}
                    onClick={() => setSelectedDeal(deal.id)}
                    className={`w-full p-3 rounded-xl transition-all text-left mb-2 ${
                      selectedDeal === deal.id 
                        ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.08)] scale-[1.02]" 
                        : "hover:bg-white/50 hover:shadow-[0_2px_10px_rgb(0,0,0,0.04)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{deal.title}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {deal.company}
                        </p>
                      </div>
                      <p className="shrink-0">{deal.value}</p>
                    </div>
                    
                    {/* AI Risk Assessment */}
                    {deal.aiRisk && (
                      <div className="mb-2">
                        <Badge variant="outline" className={`text-xs ${getRiskColor(deal.aiRisk)}`}>
                          <Sparkles className="h-3 w-3 mr-1" />
                          {deal.aiRisk} risk
                        </Badge>
                      </div>
                    )}
                    
                    {/* Probability Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground capitalize">{deal.stage}</span>
                        <span>{deal.probability}% likely</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            deal.probability >= 70 
                              ? "bg-gradient-to-r from-green-500 to-green-600"
                              : "bg-gradient-to-r from-yellow-500 to-yellow-600"
                          }`}
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">Close: {deal.closeDate}</p>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
          
          {/* Add Button */}
          <div className="p-3 border-t border-border">
            <Button size="sm" className="w-full h-8 shadow-[0_2px_10px_rgb(0,0,0,0.08)]">
              <Plus className="h-4 w-4 mr-1.5" />
              Add {activeTab === "contacts" ? "Contact" : activeTab === "projects" ? "Project" : "Deal"}
            </Button>
          </div>
        </Card>

        {/* Contact Details & Interactions OR Project Details */}
        <Card className="lg:col-span-2 p-0 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-0 rounded-2xl overflow-hidden">
          {activeTab === "contacts" && selectedContact && (() => {
            const contact = contacts.find(c => c.id === selectedContact);
            if (!contact) return null;

            const contactInteractions = interactions.filter(i => i.contactId === selectedContact);
            const sentimentData = getSentimentIcon(contact.sentiment);
            const SentimentIcon = sentimentData.icon;

            return (
              <>
                {/* Contact Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xl">
                        {contact.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2>{contact.name}</h2>
                          <div className="flex items-center gap-2 mt-1">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <p className="text-muted-foreground">{contact.company}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${getStatusColor(contact.status)} rounded-full border-0 shadow-[0_2px_8px_rgb(0,0,0,0.04)]`}>
                            {contact.status}
                          </Badge>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-[0_2px_8px_rgb(0,0,0,0.06)] ${getHealthScoreColor(contact.aiHealthScore)}`}>
                                <Sparkles className="h-4 w-4" />
                                <span>{contact.aiHealthScore}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="rounded-full py-1 px-3 shadow-[0_4px_12px_rgb(0,0,0,0.1)] border-0">
                              AI Health Score
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                      
                      {/* Contact Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        <Button variant="outline" size="sm" className="h-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0 bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
                          <Mail className="h-4 w-4 mr-1.5" />
                          Email
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0 bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
                          <Phone className="h-4 w-4 mr-1.5" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0 bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
                          <Calendar className="h-4 w-4 mr-1.5" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Insights Section */}
                  <div className="grid gap-3 mt-4 sm:grid-cols-2">
                    <div className="p-3 bg-purple-500/5 rounded-xl border-0 shadow-[0_2px_10px_rgb(0,0,0,0.03)]">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">AI Insight</p>
                          <p className="text-sm">{contact.aiInsight}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-500/5 rounded-xl border-0 shadow-[0_2px_10px_rgb(0,0,0,0.03)]">
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Next Action</p>
                          <p className="text-sm">{contact.nextAction}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Deal Value</p>
                        <p className="text-sm">{contact.value}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Interactions</p>
                        <p className="text-sm">{contact.interactions}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Last Contact</p>
                        <p className="text-sm">{contact.lastContact}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <SentimentIcon className={`h-4 w-4 ${sentimentData.color}`} />
                      <div>
                        <p className="text-xs text-muted-foreground">Sentiment</p>
                        <p className="text-sm capitalize">{contact.sentiment || "neutral"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactions Feed */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3>Interaction History ({contactInteractions.length})</h3>
                    <Button variant="outline" size="sm" className="h-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0 bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
                      <Plus className="h-4 w-4 mr-1.5" />
                      Log Interaction
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4">
                    {contactInteractions.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-muted-foreground">No interactions yet</p>
                      </div>
                    ) : (
                      contactInteractions.map((interaction) => {
                        const Icon = getInteractionIcon(interaction.type);
                        
                        return (
                          <Card key={interaction.id} className="p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl">
                            <div className="flex items-start gap-3">
                              {/* Icon */}
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0 space-y-3">
                                {/* Header */}
                                <div>
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2">
                                      <p className="capitalize">{interaction.type}</p>
                                      {interaction.status === "transcribing" && (
                                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse mr-1.5" />
                                          Transcribing
                                        </Badge>
                                      )}
                                      {interaction.sentiment && (
                                        <Badge 
                                          variant="outline" 
                                          className={`text-xs ${
                                            interaction.sentiment === "positive" 
                                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                                              : interaction.sentiment === "negative"
                                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                                              : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                                          }`}
                                        >
                                          {interaction.sentiment}
                                        </Badge>
                                      )}
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{interaction.date}</span>
                                    {interaction.duration && (
                                      <>
                                        <span>•</span>
                                        <span>{interaction.duration}</span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Summary */}
                                <div className="bg-muted/30 rounded-xl p-3 border-0">
                                  <p className="text-sm text-muted-foreground">
                                    {interaction.summary}
                                  </p>
                                </div>

                                {/* Action Items */}
                                {interaction.actionItems.length > 0 && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      Action Items
                                    </p>
                                    <div className="space-y-2">
                                      {interaction.actionItems.map((item, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                          <Circle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                          <p className="text-sm">{item}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Transcript Badge */}
                                {interaction.status === "completed" && (
                                  <div>
                                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                                      <FileText className="h-3 w-3 mr-1.5" />
                                      View Full Transcript
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </>
            );
          })()}

          {/* Project Details */}
          {activeTab === "projects" && selectedProject && (() => {
            const project = projects.find(p => p.id === selectedProject);
            if (!project) return null;

            const completedTasks = project.tasks.filter(t => t.status === "completed").length;
            const completedMilestones = project.milestones.filter(m => m.completed).length;

            return (
              <>
                {/* Project Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                      <Briefcase className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2>{project.name}</h2>
                          <div className="flex items-center gap-2 mt-1">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <p className="text-muted-foreground">{project.client}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`rounded-full border-0 shadow-[0_2px_8px_rgb(0,0,0,0.04)] ${
                              project.status === "active" 
                                ? "bg-green-500/10 text-green-500"
                                : project.status === "planning"
                                ? "bg-blue-500/10 text-blue-500"
                                : "bg-gray-500/10 text-gray-500"
                            }`}
                          >
                            {project.status}
                          </Badge>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-[0_2px_8px_rgb(0,0,0,0.06)]">
                            <span className="text-sm">{project.progress}%</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        <Button variant="outline" size="sm" className="h-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0 bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
                          <Edit className="h-4 w-4 mr-1.5" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0 bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
                          <Users className="h-4 w-4 mr-1.5" />
                          Team
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0 bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
                          <FolderOpen className="h-4 w-4 mr-1.5" />
                          Files
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground mt-4">
                    {project.description}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div className="p-3 bg-blue-500/5 rounded-xl border-0 shadow-[0_2px_10px_rgb(0,0,0,0.03)]">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="h-4 w-4 text-blue-500" />
                        <p className="text-xs text-muted-foreground">Budget</p>
                      </div>
                      <p className="text-lg">{project.budget}</p>
                    </div>
                    
                    <div className="p-3 bg-orange-500/5 rounded-xl border-0 shadow-[0_2px_10px_rgb(0,0,0,0.03)]">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-4 w-4 text-orange-500" />
                        <p className="text-xs text-muted-foreground">Spent</p>
                      </div>
                      <p className="text-lg">{project.spent}</p>
                    </div>
                    
                    <div className="p-3 bg-green-500/5 rounded-xl border-0 shadow-[0_2px_10px_rgb(0,0,0,0.03)]">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <p className="text-xs text-muted-foreground">Start Date</p>
                      </div>
                      <p className="text-sm">{project.startDate}</p>
                    </div>
                    
                    <div className="p-3 bg-red-500/5 rounded-xl border-0 shadow-[0_2px_10px_rgb(0,0,0,0.03)]">
                      <div className="flex items-center gap-2 mb-1">
                        <Flag className="h-4 w-4 text-red-500" />
                        <p className="text-xs text-muted-foreground">Due Date</p>
                      </div>
                      <p className="text-sm">{project.dueDate}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">Overall Progress</p>
                      <p className="text-sm text-muted-foreground">{project.progress}%</p>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tabs for Project Details */}
                <Tabs defaultValue="tasks" className="flex-1 flex flex-col">
                  <div className="px-6 pt-4 border-b border-border">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="tasks">
                        <ListTodo className="h-4 w-4 mr-1.5" />
                        Tasks ({completedTasks}/{project.tasks.length})
                      </TabsTrigger>
                      <TabsTrigger value="milestones">
                        <Flag className="h-4 w-4 mr-1.5" />
                        Milestones ({completedMilestones}/{project.milestones.length})
                      </TabsTrigger>
                      <TabsTrigger value="updates">
                        <Activity className="h-4 w-4 mr-1.5" />
                        Updates ({project.updates.length})
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <ScrollArea className="flex-1">
                    {/* Tasks Tab */}
                    <TabsContent value="tasks" className="p-4 space-y-3 mt-0">
                      {project.tasks.map((task) => (
                        <Card key={task.id} className="p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl">
                          <div className="flex items-start gap-3">
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${
                              task.status === "completed"
                                ? "bg-green-500"
                                : task.status === "in-progress"
                                ? "bg-blue-500"
                                : "bg-muted"
                            }`}>
                              {task.status === "completed" && (
                                <CheckCircle2 className="h-3 w-3 text-white" />
                              )}
                              {task.status === "in-progress" && (
                                <Clock className="h-3 w-3 text-white" />
                              )}
                              {task.status === "pending" && (
                                <Circle className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className={task.status === "completed" ? "line-through text-muted-foreground" : ""}>
                                {task.title}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>{task.assignee}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Due {task.dueDate}</span>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs rounded-full border-0 ${
                                    task.status === "completed"
                                      ? "bg-green-500/10 text-green-500"
                                      : task.status === "in-progress"
                                      ? "bg-blue-500/10 text-blue-500"
                                      : "bg-gray-500/10 text-gray-500"
                                  }`}
                                >
                                  {task.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </TabsContent>

                    {/* Milestones Tab */}
                    <TabsContent value="milestones" className="p-4 space-y-3 mt-0">
                      {project.milestones.map((milestone, index) => (
                        <Card key={milestone.id} className="p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl">
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                                milestone.completed
                                  ? "bg-green-500"
                                  : "bg-muted"
                              }`}>
                                {milestone.completed ? (
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                ) : (
                                  <Flag className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              {index < project.milestones.length - 1 && (
                                <div className={`absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 ${
                                  milestone.completed ? "bg-green-500/30" : "bg-muted"
                                }`} />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className={milestone.completed ? "" : "text-muted-foreground"}>
                                {milestone.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{milestone.date}</span>
                                {milestone.completed && (
                                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-0 text-xs rounded-full">
                                    Completed
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </TabsContent>

                    {/* Updates Tab */}
                    <TabsContent value="updates" className="p-4 space-y-3 mt-0">
                      {project.updates.map((update) => (
                        <Card key={update.id} className="p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                                {update.author.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p>{update.author}</p>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">{update.date}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{update.content}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </>
            );
          })()}

          {/* Deal Details */}
          {activeTab === "sales" && selectedDeal && (() => {
            const deal = deals.find(d => d.id === selectedDeal);
            if (!deal) return null;

            return (
              <>
                {/* Deal Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2>{deal.title}</h2>
                          <div className="flex items-center gap-2 mt-1">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <p className="text-muted-foreground">{deal.company}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className="rounded-full border-0 shadow-[0_2px_8px_rgb(0,0,0,0.04)] bg-green-500/10 text-green-500 capitalize"
                          >
                            {deal.stage}
                          </Badge>
                          {deal.aiRisk && (
                            <Badge 
                              variant="outline" 
                              className={`rounded-full border-0 shadow-[0_2px_8px_rgb(0,0,0,0.04)] ${getRiskColor(deal.aiRisk)}`}
                            >
                              <Sparkles className="h-3 w-3 mr-1" />
                              {deal.aiRisk} risk
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        <Button variant="outline" size="sm" className="h-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0 bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
                          <Edit className="h-4 w-4 mr-1.5" />
                          Edit Deal
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0 bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
                          <User className="h-4 w-4 mr-1.5" />
                          Contact
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0 bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
                          <Activity className="h-4 w-4 mr-1.5" />
                          Activity
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-green-500/5 rounded-xl border-0 shadow-[0_2px_10px_rgb(0,0,0,0.03)]">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <p className="text-xs text-muted-foreground">Deal Value</p>
                      </div>
                      <p className="text-2xl">{deal.value}</p>
                    </div>
                    
                    <div className="p-4 bg-blue-500/5 rounded-xl border-0 shadow-[0_2px_10px_rgb(0,0,0,0.03)]">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-5 w-5 text-blue-500" />
                        <p className="text-xs text-muted-foreground">Win Probability</p>
                      </div>
                      <p className="text-2xl">{deal.probability}%</p>
                    </div>
                    
                    <div className="p-4 bg-purple-500/5 rounded-xl border-0 shadow-[0_2px_10px_rgb(0,0,0,0.03)]">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-5 w-5 text-purple-500" />
                        <p className="text-xs text-muted-foreground">Expected Close</p>
                      </div>
                      <p className="text-lg">{deal.closeDate}</p>
                    </div>
                  </div>
                  
                  {/* Probability Bar */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">Win Probability</p>
                      <p className="text-sm text-muted-foreground">{deal.probability}%</p>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          deal.probability >= 70 
                            ? "bg-gradient-to-r from-green-500 to-emerald-600"
                            : "bg-gradient-to-r from-yellow-500 to-orange-600"
                        }`}
                        style={{ width: `${deal.probability}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Deal Pipeline Stages */}
                <div className="p-6 border-b border-border">
                  <h3 className="mb-4">Deal Pipeline</h3>
                  <div className="relative">
                    <div className="flex justify-between">
                      {["discovery", "proposal", "negotiation", "closed"].map((stage, index) => {
                        const isActive = ["discovery", "proposal", "negotiation", "closed"].indexOf(deal.stage) >= index;
                        const isCurrent = deal.stage === stage;
                        
                        return (
                          <div key={stage} className="flex-1 flex flex-col items-center relative">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                              isCurrent
                                ? "bg-blue-500 shadow-[0_4px_20px_rgb(59,130,246,0.4)]"
                                : isActive
                                ? "bg-green-500"
                                : "bg-muted"
                            }`}>
                              {isActive ? (
                                <CheckCircle2 className="h-5 w-5 text-white" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <p className={`text-xs capitalize ${isCurrent ? "" : "text-muted-foreground"}`}>
                              {stage}
                            </p>
                            {index < 3 && (
                              <div className={`absolute top-5 left-1/2 w-full h-0.5 ${
                                isActive ? "bg-green-500" : "bg-muted"
                              }`} style={{ zIndex: -1 }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* AI Insights & Next Steps */}
                <ScrollArea className="flex-1">
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="mb-3">AI Insights</h3>
                      <Card className="p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl bg-purple-500/5">
                        <div className="flex items-start gap-3">
                          <Sparkles className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm">
                              {deal.aiRisk === "low" 
                                ? "This deal is progressing well. The contact has been highly responsive and engagement metrics are positive. Consider scheduling a follow-up demo to move to the next stage."
                                : deal.aiRisk === "medium"
                                ? "Deal requires attention. Response times have slowed and there's been limited engagement in the past week. Recommend reaching out to re-engage and address any concerns."
                                : "High-risk deal. Multiple follow-ups have gone unanswered. Consider offering additional value or scheduling a call to understand blockers."
                              }
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <div>
                      <h3 className="mb-3">Recommended Next Steps</h3>
                      <div className="space-y-2">
                        <Card className="p-3 shadow-[0_2px_10px_rgb(0,0,0,0.03)] border-0 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Circle className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">Send personalized follow-up email</p>
                          </div>
                        </Card>
                        <Card className="p-3 shadow-[0_2px_10px_rgb(0,0,0,0.03)] border-0 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Circle className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">Schedule product demo for decision makers</p>
                          </div>
                        </Card>
                        <Card className="p-3 shadow-[0_2px_10px_rgb(0,0,0,0.03)] border-0 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Circle className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">Share relevant case studies</p>
                          </div>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3">Recent Activity</h3>
                      <div className="space-y-3">
                        <Card className="p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                              <Mail className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-sm">Email sent: Q4 Proposal</p>
                              <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                            </div>
                          </div>
                        </Card>
                        <Card className="p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                              <Phone className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm">Call: Discovery call completed</p>
                              <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </>
            );
          })()}
        </Card>
      </div>
    </div>
  );
}
