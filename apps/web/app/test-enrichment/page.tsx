"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, Clock, ExternalLink, Loader2, Target, TrendingUp } from "lucide-react";

interface EnrichmentResult {
  success: boolean;
  enrichedLead?: {
    leadId: string;
    companyName: string;
    companyDomain: string;
    companySize?: string;
    industry?: string;
    techStack: string[];
    recentNews: Array<{
      title: string;
      snippet: string;
      link: string;
      source: string;
    }>;
    painPointsInferred: string[];
    buyingSignals: string[];
    outreachAngle: string;
    keyInsights: string[];
    icpFitScore: number;
    confidenceLevel: "high" | "medium" | "low";
    dataCompleteness: number;
  };
  metadata?: {
    duration: number;
    dataCompleteness: number;
    apiCalls: {
      website: boolean;
      news: boolean;
      openai: boolean;
    };
  };
  error?: string;
}

interface TaskStatus {
  success: boolean;
  task?: {
    id: string;
    status: string;
    isCompleted: boolean;
    isSuccessful: boolean;
    output?: EnrichmentResult;
    createdAt: string;
    updatedAt: string;
    finishedAt?: string;
  };
}

export default function TestEnrichmentPage() {
  const [companyDomain, setCompanyDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [result, setResult] = useState<EnrichmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobProgress, setJobProgress] = useState<string>("idle");

  const suggestedDomains = [
    "hubspot.com",
    "salesforce.com", 
    "atlassian.com",
    "slack.com",
    "notion.so",
    "airtable.com"
  ];

  const pollTaskStatus = async (taskId: string) => {
    const maxPolls = 60; // 5 minutes max (5 second intervals)
    let polls = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/test-lead-enrichment?taskId=${taskId}`);
        const data: TaskStatus = await response.json();

        if (!data.success) {
          throw new Error(typeof data.task === 'string' ? data.task : "Failed to fetch task status");
        }

        const task = data.task!;
        setJobProgress(`Status: ${task.status}`);

        if (task.isCompleted) {
          if (task.isSuccessful && task.output) {
            setResult(task.output);
            setJobProgress("completed");
          } else {
            throw new Error("Job completed but was not successful");
          }
          return;
        }

        polls++;
        if (polls < maxPolls) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else {
          throw new Error("Enrichment timed out after 5 minutes");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to check job status");
        setIsLoading(false);
        setJobProgress("failed");
      }
    };

    poll();
  };

  const handleEnrich = async () => {
    if (!companyDomain.trim()) return;

    setIsLoading(true);
    setResult(null);
    setError(null);
    setTaskId(null);
    setJobProgress("starting");

    try {
      const response = await fetch("/api/test-lead-enrichment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyDomain: companyDomain.trim(),
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to start enrichment");
      }

      setTaskId(data.taskId);
      setJobProgress(`Job started (ID: ${data.taskId})`);
      
      // Start polling for results
      pollTaskStatus(data.taskId);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
      setJobProgress("failed");
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600"; 
    return "text-red-600";
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lead Intel Agent - Test Interface</h1>
        <p className="text-muted-foreground">
          Test the Lead Intel Agent with real companies. Enter a domain to see AI-powered lead enrichment in action.
        </p>
      </div>

      {/* Input Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Lead Enrichment</CardTitle>
          <CardDescription>
            Enter a company domain to analyze and enrich with AI-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="e.g. hubspot.com"
              value={companyDomain}
              onChange={(e) => setCompanyDomain(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleEnrich()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleEnrich} 
              disabled={isLoading || !companyDomain.trim()}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enriching...
                </>
              ) : (
                "Enrich Lead"
              )}
            </Button>
          </div>

          {/* Suggested Domains */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Try these:</span>
            {suggestedDomains.map((domain) => (
              <button
                key={domain}
                onClick={() => setCompanyDomain(domain)}
                disabled={isLoading}
                className="text-xs px-2 py-1 bg-secondary hover:bg-secondary/80 rounded-md transition-colors disabled:opacity-50"
              >
                {domain}
              </button>
            ))}
          </div>

          {/* Progress Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {jobProgress}
              <span className="text-xs">(typically takes 10-30 seconds)</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Enrichment Failed</h3>
                <p className="text-red-700 text-sm">{error}</p>
                {taskId && (
                  <p className="text-red-600 text-xs mt-1">Task ID: {taskId}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {result && result.success && result.enrichedLead && (
        <div className="space-y-6">
          {/* Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{result.enrichedLead.companyName}</h2>
                  <p className="text-muted-foreground">{result.enrichedLead.companyDomain}</p>
                </div>
                <div className="text-right">
                  <Badge className={getConfidenceColor(result.enrichedLead.confidenceLevel)}>
                    {result.enrichedLead.confidenceLevel} confidence
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Industry:</span>
                  <p className="font-medium">{result.enrichedLead.industry || "Unknown"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Company Size:</span>
                  <p className="font-medium">{result.enrichedLead.companySize || "Unknown"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Data Completeness:</span>
                  <p className="font-medium">{result.enrichedLead.dataCompleteness}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ICP Fit Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                ICP Fit Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className={`text-3xl font-bold ${getScoreColor(result.enrichedLead.icpFitScore)}`}>
                  {result.enrichedLead.icpFitScore}/100
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        result.enrichedLead.icpFitScore >= 80 ? "bg-green-500" :
                        result.enrichedLead.icpFitScore >= 60 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${result.enrichedLead.icpFitScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outreach Angle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recommended Outreach Angle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{result.enrichedLead.outreachAngle}</p>
            </CardContent>
          </Card>

          {/* Insights & Pain Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.enrichedLead.keyInsights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inferred Pain Points</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.enrichedLead.painPointsInferred.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Buying Signals & Tech Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Buying Signals</CardTitle>
              </CardHeader>
              <CardContent>
                {result.enrichedLead.buyingSignals.length > 0 ? (
                  <ul className="space-y-2">
                    {result.enrichedLead.buyingSignals.map((signal, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{signal}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">No buying signals detected</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                {result.enrichedLead.techStack.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.enrichedLead.techStack.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No tech stack detected</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent News */}
          {result.enrichedLead.recentNews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent News</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.enrichedLead.recentNews.map((news, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4">
                      <h4 className="font-medium text-sm mb-1">{news.title}</h4>
                      <p className="text-muted-foreground text-sm mb-2">{news.snippet}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{news.source}</span>
                        <a 
                          href={news.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-blue-600"
                        >
                          View article <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          {result.metadata && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Enrichment Metadata</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="block font-medium">Duration:</span>
                    <span>{result.metadata.duration}ms</span>
                  </div>
                  <div>
                    <span className="block font-medium">Website Scraped:</span>
                    <span>{result.metadata.apiCalls.website ? "✅" : "❌"}</span>
                  </div>
                  <div>
                    <span className="block font-medium">News Search:</span>
                    <span>{result.metadata.apiCalls.news ? "✅" : "❌"}</span>
                  </div>
                  <div>
                    <span className="block font-medium">AI Analysis:</span>
                    <span>{result.metadata.apiCalls.openai ? "✅" : "❌"}</span>
                  </div>
                </div>
                {taskId && (
                  <div className="mt-4 pt-4 border-t">
                    <span className="block font-medium">Task ID:</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{taskId}</code>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}