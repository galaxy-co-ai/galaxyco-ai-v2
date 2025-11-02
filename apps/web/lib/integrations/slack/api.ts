/**
 * Slack API Service
 * Core Slack API functionality (send messages, read channels, etc.)
 */

import {
  SlackCredentials,
  SlackSendMessageRequest,
  SlackReadMessagesRequest,
  SlackMessage,
  SlackChannel,
} from './types';

const SLACK_API_BASE = 'https://slack.com/api';

/**
 * Make Slack API request
 */
async function slackApiRequest(
  endpoint: string,
  credentials: SlackCredentials,
  method: 'GET' | 'POST' = 'POST',
  body?: Record<string, any>,
) {
  const url = `${SLACK_API_BASE}/${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${credentials.accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  if (body && method === 'POST') {
    options.body = JSON.stringify(body);
  } else if (body && method === 'GET') {
    const params = new URLSearchParams(body as Record<string, string>);
    return fetch(`${url}?${params.toString()}`, options);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Slack API request failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Slack API error: ${data.error || 'Unknown error'}`);
  }

  return data;
}

/**
 * Send a message to a Slack channel
 */
export async function sendSlackMessage(
  credentials: SlackCredentials,
  message: SlackSendMessageRequest,
): Promise<{ ts: string; channel: string }> {
  const data = await slackApiRequest('chat.postMessage', credentials, 'POST', {
    channel: message.channel,
    text: message.text,
    ...(message.threadTs && { thread_ts: message.threadTs }),
    ...(message.blocks && { blocks: message.blocks }),
    ...(message.attachments && { attachments: message.attachments }),
  });

  return {
    ts: data.ts,
    channel: data.channel,
  };
}

/**
 * Read messages from a Slack channel
 */
export async function readSlackMessages(
  credentials: SlackCredentials,
  request: SlackReadMessagesRequest,
): Promise<SlackMessage[]> {
  const data = await slackApiRequest('conversations.history', credentials, 'GET', {
    channel: request.channel,
    limit: request.limit.toString(),
    ...(request.oldest && { oldest: request.oldest }),
    ...(request.latest && { latest: request.latest }),
  });

  return data.messages || [];
}

/**
 * List all channels in the workspace
 */
export async function listSlackChannels(
  credentials: SlackCredentials,
  excludeArchived = true,
): Promise<SlackChannel[]> {
  const data = await slackApiRequest('conversations.list', credentials, 'GET', {
    exclude_archived: excludeArchived.toString(),
    types: 'public_channel,private_channel',
  });

  return data.channels || [];
}

/**
 * Create a new Slack channel
 */
export async function createSlackChannel(
  credentials: SlackCredentials,
  name: string,
  isPrivate = false,
): Promise<SlackChannel> {
  const data = await slackApiRequest('conversations.create', credentials, 'POST', {
    name: name.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
    is_private: isPrivate,
  });

  return data.channel;
}

/**
 * Get channel by name
 */
export async function getSlackChannelByName(
  credentials: SlackCredentials,
  channelName: string,
): Promise<SlackChannel | null> {
  const channels = await listSlackChannels(credentials);
  const normalizedName = channelName.replace(/^#/, '');

  return channels.find((ch) => ch.name === normalizedName) || null;
}

/**
 * Send a message to a channel by name (handles # prefix)
 */
export async function sendSlackMessageToChannelByName(
  credentials: SlackCredentials,
  channelName: string,
  text: string,
): Promise<{ ts: string; channel: string }> {
  // Try to get channel ID from name
  const channel = await getSlackChannelByName(credentials, channelName);

  if (!channel) {
    throw new Error(`Channel not found: ${channelName}`);
  }

  return sendSlackMessage(credentials, {
    channel: channel.id,
    text,
  });
}
