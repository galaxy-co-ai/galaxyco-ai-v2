/**
 * Slack Integration Types
 * Type-safe definitions for Slack API interactions
 */

export interface SlackPostMessageParams {
  channel: string;
  text: string;
  thread_ts?: string;
  username?: string;
  icon_emoji?: string;
  blocks?: any[];
}

export interface SlackPostMessageResult {
  messageId: string;
  timestamp: string;
  channel: string;
  threadId?: string;
}

export interface SlackReadChannelsParams {
  types?: string; // 'public_channel,private_channel,im,mpim'
  limit?: number;
  cursor?: string;
}

export interface SlackChannel {
  id: string;
  name: string;
  isChannel: boolean;
  isGroup: boolean;
  isIm: boolean;
  isMember: boolean;
  isPrivate: boolean;
  numMembers?: number;
}

export interface SlackReadChannelsResult {
  channels: SlackChannel[];
  count: number;
  nextCursor?: string;
}

// Slack API Response Types
export interface SlackConversationsListResponse {
  ok: boolean;
  channels: Array<{
    id: string;
    name: string;
    is_channel: boolean;
    is_group: boolean;
    is_im: boolean;
    is_member: boolean;
    is_private: boolean;
    num_members?: number;
  }>;
  response_metadata?: {
    next_cursor: string;
  };
}

export interface SlackPostMessageResponse {
  ok: boolean;
  channel: string;
  ts: string;
  message: {
    text: string;
    username: string;
    bot_id: string;
    type: string;
    ts: string;
  };
}
