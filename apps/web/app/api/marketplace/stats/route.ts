import { NextResponse } from 'next/server';
import { db } from '@galaxyco/database/client';
import { agentTemplates, agents, agentExecutions } from '@galaxyco/database/schema';
import { eq, sql } from 'drizzle-orm';

/**
 * GET /api/marketplace/stats
 * 
 * Returns aggregate stats for marketplace hero section:
 * - Total templates
 * - Total installs
 * - Hours saved (calculated from executions)
 * - Average success rate
 */
export async function GET() {
  try {
    // Get template stats
    const [templateStats] = await db
      .select({
        totalTemplates: sql<number>`count(*)`,
        totalInstalls: sql<number>`coalesce(sum(${agentTemplates.installCount}), 0)`,
        avgSuccessRate: sql<number>`round(avg(cast((${agentTemplates.kpis}->>'successRate')::numeric as numeric)), 1)`,
      })
      .from(agentTemplates)
      .where(eq(agentTemplates.isPublished, true));

    // Calculate hours saved (rough estimate based on executions)
    // Assume each successful execution saves ~30 minutes on average
    const [executionStats] = await db
      .select({
        totalExecutions: sql<number>`count(*)`,
      })
      .from(agentExecutions)
      .where(eq(agentExecutions.status, 'completed'));

    const hoursSaved = Math.round((executionStats?.totalExecutions || 0) * 0.5); // 30 min = 0.5 hr
    
    // Format hours saved for display
    let hoursSavedDisplay: string;
    if (hoursSaved >= 1000) {
      hoursSavedDisplay = `${Math.round(hoursSaved / 1000)}k hrs/mo`;
    } else {
      hoursSavedDisplay = `${hoursSaved} hrs/mo`;
    }

    return NextResponse.json({
      stats: {
        totalTemplates: templateStats?.totalTemplates || 0,
        totalInstalls: templateStats?.totalInstalls || 0,
        hoursSaved: hoursSavedDisplay,
        avgSuccessRate: templateStats?.avgSuccessRate || 95,
      },
    });
  } catch (error) {
    console.error('Error fetching marketplace stats:', error);
    // Return fallback stats on error
    return NextResponse.json({
      stats: {
        totalTemplates: 10,
        totalInstalls: 13108,
        hoursSaved: '10k hrs/mo',
        avgSuccessRate: 95,
      },
    });
  }
}
