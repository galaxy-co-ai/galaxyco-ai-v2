import { enrichLeadCore } from "./src/trigger/lead-intel-agent";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function testLeadIntelAgent() {
  console.log("🧪 Testing Lead Intel Agent...");

  const testPayload = {
    companyDomain: "stripe.com",
    companyName: "Stripe",
    workspaceId: "test-workspace",
    userId: "test-user",
  };

  try {
    console.log("🚀 Starting enrichment for:", testPayload.companyDomain);
    const result = await enrichLeadCore(testPayload);

    console.log("\n✅ Enrichment Result:");
    console.log("Success:", result.success);
    
    if (result.success && "enrichedLead" in result) {
      const lead = result.enrichedLead;
      console.log("\n📊 Lead Intelligence:");
      console.log("Company:", lead.companyName);
      console.log("Industry:", lead.industry);
      console.log("ICP Fit Score:", lead.icpFitScore);
      console.log("Confidence:", lead.confidenceLevel);
      console.log("Tech Stack:", lead.techStack.join(", "));
      console.log("Pain Points:", lead.painPointsInferred);
      console.log("Outreach Angle:", lead.outreachAngle);
      console.log("Recent News Count:", lead.recentNews.length);
      
      if (result.metadata) {
        console.log("\n⏱️  Performance:");
        console.log("Duration:", result.metadata.duration, "ms");
        console.log("Data Completeness:", result.metadata.dataCompleteness, "%");
      }
    } else if ("error" in result) {
      console.error("❌ Error:", result.error);
    }

  } catch (error) {
    console.error("💥 Test failed:", error);
  }
}

// Run the test
testLeadIntelAgent();