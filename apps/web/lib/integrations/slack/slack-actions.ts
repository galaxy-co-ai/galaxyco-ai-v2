/**
 * Slack Integration Actions
 * Server-side Slack operations using Nango
 */

import { executeIntegrationRequest } from '../nango-server';
import type {
  SlackPostMessageParams,
  SlackPostMessageResult,
  SlackReadChannelsParams,
  SlackReadChannelsResult,
  SlackConversationsListResponse,
  SlackPostMessageResponse,
} from './slack-types';

/**
 * Post a message to a Slack channel
 */
export async function postSlackMessage(
  connectionId: string,
  params: SlackPostMessageParams,
): Promise<{ success: true; data: SlackPostMessageResult } | { success: false; error: string }> {
  try {
    const result = await executeIntegrationRequest<SlackPostMessageResponse>({
      integrationId: 'slack',
      connectionId,
      endpoint: '/api/chat.postMessage',
      method: 'POST',
      data: {
        channel: params.channel,
        text: params.text,
        ...(params.thread_ts && { thread_ts: params.thread_ts }),
        ...(params.username && { username: params.username }),
        ...(params.icon_emoji && { icon_emoji: params.icon_emoji }),
        ...(params.blocks && { blocks: params.blocks }),
      },
    });

    if (!result.success) {
      return result;
    }

    if (!result.data.ok) {
      return {
        success: false,
        error: 'Slack API returned an error',
      };
    }

    return {
      success: true,
      data: {
        messageId: result.data.message.ts,
        timestamp: result.data.ts,
        channel: result.data.channel,
        threadId: params.thread_ts,
      },
    };
  } catch (error) {
    console.error('Failed to post Slack message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to post message',
    };
  }
}

/**
 * Read/list Slack channels
 */
export async function readSlackChannels(
  connectionId: string,
  params: SlackReadChannelsParams = {},
): Promise<{ success: true; data: SlackReadChannelsResult } | { success: false; error: string }> {
  try {
    const { types = 'public_channel,private_channel', limit = 100, cursor } = params;

    const queryParams: Record<string, string> = {
      types,
      limit: limit.toString(),
    };

    if (cursor) {
      queryParams.cursor = cursor;
    }

    const result = await executeIntegrationRequest<SlackConversationsListResponse>({
      integrationId: 'slack',
      connectionId,
      endpoint: '/api/conversations.list',
      method: 'GET',
      params: queryParams,
    });

    if (!result.success) {
      return result;
    }

    if (!result.data.ok) {
      return {
        success: false,
        error: 'Slack API returned an error',
      };
    }

    // Transform Slack API response to our format
    const channels = result.data.channels.map((channel) => ({
      id: channel.id,
      name: channel.name,
      isChannel: channel.is_channel,
      isGroup: channel.is_group,
      isIm: channel.is_im,
      isMember: channel.is_member,
      isPrivate: channel.is_private,
      numMembers: channel.num_members,
    }));

    return {
      success: true,
      data: {
        channels,
        count: channels.length,
        nextCursor: result.data.response_metadata?.next_cursor,
      },
    };
  } catch (error) {
    console.error('Failed to read Slack channels:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to read channels',
    };
  }
}

/**
 * Get channel ID by name (helper function)
 */
export async function getSlackChannelByName(
  connectionId: string,
  channelName: string,
): Promise<{ success: true; channelId: string } | { success: false; error: string }> {
  try {
    // Remove # if present
    const cleanName = channelName.replace(/^#/, '');

    const result = await readSlackChannels(connectionId, {
      types: 'public_channel,private_channel',
    });

    if (!result.success) {
      return result;
    }

    const channel = result.data.channels.find((ch) => ch.name === cleanName);

    if (!channel) {
      return {
        success: false,
        error: `Channel "${channelName}" not found`,
      };
    }

    return {
      success: true,
      channelId: channel.id,
    };
  } catch (error) {
    console.error('Failed to get Slack channel by name:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to find channel',
    };
  }
}

/**
 * Post a message to a Slack channel by name (convenience function)
 */
export async function postSlackMessageByChannelName(
  connectionId: string,
  channelName: string,
  text: string,
  options?: Omit<SlackPostMessageParams, 'channel' | 'text'>,
): Promise<{ success: true; data: SlackPostMessageResult } | { success: false; error: string }> {
  // Get channel ID first
  const channelResult = await getSlackChannelByName(connectionId, channelName);

  if (!channelResult.success) {
    return channelResult;
  }

  // Post message
  return postSlackMessage(connectionId, {
    channel: channelResult.channelId,
    text,
    ...options,
  });
}
