/**
 * Gmail Integration - Main Export
 */

export * from './types';
export * from './oauth';
export * from './api';

// Re-export main functions for convenience
export { sendGmailMessage, receiveGmailMessages, searchGmailMessages } from './api';
export { getGmailAuthUrl, exchangeCodeForTokens, refreshAccessToken } from './oauth';
