import { Metadata } from "next";
import Link from "next/link";
import {
  MessageCircle,
  Mail,
  Book,
  Phone,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Support | GalaxyCo.ai",
  description: "Get help and support",
};

export default function SupportPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
        <p className="text-lg text-foreground-muted mb-6">
          Get support from our team or find answers in our knowledge base
        </p>

        {/* Search */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted" />
          <Input
            placeholder="Search for help articles, guides, or tutorials..."
            className="pl-12 h-14 text-base"
            aria-label="Search support"
          />
        </div>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <Link href="/help/contact">
          <Card className="p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-foreground-muted">
              Chat with our support team in real-time
            </p>
          </Card>
        </Link>

        <Link href="/help/contact">
          <Card className="p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-foreground-muted">
              Get help via email within 24 hours
            </p>
          </Card>
        </Link>

        <Link href="/docs">
          <Card className="p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
            <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
              <Book className="h-6 w-6 text-warning" />
            </div>
            <h3 className="font-semibold mb-2">Documentation</h3>
            <p className="text-sm text-foreground-muted">
              Browse guides and API references
            </p>
          </Card>
        </Link>

        <Card className="p-6 bg-background-subtle border-dashed h-full">
          <div className="h-12 w-12 rounded-lg bg-background flex items-center justify-center mb-4">
            <Phone className="h-6 w-6 text-foreground-muted" />
          </div>
          <h3 className="font-semibold mb-2">Phone Support</h3>
          <p className="text-sm text-foreground-muted">
            Available for Enterprise plans
          </p>
        </Card>
      </div>

      {/* System Status */}
      <Card className="p-6 mb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <h3 className="font-semibold">All Systems Operational</h3>
              <p className="text-sm text-foreground-muted">
                Last updated: 5 minutes ago
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/status">View Status</Link>
          </Button>
        </div>
      </Card>

      {/* Popular Articles */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Getting Started with GalaxyCo.ai",
              description: "Learn the basics and set up your first agent",
              category: "Getting Started",
              readTime: "5 min read",
            },
            {
              title: "Creating Your First Automation",
              description: "Step-by-step guide to workflow automation",
              category: "Workflows",
              readTime: "8 min read",
            },
            {
              title: "Managing API Keys and Authentication",
              description: "Secure your API access with best practices",
              category: "Security",
              readTime: "6 min read",
            },
            {
              title: "Integrating with Third-Party Services",
              description: "Connect GalaxyCo.ai with your favorite tools",
              category: "Integrations",
              readTime: "10 min read",
            },
          ].map((article, index) => (
            <Card
              key={index}
              className="p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <Badge variant="secondary" size="sm">
                  {article.category}
                </Badge>
                <span className="text-xs text-foreground-muted flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.readTime}
                </span>
              </div>
              <h3 className="font-semibold mb-2">{article.title}</h3>
              <p className="text-sm text-foreground-muted">
                {article.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <Card className="p-8 bg-background-subtle">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-3">Still need help?</h2>
          <p className="text-foreground-muted mb-6">
            Our support team is available 24/7 to assist you with any questions
            or issues
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/help/contact">
                <MessageCircle className="h-5 w-5 mr-2" />
                Contact Support
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/help/faq">View FAQs</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
