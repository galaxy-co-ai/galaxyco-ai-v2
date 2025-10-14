"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface EnrichedLead {
  leadId: string;
  companyName: string;
  companyDomain: string;
  companySize?: string;
  industry?: string;
  techStack: string[];
  recentNews: Array<{ title: string; snippet: string; link: string; source: string }>;
  painPointsInferred: string[];
  buyingSignals: string[];
  outreachAngle: string;
  keyInsights: string[];
  icpFitScore: number;
  confidenceLevel: "high" | "medium" | "low";
  dataCompleteness: number;
}

export default function TestEnrichmentPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    data?: EnrichedLead;
    metadata?: { duration: number; dataCompleteness: number };
    error?: string;
  } | null>(null);

  const exampleDomains = [
    "lattice.com",
    "gong.io",
    "superhuman.com",
    "linear.app",
    "stripe.com",
  ];

  const handleEnrich = async () => {
    if (!domain.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/test-lead-enrichment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyDomain: domain.toLowerCase().trim(),
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch",
      });
    } finally {
      setLoading(false);
    }
  };

  const getICPBadgeColor = (score: number) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getConfidenceBadge = (level: string) => {
    const colors = {
      high: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-red-100 text-red-800",
    };
    return colors[level as keyof typeof colors] || colors.medium;
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lead Intel Agent - Test Console</h1>
        <p className="text-muted-foreground">
          Test the lead enrichment pipeline with any company domain
        </p>
      </div>

      {/* Input Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Enter Company Domain</CardTitle>
          <CardDescription>Enter a domain without http:// or paths</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEnrich()}
              disabled={loading}
              className="flex-1"
            />
            <Button onClick={handleEnrich} disabled={loading || !domain.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enriching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Enrich
                </>
              )}
            </Button>
          </div>

          {/* Example domains */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Examples:</span>
            {exampleDomains.map((ex) => (
              <button
                key={ex}
                onClick={() => setDomain(ex)}
                className="text-sm text-blue-600 hover:underline"
                disabled={loading}
              >
                {ex}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <CardTitle>
                  {result.success ? "Enrichment Complete" : "Enrichment Failed"}
                </CardTitle>
              </div>
              {result.metadata && (
                <Badge variant="outline">
                  {(result.metadata.duration / 1000).toFixed(1)}s
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {result.success && result.data ? (
              <div className="space-y-6">
                {/* Company Overview */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Company Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Company Name</label>
                      <p className="font-medium">{result.data.companyName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Industry</label>
                      <p className="font-medium">{result.data.industry || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Company Size</label>
                      <p className="font-medium">{result.data.companySize || "Unknown"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Data Completeness</label>
                      <p className="font-medium">{result.data.dataCompleteness}%</p>
                    </div>
                  </div>
                </div>

                {/* ICP Fit Score */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">ICP Fit Analysis</h3>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-4xl font-bold">{result.data.icpFitScore}</div>
                      <div className="text-sm text-muted-foreground">/ 100</div>
                    </div>
                    <div
                      className={`h-3 flex-1 rounded-full bg-gray-200`}
                    >
                      <div
                        className={`h-full rounded-full ${getICPBadgeColor(result.data.icpFitScore)}`}
                        style={{ width: `${result.data.icpFitScore}%` }}
                      />
                    </div>
                    <Badge className={getConfidenceBadge(result.data.confidenceLevel)}>
                      {result.data.confidenceLevel} confidence
                    </Badge>
                  </div>
                </div>

                {/* Tech Stack */}
                {result.data.techStack.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tech Stack Detected</h3>
                    <div className="flex gap-2 flex-wrap">
                      {result.data.techStack.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pain Points */}
                {result.data.painPointsInferred.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Inferred Pain Points</h3>
                    <ul className="space-y-2">
                      {result.data.painPointsInferred.map((pain, i) => (
                        <li key={i} className="flex gap-2">
                          <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span>{pain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Buying Signals */}
                {result.data.buyingSignals.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Buying Signals</h3>
                    <div className="flex gap-2 flex-wrap">
                      {result.data.buyingSignals.map((signal, i) => (
                        <Badge key={i} className="bg-blue-100 text-blue-800">
                          {signal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outreach Angle */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recommended Outreach Angle</h3>
                  <p className="p-4 bg-muted rounded-lg">{result.data.outreachAngle}</p>
                </div>

                {/* Recent News */}
                {result.data.recentNews.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Recent News ({result.data.recentNews.length})
                    </h3>
                    <div className="space-y-3">
                      {result.data.recentNews.map((news, i) => (
                        <a
                          key={i}
                          href={news.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 bg-muted rounded-lg hover:bg-muted/80 transition"
                        >
                          <div className="font-medium mb-1">{news.title}</div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {news.snippet}
                          </div>
                          <div className="text-xs text-blue-600">{news.source}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-red-600">
                <p className="font-medium">Error:</p>
                <p>{result.error || "Unknown error occurred"}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
