/**
 * Server Actions for Support Tickets
 *
 * Manages support ticket creation and tracking
 * Note: Uses a simple table structure - can be enhanced with proper ticketing system
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { users } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const CreateSupportTicketSchema = z.object({
  workspaceId: z.string().uuid(),
  subject: z.string().min(1).max(255),
  message: z.string().min(1).max(5000),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z.enum(['bug', 'feature', 'question', 'other']).optional(),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        size: z.number(),
      }),
    )
    .optional(),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getCurrentUser() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return null;
  }
  return clerkUserId;
}

function formatError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.errors[0]?.message || 'Invalid input';
  }

  if (error instanceof Error) {
    console.error('[Support Action Error]', error);
  }

  return 'An unexpected error occurred. Please try again.';
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Create a support ticket
 *
 * NOTE: This is a stub implementation. In production, integrate with:
 * - Intercom
 * - Zendesk
 * - Help Scout
 * - Linear (for internal tracking)
 * - Or custom support system
 */
export async function createSupportTicket(data: z.infer<typeof CreateSupportTicketSchema>) {
  try {
    const validated = CreateSupportTicketSchema.parse(data);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to create support tickets' };
    }

    // Get user info
    const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // TODO: Integrate with ticketing system (Intercom, Zendesk, etc.)
    // For now, log to console and return success
    console.log('[Support Ticket Created]', {
      workspaceId: validated.workspaceId,
      userId: user.id,
      userEmail: user.email,
      subject: validated.subject,
      message: validated.message,
      priority: validated.priority || 'medium',
      category: validated.category || 'question',
      attachments: validated.attachments || [],
      createdAt: new Date().toISOString(),
    });

    // Generate ticket ID
    const ticketId = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return {
      success: true,
      ticket: {
        id: ticketId,
        subject: validated.subject,
        status: 'open',
        priority: validated.priority || 'medium',
        category: validated.category || 'question',
        createdAt: new Date(),
      },
      message: 'Support ticket created successfully. Our team will respond within 24 hours.',
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Get support tickets for a user
 *
 * NOTE: Stub implementation - returns empty array
 * TODO: Integrate with ticketing system
 */
export async function getSupportTickets(workspaceId: string) {
  try {
    z.string().uuid().parse(workspaceId);

    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to view support tickets' };
    }

    // TODO: Fetch from ticketing system
    // For now, return empty array
    return {
      success: true,
      tickets: [],
      message: 'Support ticket integration pending. Tickets will appear here once configured.',
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}
