/**
 * Email Agent - Example Implementation
 * 
 * Demonstrates the standardized agent interface with:
 * - Proper error handling and logging
 * - AI provider wrapper integration
 * - Input validation
 * - Mock testing support
 * 
 * This agent can compose professional emails based on user input.
 */

import { 
  BaseAgent, 
  AgentTrigger, 
  AgentInput, 
  AgentOutput, 
  AgentExecutionContext, 
  AgentExecutionResult 
} from '../agent-interface';

export class EmailAgent extends BaseAgent {
  public readonly id = 'email-composer-v1';
  public readonly name = 'Professional Email Composer';
  public readonly description = 'Composes professional emails based on key points, tone, and recipient information';
  public readonly version = '1.0.0';

  public readonly triggers: AgentTrigger[] = [
    {
      type: 'manual',
      config: {},
    },
    {
      type: 'webhook',
      config: {
        webhook_path: '/api/agents/email-agent/compose',
      },
    },
  ];

  public readonly inputs: AgentInput[] = [
    {
      name: 'keyPoints',
      type: 'text',
      required: true,
      description: 'Main points or message content to include in the email',
    },
    {
      name: 'tone',
      type: 'text',
      required: false,
      description: 'Tone of the email',
      default: 'professional',
      validation: {
        allowedValues: ['professional', 'casual', 'formal', 'friendly', 'urgent'],
      },
    },
    {
      name: 'recipientInfo',
      type: 'json',
      required: false,
      description: 'Information about the recipient (name, relationship, context)',
      default: {},
    },
    {
      name: 'subject',
      type: 'text',
      required: false,
      description: 'Email subject line (if not provided, will be generated)',
    },
    {
      name: 'includeCall2Action',
      type: 'boolean',
      required: false,
      description: 'Whether to include a call-to-action in the email',
      default: false,
    },
  ];

  public readonly outputs: AgentOutput[] = [
    {
      name: 'subject',
      type: 'text',
      description: 'Generated email subject line',
    },
    {
      name: 'body',
      type: 'text',
      description: 'Complete email body content',
    },
    {
      name: 'tone_analysis',
      type: 'json',
      description: 'Analysis of the tone and style used',
    },
    {
      name: 'word_count',
      type: 'number',
      description: 'Total word count of the email body',
    },
  ];

  public readonly aiProvider = {
    primary: 'openai' as const,
    fallback: 'anthropic' as const,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000,
  };

  /**
   * Main processing logic for email composition
   */
  public async process(
    inputs: Record<string, any>,
    context: AgentExecutionContext
  ): Promise<AgentExecutionResult> {
    const { keyPoints, tone, recipientInfo, subject, includeCall2Action } = inputs;

    try {
      // Build the system prompt based on inputs
      const systemPrompt = this.buildSystemPrompt(tone, recipientInfo, includeCall2Action);
      
      // Build the user prompt
      const userPrompt = this.buildUserPrompt(keyPoints, subject, recipientInfo);

      // Send request to AI provider
      const aiResponse = await this.sendAIRequest(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        context,
        {
          temperature: this.aiProvider.temperature,
          maxTokens: this.aiProvider.maxTokens,
        }
      );

      // Parse the AI response
      const parsedResult = this.parseAIResponse(aiResponse.content);
      
      // Calculate additional metrics
      const wordCount = this.countWords(parsedResult.body);
      const toneAnalysis = this.analyzeTone(parsedResult.body, tone);

      return {
        success: true,
        data: {
          subject: parsedResult.subject,
          body: parsedResult.body,
          tone_analysis: toneAnalysis,
          word_count: wordCount,
        },
        metadata: {
          provider: aiResponse.model.includes('gpt') ? 'openai' : 'anthropic',
          model: aiResponse.model,
          tokensUsed: aiResponse.usage?.totalTokens,
        },
      };

    } catch (error) {
      return {
        success: false,
        data: {},
        error: {
          message: error instanceof Error ? error.message : 'Email composition failed',
          code: 'EMAIL_COMPOSITION_ERROR',
        },
      };
    }
  }

  /**
   * Build system prompt based on tone and context
   */
  private buildSystemPrompt(
    tone: string, 
    recipientInfo: any, 
    includeCall2Action: boolean
  ): string {
    let prompt = `You are a professional email writer. Your task is to compose clear, well-structured emails.

TONE: ${tone}
${recipientInfo?.relationship ? `RELATIONSHIP: ${recipientInfo.relationship}` : ''}
${includeCall2Action ? 'INCLUDE: A clear call-to-action' : ''}

Requirements:
- Write in a ${tone} tone
- Use proper email structure (greeting, body, closing)
- Be concise but comprehensive
- Ensure clarity and readability
${includeCall2Action ? '- End with a specific call-to-action' : ''}

Format your response as JSON:
{
  "subject": "email subject line",
  "body": "complete email body with greeting and closing"
}`;

    return prompt;
  }

  /**
   * Build user prompt with specific content requirements
   */
  private buildUserPrompt(
    keyPoints: string, 
    subject?: string, 
    recipientInfo?: any
  ): string {
    let prompt = `Compose an email with the following details:

KEY POINTS TO INCLUDE:
${keyPoints}

${subject ? `SUGGESTED SUBJECT: ${subject}` : 'Generate an appropriate subject line'}
${recipientInfo?.name ? `RECIPIENT NAME: ${recipientInfo.name}` : ''}
${recipientInfo?.context ? `CONTEXT: ${recipientInfo.context}` : ''}

Please provide the email in the requested JSON format.`;

    return prompt;
  }

  /**
   * Parse AI response into structured format
   */
  private parseAIResponse(content: string): { subject: string; body: string } {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content);
      if (parsed.subject && parsed.body) {
        return parsed;
      }
    } catch (error) {
      // If JSON parsing fails, try to extract subject and body manually
      console.warn('[EMAIL AGENT] Failed to parse JSON, attempting manual extraction');
    }

    // Manual parsing fallback
    const subjectMatch = content.match(/subject[\"':][\s]*[\"']([^\"']+)[\"']/i);
    const bodyMatch = content.match(/body[\"':][\s]*[\"']([^\"']+)[\"']/i);

    return {
      subject: subjectMatch?.[1] || 'Email Subject',
      body: bodyMatch?.[1] || content, // Fallback to full content
    };
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    return text.trim().split(/\\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Analyze tone of the generated email
   */
  private analyzeTone(body: string, requestedTone: string): any {
    const hasUrgentWords = /urgent|asap|immediately|time-sensitive/i.test(body);
    const hasFormalWords = /please find attached|kindly|furthermore|moreover/i.test(body);
    const hasCasualWords = /hey|thanks|cheers|cool|awesome/i.test(body);
    
    return {
      requested_tone: requestedTone,
      detected_features: {
        formal_language: hasFormalWords,
        casual_language: hasCasualWords,
        urgent_language: hasUrgentWords,
      },
      estimated_reading_time: Math.ceil(this.countWords(body) / 200), // 200 words per minute
    };
  }
}

// Auto-register the agent
import { AgentRegistry } from '../agent-interface';
AgentRegistry.register(EmailAgent);