import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { workspaces, users, workspaceMembers } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';

// Lazy-load OpenAI client to avoid build-time errors
function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, currentStep, setupData } = await request.json();

    // Simple rule-based responses (can be enhanced with LLM later)
    let response = '';
    let updates: Record<string, any> = {};
    let shouldProgress = false;

    switch (currentStep) {
      case 'welcome':
        // Check if this is role or industry response
        if (!setupData.role) {
          // First response: role
          updates.role = message;
          response = `Perfect! A **${message}** role is great for leveraging AI automation.

**What industry are you in?** (e.g., Technology, Healthcare, Finance, E-commerce, Consulting, etc.)`;
        } else {
          // Second response: industry
          updates.industry = message;
          response = `Excellent! **${message}** is a great industry for AI automation.`;
          shouldProgress = true;
        }
        break;

      case 'workspace':
        // Extract workspace name and create real workspace
        const workspaceName = message.trim();
        const workspaceSlug =
          workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
          '-' +
          Math.random().toString(36).substring(2, 8);

        try {
          // Get or create user record
          let user = await db.query.users.findFirst({
            where: eq(users.clerkUserId, userId),
          });

          if (!user) {
            // Create user if doesn't exist (shouldn't happen but safety check)
            const clerkUser = await auth();
            [user] = await db
              .insert(users)
              .values({
                clerkUserId: userId,
                email: (clerkUser as any).sessionClaims?.email || `user-${userId}@temp.com`,
                firstName: (clerkUser as any).sessionClaims?.firstName,
                lastName: (clerkUser as any).sessionClaims?.lastName,
                lastLoginAt: new Date(),
              })
              .returning();
          }

          // Create workspace
          const [workspace] = await db
            .insert(workspaces)
            .values({
              name: workspaceName,
              slug: workspaceSlug,
              clerkOrganizationId: (await auth()).orgId || undefined,
              subscriptionTier: 'free',
              settings: {
                features: { max_agents: 10 },
              },
            })
            .returning();

          // Link user to workspace as owner
          await db.insert(workspaceMembers).values({
            workspaceId: workspace.id,
            userId: user.id,
            role: 'owner',
            permissions: {
              agents: {
                create: true,
                edit: true,
                delete: true,
                execute: true,
              },
              packs: { install: true, uninstall: true },
              billing: { view: true, manage: true },
              members: { invite: true, remove: true, changeRole: true },
            },
          });

          updates.workspaceName = workspaceName;
          updates.workspaceId = workspace.id;
          updates.workspaceSlug = workspaceSlug;

          // Generate personalized recommendations using GPT-4o-mini
          try {
            const openai = getOpenAIClient();
            const completion = await openai.chat.completions.create({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content:
                    'You are an AI assistant helping users configure their workspace. Based on their role and industry, suggest 2-3 specific ways AI agents can help them. Be concise and practical.',
                },
                {
                  role: 'user',
                  content: `Role: ${setupData.role || 'unknown'}, Industry: ${setupData.industry || 'unknown'}. Suggest specific agent use cases.`,
                },
              ],
              max_tokens: 200,
              temperature: 0.7,
            });

            const recommendations =
              completion.choices[0]?.message?.content ||
              'automate workflows and improve efficiency';

            response = `✅ Workspace **"${workspaceName}"** created successfully!

**Here's how AI agents can help you:**
${recommendations}

Let me configure these agents for you now...`;
          } catch (llmError) {
            console.error('LLM recommendation error:', llmError);
            response = `✅ Workspace **"${workspaceName}"** created successfully!

Now let me configure some AI agents based on your ${setupData.role || ''} role...`;
          }

          shouldProgress = true;
        } catch (error) {
          console.error('Error creating workspace:', error);
          response = `I had trouble creating your workspace. Please try again or contact support.`;
          shouldProgress = false;
        }
        break;

      case 'integrations':
        // Parse tools from message
        const lowerMessage = message.toLowerCase();
        updates.tools = [];

        if (lowerMessage.includes('skip')) {
          response = 'No problem! You can connect integrations later.';
          shouldProgress = true;
        } else {
          if (lowerMessage.includes('gmail') || lowerMessage.includes('email')) {
            updates.tools.push('gmail');
          }
          if (lowerMessage.includes('slack')) {
            updates.tools.push('slack');
          }
          if (lowerMessage.includes('hubspot') || lowerMessage.includes('salesforce')) {
            updates.tools.push('crm');
          }
          if (lowerMessage.includes('drive') || lowerMessage.includes('notion')) {
            updates.tools.push('docs');
          }

          response = `Excellent! I've noted your tools: ${updates.tools.join(', ') || 'none yet'}

You'll be able to connect these later in Settings.`;
          shouldProgress = true;
        }
        break;

      case 'preferences':
        // Parse sensitivity preference
        const sensitive = message.toLowerCase().includes('yes');
        updates.sensitiveData = sensitive;
        response = sensitive
          ? "✓ Enhanced security mode enabled. I'll configure stricter logging and data handling."
          : '✓ Standard security configured.';
        shouldProgress = true;
        break;

      default:
        response = "I'm not sure how to handle that. Please try again.";
    }

    return NextResponse.json({
      response,
      updates,
      shouldProgress,
    });
  } catch (error) {
    console.error('Error processing onboarding message:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
