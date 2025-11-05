import { useState } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ScrollArea } from "../components/ui/scroll-area";
import { 
  Megaphone, 
  Target, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Users,
  Eye,
  MousePointer,
  Share2,
  Mail,
  Image as ImageIcon,
  FileText,
  Video,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Plus,
  Play,
  Pause,
  MoreHorizontal
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "draft" | "completed";
  type: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  progress: number;
  kpis: {
    impressions: number;
    clicks: number;
    conversions: number;
    roi: number;
  };
  channels: string[];
  assets: {
    type: "image" | "video" | "copy" | "landing-page";
    name: string;
    status: "ready" | "in-progress" | "review";
  }[];
  description: string;
}

export function Marketing() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const campaigns: Campaign[] = [
    {
      id: "1",
      name: "Q4 Product Launch Campaign",
      status: "active",
      type: "Multi-Channel Launch",
      budget: 50000,
      spent: 32400,
      startDate: "Nov 1, 2025",
      endDate: "Dec 31, 2025",
      progress: 65,
      kpis: {
        impressions: 2450000,
        clicks: 98000,
        conversions: 3200,
        roi: 340
      },
      channels: ["Email", "Social Media", "Paid Ads", "Content Marketing"],
      assets: [
        { type: "image", name: "Hero Banner Set (5 variations)", status: "ready" },
        { type: "video", name: "Product Demo Video", status: "ready" },
        { type: "copy", name: "Email Campaign Copy", status: "ready" },
        { type: "landing-page", name: "Launch Landing Page", status: "ready" },
        { type: "image", name: "Social Media Graphics", status: "in-progress" }
      ],
      description: "Comprehensive multi-channel campaign for our flagship product launch targeting enterprise customers with personalized messaging and retargeting strategies."
    },
    {
      id: "2",
      name: "Holiday Season Email Series",
      status: "active",
      type: "Email Marketing",
      budget: 15000,
      spent: 8200,
      startDate: "Nov 15, 2025",
      endDate: "Dec 25, 2025",
      progress: 55,
      kpis: {
        impressions: 450000,
        clicks: 45000,
        conversions: 2100,
        roi: 285
      },
      channels: ["Email", "Marketing Automation"],
      assets: [
        { type: "copy", name: "Email Sequence (8 emails)", status: "ready" },
        { type: "image", name: "Email Header Graphics", status: "ready" },
        { type: "landing-page", name: "Holiday Offer Page", status: "ready" }
      ],
      description: "Automated email sequence targeting existing customers with personalized holiday offers and product recommendations."
    },
    {
      id: "3",
      name: "Brand Awareness Social Campaign",
      status: "active",
      type: "Social Media",
      budget: 25000,
      spent: 12800,
      startDate: "Nov 1, 2025",
      endDate: "Jan 31, 2026",
      progress: 42,
      kpis: {
        impressions: 5200000,
        clicks: 156000,
        conversions: 890,
        roi: 125
      },
      channels: ["LinkedIn", "Twitter", "Instagram", "Facebook"],
      assets: [
        { type: "image", name: "Social Media Content Calendar", status: "ready" },
        { type: "video", name: "Testimonial Videos (3)", status: "in-progress" },
        { type: "image", name: "Infographics Series", status: "review" },
        { type: "copy", name: "Post Copy Library", status: "ready" }
      ],
      description: "Three-month brand awareness campaign focused on thought leadership and customer success stories across all major social platforms."
    },
    {
      id: "4",
      name: "Content Marketing Hub Launch",
      status: "draft",
      type: "Content Marketing",
      budget: 30000,
      spent: 0,
      startDate: "Dec 1, 2025",
      endDate: "Feb 28, 2026",
      progress: 15,
      kpis: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        roi: 0
      },
      channels: ["Blog", "SEO", "Email", "Social Media"],
      assets: [
        { type: "copy", name: "Blog Post Series (12 posts)", status: "in-progress" },
        { type: "landing-page", name: "Resource Hub Page", status: "in-progress" },
        { type: "copy", name: "Whitepapers (3)", status: "review" },
        { type: "image", name: "Blog Featured Images", status: "in-progress" }
      ],
      description: "Comprehensive content hub featuring educational resources, case studies, and thought leadership content to drive organic traffic and lead generation."
    },
    {
      id: "5",
      name: "Partner Co-Marketing Initiative",
      status: "paused",
      type: "Partnership Marketing",
      budget: 20000,
      spent: 5600,
      startDate: "Oct 15, 2025",
      endDate: "Dec 15, 2025",
      progress: 28,
      kpis: {
        impressions: 680000,
        clicks: 23000,
        conversions: 450,
        roi: 168
      },
      channels: ["Webinar", "Email", "Social Media"],
      assets: [
        { type: "copy", name: "Webinar Script & Slides", status: "ready" },
        { type: "video", name: "Webinar Recording", status: "ready" },
        { type: "copy", name: "Co-branded Email Campaign", status: "ready" }
      ],
      description: "Joint marketing initiative with strategic partners featuring co-branded webinars and content to expand market reach."
    },
    {
      id: "6",
      name: "Retargeting & Conversion Optimization",
      status: "active",
      type: "Paid Advertising",
      budget: 40000,
      spent: 28900,
      startDate: "Oct 1, 2025",
      endDate: "Dec 31, 2025",
      progress: 72,
      kpis: {
        impressions: 1850000,
        clicks: 74000,
        conversions: 4100,
        roi: 420
      },
      channels: ["Google Ads", "Facebook Ads", "LinkedIn Ads"],
      assets: [
        { type: "image", name: "Display Ad Creatives (15 sizes)", status: "ready" },
        { type: "copy", name: "Ad Copy Variations (20)", status: "ready" },
        { type: "landing-page", name: "Conversion Landing Pages (3)", status: "ready" },
        { type: "video", name: "Video Ads (6 variations)", status: "ready" }
      ],
      description: "Advanced retargeting campaign with personalized messaging based on user behavior and funnel stage, optimized for maximum conversion rates."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "paused": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "draft": return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      case "completed": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getAssetStatusIcon = (status: string) => {
    switch (status) {
      case "ready": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in-progress": return <Clock className="h-4 w-4 text-blue-500" />;
      case "review": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "image": return <ImageIcon className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      case "copy": return <FileText className="h-4 w-4" />;
      case "landing-page": return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Megaphone className="h-8 w-8" />
            Marketing Campaigns
          </h1>
          <p className="text-muted-foreground">
            AI-powered marketing campaign management
          </p>
        </div>
        <Button className="rounded-full shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Active Campaigns</p>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <p className="text-3xl mb-1">4</p>
          <p className="text-xs text-green-600">+2 from last month</p>
        </Card>

        <Card className="p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <p className="text-3xl mb-1">$180K</p>
          <p className="text-xs text-muted-foreground">$88K spent (49%)</p>
        </Card>

        <Card className="p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Impressions</p>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/20 flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl mb-1">10.6M</p>
          <p className="text-xs text-green-600">+23% vs last month</p>
        </Card>

        <Card className="p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg. ROI</p>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
          </div>
          <p className="text-3xl mb-1">256%</p>
          <p className="text-xs text-green-600">+18% vs target</p>
        </Card>
      </div>

      {/* AI Suggestion Card */}
      <Card className="p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">AI Campaign Insights</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Based on your recent campaigns, I recommend increasing budget allocation to the Q4 Product Launch Campaign by 15% and creating a retargeting campaign for visitors who engaged with holiday content. Would you like me to create these optimizations?
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="rounded-full">
                Apply Recommendations
              </Button>
              <Button size="sm" variant="outline" className="rounded-full">
                Tell Me More
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Campaign Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className="p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all cursor-pointer group"
            onClick={() => setSelectedCampaign(campaign)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="mb-1 group-hover:text-primary transition-colors">{campaign.name}</h3>
                <p className="text-sm text-muted-foreground">{campaign.type}</p>
              </div>
              <Badge variant="outline" className={`${getStatusColor(campaign.status)} border rounded-full capitalize`}>
                {campaign.status}
              </Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span>{campaign.progress}%</span>
              </div>
              <Progress value={campaign.progress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Budget</p>
                <p className="text-sm">${formatNumber(campaign.budget)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Spent</p>
                <p className="text-sm">${formatNumber(campaign.spent)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Impressions</p>
                <p className="text-sm">{formatNumber(campaign.kpis.impressions)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">ROI</p>
                <p className="text-sm text-green-600">{campaign.kpis.roi}%</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {campaign.channels.slice(0, 3).map((channel, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs rounded-full">
                  {channel}
                </Badge>
              ))}
              {campaign.channels.length > 3 && (
                <Badge variant="secondary" className="text-xs rounded-full">
                  +{campaign.channels.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="flex-1 rounded-full">
                View Details
              </Button>
              <Button size="sm" variant="ghost" className="h-9 w-9 rounded-full p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Campaign Detail Dialog */}
      <Dialog open={!!selectedCampaign} onOpenChange={(open) => !open && setSelectedCampaign(null)}>
        <DialogContent className="!w-[95vw] !max-w-[1800px] h-[90vh] p-0 flex flex-col sm:!max-w-[1800px]">
          {selectedCampaign && (
            <>
              <DialogHeader className="p-6 pb-4 border-b shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <DialogTitle>{selectedCampaign.name}</DialogTitle>
                      <Badge variant="outline" className={`${getStatusColor(selectedCampaign.status)} border rounded-full capitalize`}>
                        {selectedCampaign.status}
                      </Badge>
                    </div>
                    <DialogDescription>
                      {selectedCampaign.description}
                    </DialogDescription>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {selectedCampaign.status === "active" ? (
                      <Button variant="outline" size="sm" className="rounded-full">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Campaign
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="rounded-full">
                        <Play className="h-4 w-4 mr-2" />
                        Resume Campaign
                      </Button>
                    )}
                    <Button size="sm" className="rounded-full">
                      Edit Campaign
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-hidden min-h-0">
                <Tabs defaultValue="overview" className="h-full flex flex-col">
                  <div className="px-6 pt-4 border-b shrink-0">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="assets">Assets</TabsTrigger>
                      <TabsTrigger value="kpis">KPIs & Analytics</TabsTrigger>
                      <TabsTrigger value="channels">Channels</TabsTrigger>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    </TabsList>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="p-6">
                      <TabsContent value="overview" className="mt-0 space-y-6">
                        {/* Campaign Stats */}
                        <div className="grid gap-4 md:grid-cols-4">
                          <Card className="p-4 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Eye className="h-5 w-5 text-blue-500" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Impressions</p>
                                <p className="text-xl">{formatNumber(selectedCampaign.kpis.impressions)}</p>
                              </div>
                            </div>
                            <p className="text-xs text-green-600">+12% vs target</p>
                          </Card>

                          <Card className="p-4 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <MousePointer className="h-5 w-5 text-purple-500" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Clicks</p>
                                <p className="text-xl">{formatNumber(selectedCampaign.kpis.clicks)}</p>
                              </div>
                            </div>
                            <p className="text-xs text-green-600">+8% vs target</p>
                          </Card>

                          <Card className="p-4 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <Target className="h-5 w-5 text-green-500" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Conversions</p>
                                <p className="text-xl">{formatNumber(selectedCampaign.kpis.conversions)}</p>
                              </div>
                            </div>
                            <p className="text-xs text-green-600">+15% vs target</p>
                          </Card>

                          <Card className="p-4 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-orange-500" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">ROI</p>
                                <p className="text-xl">{selectedCampaign.kpis.roi}%</p>
                              </div>
                            </div>
                            <p className="text-xs text-green-600">+22% vs target</p>
                          </Card>
                        </div>

                        {/* Budget & Timeline */}
                        <div className="grid gap-6 lg:grid-cols-2">
                          <Card className="p-6 shadow-sm">
                            <h3 className="mb-4 flex items-center gap-2">
                              <DollarSign className="h-5 w-5" />
                              Budget Overview
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-muted-foreground">Total Budget</span>
                                  <span className="text-sm">${formatNumber(selectedCampaign.budget)}</span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-muted-foreground">Spent</span>
                                  <span className="text-sm">${formatNumber(selectedCampaign.spent)}</span>
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm text-muted-foreground">Remaining</span>
                                  <span className="text-sm">${formatNumber(selectedCampaign.budget - selectedCampaign.spent)}</span>
                                </div>
                                <Progress value={(selectedCampaign.spent / selectedCampaign.budget) * 100} className="h-2" />
                              </div>
                              <div className="pt-4 border-t">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-muted-foreground">Daily Avg Spend</span>
                                  <span className="text-sm">${Math.round(selectedCampaign.spent / 30).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Projected Total</span>
                                  <span className="text-sm">${formatNumber(selectedCampaign.budget * 0.95)}</span>
                                </div>
                              </div>
                            </div>
                          </Card>

                          <Card className="p-6 shadow-sm">
                            <h3 className="mb-4 flex items-center gap-2">
                              <Calendar className="h-5 w-5" />
                              Timeline
                            </h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Start Date</span>
                                <span className="text-sm">{selectedCampaign.startDate}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">End Date</span>
                                <span className="text-sm">{selectedCampaign.endDate}</span>
                              </div>
                              <div className="pt-4 border-t">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm text-muted-foreground">Campaign Progress</span>
                                  <span className="text-sm">{selectedCampaign.progress}%</span>
                                </div>
                                <Progress value={selectedCampaign.progress} className="h-2" />
                                <p className="text-xs text-muted-foreground mt-2">
                                  {100 - selectedCampaign.progress}% remaining
                                </p>
                              </div>
                            </div>
                          </Card>
                        </div>

                        {/* AI Insights */}
                        <Card className="p-6 shadow-sm bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20">
                          <h3 className="mb-4 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-500" />
                            AI-Powered Insights
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm mb-1">Strong Performance on LinkedIn</p>
                                <p className="text-xs text-muted-foreground">
                                  Your LinkedIn ads are performing 34% better than industry average. Consider allocating more budget here.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                              <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm mb-1">Optimize Email Send Times</p>
                                <p className="text-xs text-muted-foreground">
                                  Your audience engages 2.3x more with emails sent on Tuesday mornings. Adjust your schedule for better results.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                              <TrendingUp className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm mb-1">Conversion Rate Trending Up</p>
                                <p className="text-xs text-muted-foreground">
                                  Your conversion rate has increased by 18% week-over-week. The new landing page design is resonating well.
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="assets" className="mt-0">
                        <div className="space-y-4">
                          {selectedCampaign.assets.map((asset, idx) => (
                            <Card key={idx} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center shrink-0">
                                  {getAssetIcon(asset.type)}
                                </div>
                                <div className="flex-1">
                                  <p className="mb-1">{asset.name}</p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs rounded-full capitalize">
                                      {asset.type.replace("-", " ")}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      {getAssetStatusIcon(asset.status)}
                                      <span className="capitalize">{asset.status.replace("-", " ")}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="rounded-full">
                                    Preview
                                  </Button>
                                  <Button size="sm" variant="ghost" className="rounded-full">
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                          <Button variant="outline" className="w-full rounded-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Asset
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="kpis" className="mt-0">
                        <div className="space-y-6">
                          <div className="grid gap-4 md:grid-cols-3">
                            <Card className="p-4 shadow-sm">
                              <p className="text-sm text-muted-foreground mb-1">Click-Through Rate</p>
                              <p className="text-2xl mb-1">
                                {((selectedCampaign.kpis.clicks / selectedCampaign.kpis.impressions) * 100).toFixed(2)}%
                              </p>
                              <p className="text-xs text-green-600">+0.3% vs last week</p>
                            </Card>
                            <Card className="p-4 shadow-sm">
                              <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
                              <p className="text-2xl mb-1">
                                {((selectedCampaign.kpis.conversions / selectedCampaign.kpis.clicks) * 100).toFixed(2)}%
                              </p>
                              <p className="text-xs text-green-600">+0.5% vs last week</p>
                            </Card>
                            <Card className="p-4 shadow-sm">
                              <p className="text-sm text-muted-foreground mb-1">Cost Per Conversion</p>
                              <p className="text-2xl mb-1">
                                ${(selectedCampaign.spent / selectedCampaign.kpis.conversions).toFixed(2)}
                              </p>
                              <p className="text-xs text-green-600">-$2.40 vs last week</p>
                            </Card>
                          </div>

                          <Card className="p-6 shadow-sm">
                            <h3 className="mb-4">Performance Metrics</h3>
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm">Email Open Rate</span>
                                  <span className="text-sm">42%</span>
                                </div>
                                <Progress value={42} className="h-2" />
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm">Social Engagement Rate</span>
                                  <span className="text-sm">8.5%</span>
                                </div>
                                <Progress value={85} className="h-2" />
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm">Landing Page Conversion</span>
                                  <span className="text-sm">12.3%</span>
                                </div>
                                <Progress value={12.3} className="h-2" />
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm">Ad Quality Score</span>
                                  <span className="text-sm">9.2/10</span>
                                </div>
                                <Progress value={92} className="h-2" />
                              </div>
                            </div>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="channels" className="mt-0">
                        <div className="grid gap-4 md:grid-cols-2">
                          {selectedCampaign.channels.map((channel, idx) => (
                            <Card key={idx} className="p-6 shadow-sm">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                                  <Share2 className="h-6 w-6 text-blue-500" />
                                </div>
                                <div>
                                  <h3 className="mb-1">{channel}</h3>
                                  <Badge variant="secondary" className="text-xs rounded-full">
                                    Active
                                  </Badge>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Impressions</span>
                                  <span className="text-sm">{formatNumber(Math.floor(selectedCampaign.kpis.impressions / selectedCampaign.channels.length))}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Clicks</span>
                                  <span className="text-sm">{formatNumber(Math.floor(selectedCampaign.kpis.clicks / selectedCampaign.channels.length))}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Budget Allocation</span>
                                  <span className="text-sm">${formatNumber(selectedCampaign.budget / selectedCampaign.channels.length)}</span>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="timeline" className="mt-0">
                        <Card className="p-6 shadow-sm">
                          <h3 className="mb-6">Campaign Timeline</h3>
                          <div className="space-y-6">
                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                                  <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div className="w-0.5 h-full bg-green-500 mt-2"></div>
                              </div>
                              <div className="flex-1 pb-6">
                                <p className="mb-1">Campaign Launched</p>
                                <p className="text-sm text-muted-foreground mb-2">{selectedCampaign.startDate}</p>
                                <p className="text-sm">All assets deployed and campaigns activated across channels.</p>
                              </div>
                            </div>

                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                                  <BarChart3 className="h-5 w-5" />
                                </div>
                                <div className="w-0.5 h-full bg-blue-500 mt-2"></div>
                              </div>
                              <div className="flex-1 pb-6">
                                <p className="mb-1">First Milestone Reached</p>
                                <p className="text-sm text-muted-foreground mb-2">Nov 15, 2025</p>
                                <p className="text-sm">Hit 1M impressions and 40K clicks ahead of schedule.</p>
                              </div>
                            </div>

                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white shrink-0">
                                  <TrendingUp className="h-5 w-5" />
                                </div>
                                <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                              </div>
                              <div className="flex-1 pb-6">
                                <p className="mb-1">Mid-Campaign Optimization</p>
                                <p className="text-sm text-muted-foreground mb-2">Nov 30, 2025 (Upcoming)</p>
                                <p className="text-sm">Scheduled review and budget reallocation based on performance.</p>
                              </div>
                            </div>

                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white shrink-0">
                                  <Calendar className="h-5 w-5" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="mb-1">Campaign End</p>
                                <p className="text-sm text-muted-foreground mb-2">{selectedCampaign.endDate}</p>
                                <p className="text-sm">Final reporting and analysis of campaign performance.</p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>
                    </div>
                  </ScrollArea>
                </Tabs>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
