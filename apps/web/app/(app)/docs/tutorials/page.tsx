import { Metadata } from "next";
import {
  Play,
  Clock,
  BookOpen,
  Award,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tutorials | GalaxyCo.ai",
  description: "Learn GalaxyCo.ai with video tutorials and guides",
};

// Mock tutorial data
const tutorialCategories = [
  "Getting Started",
  "Agent Building",
  "Workflows",
  "Integrations",
  "Advanced",
];

const tutorials = [
  {
    id: "1",
    title: "Getting Started with GalaxyCo.ai",
    description: "A complete introduction to the platform and core features",
    duration: "15 min",
    level: "Beginner",
    category: "Getting Started",
    views: "12.4K",
    thumbnail: "🚀",
  },
  {
    id: "2",
    title: "Building Your First AI Agent",
    description:
      "Step-by-step guide to creating and deploying your first agent",
    duration: "22 min",
    level: "Beginner",
    category: "Agent Building",
    views: "8.9K",
    thumbnail: "🤖",
  },
  {
    id: "3",
    title: "Workflow Automation Masterclass",
    description: "Learn advanced workflow patterns and best practices",
    duration: "45 min",
    level: "Advanced",
    category: "Workflows",
    views: "6.2K",
    thumbnail: "⚙️",
  },
  {
    id: "4",
    title: "Integrating with Salesforce",
    description:
      "Connect GalaxyCo.ai with Salesforce CRM for seamless data sync",
    duration: "18 min",
    level: "Intermediate",
    category: "Integrations",
    views: "5.7K",
    thumbnail: "🔗",
  },
  {
    id: "5",
    title: "API Integration Deep Dive",
    description: "Master API integrations and custom webhook configurations",
    duration: "32 min",
    level: "Advanced",
    category: "Advanced",
    views: "4.1K",
    thumbnail: "🔧",
  },
  {
    id: "6",
    title: "Contact Management Best Practices",
    description: "Organize and segment your contacts effectively",
    duration: "12 min",
    level: "Beginner",
    category: "Getting Started",
    views: "7.8K",
    thumbnail: "👥",
  },
];

export default function TutorialsPage() {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Video Tutorials</h1>
        <p className="text-foreground-muted">
          Master GalaxyCo.ai with our comprehensive video tutorials
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search tutorials..."
              className="pl-10"
              aria-label="Search tutorials"
            />
          </div>
          <div className="flex gap-2">
            <select className="h-10 px-3 border border-border rounded-md bg-background text-sm">
              <option>All Categories</option>
              {tutorialCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <select className="h-10 px-3 border border-border rounded-md bg-background text-sm">
              <option>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Featured Tutorial */}
      <Card className="p-8 mb-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <Award className="h-6 w-6 text-primary" />
          <Badge variant="default">Featured</Badge>
        </div>
        <h2 className="text-2xl font-semibold mb-3">
          Complete GalaxyCo.ai Masterclass
        </h2>
        <p className="text-foreground-muted mb-6 max-w-2xl">
          Everything you need to become an expert in AI automation. From basic
          concepts to advanced integrations and best practices.
        </p>
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-foreground-muted" />
            <span>2h 15m</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Play className="h-4 w-4 text-foreground-muted" />
            <span>15.3K views</span>
          </div>
          <Badge variant="secondary">All Levels</Badge>
        </div>
        <Button size="lg">
          <Play className="h-5 w-5 mr-2" />
          Start Learning
        </Button>
      </Card>

      {/* Tutorial Grid */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-6">All Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <Card
              key={tutorial.id}
              className="overflow-hidden hover:border-primary hover:shadow-md transition-all cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-background-subtle flex items-center justify-center text-6xl border-b border-border">
                {tutorial.thumbnail}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" size="sm">
                    {tutorial.category}
                  </Badge>
                  <Badge
                    variant={
                      tutorial.level === "Beginner"
                        ? "default"
                        : tutorial.level === "Intermediate"
                          ? "secondary"
                          : "outline"
                    }
                    size="sm"
                  >
                    {tutorial.level}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2">
                  {tutorial.title}
                </h3>
                <p className="text-sm text-foreground-muted mb-4 line-clamp-2">
                  {tutorial.description}
                </p>
                <div className="flex items-center justify-between text-xs text-foreground-muted">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{tutorial.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="h-3 w-3" />
                    <span>{tutorial.views} views</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Paths */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Learning Paths</h2>
        <p className="text-sm text-foreground-muted mb-6">
          Follow structured paths to master specific skills
        </p>
        <div className="space-y-3">
          {[
            {
              title: "Beginner to Pro",
              description: "Complete journey from basics to advanced features",
              tutorials: 12,
              duration: "4h 30m",
            },
            {
              title: "Workflow Automation Expert",
              description: "Master workflow creation and optimization",
              tutorials: 8,
              duration: "3h 15m",
            },
            {
              title: "Integration Specialist",
              description: "Connect GalaxyCo.ai with all your tools",
              tutorials: 6,
              duration: "2h 45m",
            },
          ].map((path, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{path.title}</h3>
                  <p className="text-sm text-foreground-muted">
                    {path.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-foreground-muted">
                    <span>{path.tutorials} tutorials</span>
                    <span>·</span>
                    <span>{path.duration}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-foreground-muted" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
