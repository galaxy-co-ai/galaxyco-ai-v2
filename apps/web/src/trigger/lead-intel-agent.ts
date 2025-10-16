import { task } from "@trigger.dev/sdk/v3";
import OpenAI from "openai";
import * as cheerio from "cheerio";

/**
 * Lead Intel Agent - Production Implementation
 * Enriches leads with company information, recent news, and AI-generated insights
 */

// Types
interface EnrichLeadPayload {
  leadUrl?: string;
  companyDomain: string;
  companyName?: string;
  contactName?: string;
  workspaceId: string;
  userId: string;
}

interface WebsiteData {
  companyName: string;
  description?: string;
  services: string[];
  techStack: string[];
  teamSize?: string;
  aboutText?: string;
}

interface NewsItem {
  title: string;
  snippet: string;
  link: string;
  source: string;
}

interface EnrichedLead {
  leadId: string;
  companyName: string;
  companyDomain: string;
  companySize?: string;
  industry?: string;
  techStack: string[];
  recentNews: NewsItem[];
  painPointsInferred: string[];
  buyingSignals: string[];
  outreachAngle: string;
  keyInsights: string[];
  icpFitScore: number;
  confidenceLevel: "high" | "medium" | "low";
  dataCompleteness: number;
}

// Lazy-load OpenAI client (only initialize when needed)
let openaiInstance: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OPENAI_API_KEY environment variable is not set. Please configure it in your Trigger.dev environment.",
      );
    }
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiInstance;
}

/**
 * Step 1: Scrape company website for basic information
 */
async function scrapeCompanyWebsite(domain: string): Promise<WebsiteData> {
  try {
    const response = await fetch(`https://${domain}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; GalaxyCo-Bot/1.0; +https://galaxyco.ai)",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract company name
    const companyName =
      $("meta[property='og:site_name']").attr("content") ||
      $("title").text().split("|")[0].trim() ||
      domain;

    // Extract description
    const description =
      $("meta[name='description']").attr("content") ||
      $("meta[property='og:description']").attr("content") ||
      "";

    // Extract services (common patterns)
    const services: string[] = [];
    $(".service, .services li, [class*='service'] h3, .offering").each(
      (_, el) => {
        const text = $(el).text().trim();
        if (text && text.length < 100) {
          services.push(text);
        }
      },
    );

    // Detect tech stack from visible elements and scripts
    const techStack: string[] = [];
    const htmlLower = html.toLowerCase();

    const techSignals = {
      HubSpot: /hubspot/,
      Salesforce: /salesforce/,
      Intercom: /intercom/,
      Stripe: /stripe/,
      Shopify: /shopify/,
      WordPress: /wp-content|wordpress/,
      Webflow: /webflow/,
      "Google Analytics": /google-analytics|gtag/,
    };

    Object.entries(techSignals).forEach(([tech, pattern]) => {
      if (pattern.test(htmlLower)) {
        techStack.push(tech);
      }
    });

    // Extract team size mentions
    const teamSizeMatch = html.match(
      /(\d+)\+?\s*(employees?|team members?|people)/i,
    );
    const teamSize = teamSizeMatch ? teamSizeMatch[0] : undefined;

    // Extract about text
    const aboutText =
      $(".about, #about, [class*='about']").first().text().trim() || "";

    return {
      companyName,
      description,
      services: services.slice(0, 10), // Limit to top 10
      techStack: [...new Set(techStack)], // Deduplicate
      teamSize,
      aboutText: aboutText.substring(0, 500), // Limit length
    };
  } catch (error) {
    console.warn(`Failed to scrape ${domain}:`, error);
    return {
      companyName: domain,
      description: "",
      services: [],
      techStack: [],
      aboutText: "",
    };
  }
}

/**
 * Step 2: Search for recent company news
 */
async function searchCompanyNews(companyName: string): Promise<NewsItem[]> {
  try {
    // Only search if API key is configured
    if (!process.env.GOOGLE_CUSTOM_SEARCH_API_KEY) {
      console.warn("Google Custom Search API key not configured");
      return [];
    }

    const searchQuery = `"${companyName}" (funding OR hiring OR expansion OR launch)`;
    const url = new URL("https://www.googleapis.com/customsearch/v1");
    url.searchParams.set("key", process.env.GOOGLE_CUSTOM_SEARCH_API_KEY);
    url.searchParams.set(
      "cx",
      process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID || "",
    );
    url.searchParams.set("q", searchQuery);
    url.searchParams.set("num", "5");
    url.searchParams.set("dateRestrict", "m6"); // Last 6 months

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Google API returned ${response.status}`);
    }

    const data = await response.json();

    return (
      data.items?.map((item: any) => ({
        title: item.title,
        snippet: item.snippet,
        link: item.link,
        source: new URL(item.link).hostname,
      })) || []
    );
  } catch (error) {
    console.warn("Failed to search news:", error);
    return [];
  }
}

/**
 * Step 3: Generate AI-powered insights and ICP fit score
 */
async function generateInsights(
  websiteData: WebsiteData,
  newsItems: NewsItem[],
  companyDomain: string,
): Promise<{
  painPoints: string[];
  buyingSignals: string[];
  outreachAngle: string;
  keyInsights: string[];
  industry: string;
  icpFitScore: number;
}> {
  try {
    const prompt = `Analyze this B2B company and provide insights for sales outreach.

COMPANY INFORMATION:
- Domain: ${companyDomain}
- Name: ${websiteData.companyName}
- Description: ${websiteData.description || "N/A"}
- Services: ${websiteData.services.join(", ") || "N/A"}
- Tech Stack: ${websiteData.techStack.join(", ") || "N/A"}
- Team Size: ${websiteData.teamSize || "N/A"}
- About: ${websiteData.aboutText || "N/A"}

RECENT NEWS:
${newsItems.map((n) => `- ${n.title}: ${n.snippet}`).join("\n") || "No recent news found"}

TARGET ICP (Ideal Customer Profile):
- B2B Professional Services firms (agencies, consulting, fractional services)
- 10-50 employees
- $1M-$10M revenue
- Uses HubSpot or Pipedrive CRM
- Pain: BD reps waste 15-20 hours/week on manual prospect research

Provide:
1. Inferred pain points based on their business
2. Buying signals (hiring, growth, funding, etc.)
3. A compelling outreach angle
4. Key insights for personalization
5. Industry classification
6. ICP fit score (0-100) based on how well they match our target profile`;

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "lead_insights",
          strict: true,
          schema: {
            type: "object",
            properties: {
              painPoints: {
                type: "array",
                items: { type: "string" },
                description:
                  "List of 2-4 inferred pain points this company likely faces",
              },
              buyingSignals: {
                type: "array",
                items: { type: "string" },
                description:
                  "List of 1-3 signals that indicate they might be ready to buy",
              },
              outreachAngle: {
                type: "string",
                description:
                  "A 1-2 sentence compelling outreach angle for first email",
              },
              keyInsights: {
                type: "array",
                items: { type: "string" },
                description: "List of 2-3 key insights to personalize outreach",
              },
              industry: {
                type: "string",
                description: "Primary industry classification",
              },
              icpFitScore: {
                type: "number",
                description:
                  "Score from 0-100 on how well they fit our ICP (B2B services, 10-50 employees)",
              },
            },
            required: [
              "painPoints",
              "buyingSignals",
              "outreachAngle",
              "keyInsights",
              "industry",
              "icpFitScore",
            ],
            additionalProperties: false,
          },
        },
      },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const insights = JSON.parse(content);
    return insights;
  } catch (error) {
    console.error("Failed to generate insights:", error);
    // Return fallback data
    return {
      painPoints: ["Unable to analyze - enrichment data limited"],
      buyingSignals: [],
      outreachAngle: "Review this lead manually for personalized approach",
      keyInsights: ["Enrichment incomplete - manual review recommended"],
      industry: "Unknown",
      icpFitScore: 50, // Neutral score
    };
  }
}

/**
 * Core enrichment logic (testable function)
 */
export async function enrichLeadCore(payload: EnrichLeadPayload) {
  const startTime = Date.now();
  console.log("🚀 Starting lead enrichment", {
    domain: payload.companyDomain,
    workspace: payload.workspaceId,
  });

  try {
    // Step 1: Scrape website (parallel with news search)
    console.log("📡 Step 1: Scraping company website...");
    const websiteDataPromise = scrapeCompanyWebsite(payload.companyDomain);

    // Step 2: Search news (parallel with website scrape)
    console.log("📰 Step 2: Searching recent news...");
    const newsPromise = searchCompanyNews(
      payload.companyName || payload.companyDomain,
    );

    // Wait for both to complete
    const [websiteData, newsItems] = await Promise.all([
      websiteDataPromise,
      newsPromise,
    ]);

    // Step 3: Generate AI insights
    console.log("🤖 Step 3: Generating AI insights...");
    const insights = await generateInsights(
      websiteData,
      newsItems,
      payload.companyDomain,
    );

    // Calculate data completeness
    let completenessScore = 0;
    if (websiteData.companyName) completenessScore += 20;
    if (websiteData.description) completenessScore += 20;
    if (websiteData.services.length > 0) completenessScore += 15;
    if (websiteData.techStack.length > 0) completenessScore += 15;
    if (newsItems.length > 0) completenessScore += 15;
    if (insights.buyingSignals.length > 0) completenessScore += 15;

    // Determine confidence level
    const confidenceLevel: "high" | "medium" | "low" =
      completenessScore >= 75
        ? "high"
        : completenessScore >= 50
          ? "medium"
          : "low";

    const enrichedLead: EnrichedLead = {
      leadId: `lead_${Date.now()}`, // Temporary ID until DB integration
      companyName: websiteData.companyName,
      companyDomain: payload.companyDomain,
      companySize: websiteData.teamSize,
      industry: insights.industry,
      techStack: websiteData.techStack,
      recentNews: newsItems,
      painPointsInferred: insights.painPoints,
      buyingSignals: insights.buyingSignals,
      outreachAngle: insights.outreachAngle,
      keyInsights: insights.keyInsights,
      icpFitScore: insights.icpFitScore,
      confidenceLevel,
      dataCompleteness: completenessScore,
    };

    const duration = Date.now() - startTime;

    console.log("✅ Enrichment complete", {
      leadId: enrichedLead.leadId,
      icpFitScore: enrichedLead.icpFitScore,
      confidence: enrichedLead.confidenceLevel,
      duration: `${duration}ms`,
    });

    // TODO: Save to database
    // await db.insert(leads).values(enrichedLead);

    return {
      success: true,
      enrichedLead,
      metadata: {
        duration,
        dataCompleteness: completenessScore,
        apiCalls: {
          website: true,
          news: newsItems.length > 0,
          openai: true,
        },
      },
    };
  } catch (error) {
    console.error("❌ Enrichment failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: {
        duration: Date.now() - startTime,
      },
    };
  }
}

/**
 * Trigger.dev task wrapper
 */
export const enrichLead = task({
  id: "enrich-lead",
  maxDuration: 300, // 5 minutes
  run: async (payload: EnrichLeadPayload) => {
    return await enrichLeadCore(payload);
  },
});
