/**
 * Marketplace Categories Configuration
 * Enterprise-focused categories for GalaxyCo.ai agent marketplace
 */

export interface MarketplaceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  gradient: string;
  color: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  {
    id: "productivity",
    name: "Productivity & Operations",
    slug: "productivity",
    icon: "⚡",
    description: "Streamline workflows and boost operational efficiency",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
    color: "#3b82f6",
    heroTitle: "Supercharge Your Team's Efficiency",
    heroSubtitle:
      "Automate workflows, manage tasks, and coordinate tools seamlessly",
  },
  {
    id: "analytics",
    name: "Data & Analytics",
    slug: "analytics",
    icon: "📊",
    description: "Transform data into actionable insights",
    gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
    color: "#a855f7",
    heroTitle: "Turn Data Into Instant Decisions",
    heroSubtitle: "KPIs, forecasting, and automated reports at your fingertips",
  },
  {
    id: "sales",
    name: "Customer & Sales Intelligence",
    slug: "sales",
    icon: "🎯",
    description: "Accelerate revenue with intelligent automation",
    gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
    color: "#10b981",
    heroTitle: "Close More Deals, Faster",
    heroSubtitle: "CRM intelligence, lead scoring, and automated outreach",
  },
  {
    id: "knowledge",
    name: "Knowledge & Research",
    slug: "knowledge",
    icon: "🔍",
    description: "Extract insights from complex information",
    gradient: "linear-gradient(135deg, #f97316 0%, #fbbf24 100%)",
    color: "#f97316",
    heroTitle: "Instant Answers From Anywhere",
    heroSubtitle:
      "Intelligent document retrieval, research, and knowledge synthesis",
  },
  {
    id: "hr",
    name: "HR, Compliance & People Ops",
    slug: "hr",
    icon: "👥",
    description: "Manage people operations with precision",
    gradient: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
    color: "#6366f1",
    heroTitle: "Automate People Ops Without Losing the Human Touch",
    heroSubtitle:
      "Recruiting, onboarding, compliance, and performance management",
  },
  {
    id: "engineering",
    name: "AI Engineering & Automation",
    slug: "engineering",
    icon: "🤖",
    description: "Build and deploy AI-powered solutions",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
    color: "#8b5cf6",
    heroTitle: "Empower Teams to Build Safely With AI",
    heroSubtitle:
      "API connectors, automation sandbox, and prompt-to-pipeline tools",
  },
];

/**
 * Get category by slug
 */
export function getCategoryBySlug(
  slug: string,
): MarketplaceCategory | undefined {
  return MARKETPLACE_CATEGORIES.find((cat) => cat.slug === slug);
}

/**
 * Get all category slugs (useful for generating static paths)
 */
export function getAllCategorySlugs(): string[] {
  return MARKETPLACE_CATEGORIES.map((cat) => cat.slug);
}

/**
 * Check if a slug is valid
 */
export function isValidCategorySlug(slug: string): boolean {
  return MARKETPLACE_CATEGORIES.some((cat) => cat.slug === slug);
}

/**
 * Get category by agent category field (for mapping legacy categories)
 */
export function mapAgentCategoryToMarketplace(agentCategory: string): string {
  const mapping: Record<string, string> = {
    communication: "productivity",
    content: "knowledge",
    support: "productivity",
    sales: "sales",
    ops: "productivity",
    knowledge: "knowledge",
    automation: "productivity",
    data: "analytics",
    code: "engineering",
    security: "engineering",
    hr: "hr",
  };

  return mapping[agentCategory.toLowerCase()] || "productivity";
}
