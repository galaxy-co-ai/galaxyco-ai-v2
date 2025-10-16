/**
 * Knowledge Search Tool
 *
 * Allows agents to search the knowledge base using semantic search.
 * This enables RAG (Retrieval Augmented Generation) capabilities for agents.
 */

import { createTool } from "../tools";
import type { Tool, ExecutionContext } from "../types";

/**
 * Create knowledge base search tool
 *
 * This tool allows agents to semantically search uploaded documents,
 * URLs, and text in the workspace's knowledge base.
 *
 * @param apiBaseUrl - Base URL for API calls (defaults to /api)
 * @returns Tool definition for knowledge base search
 */
export function createKnowledgeSearchTool(apiBaseUrl: string = "/api"): Tool {
  return createTool(
    "searchKnowledgeBase",
    "Search the workspace's knowledge base for relevant information using semantic search. Returns documents, content snippets, and relevance scores. Use this when you need to find information from uploaded documents, URLs, or text content.",
    {
      query: {
        type: "string",
        description:
          "The search query. Use natural language to describe what information you're looking for.",
      },
      collectionId: {
        type: "string",
        description:
          "Optional: Limit search to a specific collection ID. If not provided, searches across all collections.",
        required: false,
      },
      limit: {
        type: "number",
        description:
          "Optional: Maximum number of results to return (default: 5, max: 20)",
        required: false,
      },
    },
    async (
      args: {
        query: string;
        collectionId?: string;
        limit?: number;
      },
      context?: ExecutionContext,
    ) => {
      // Validate context
      if (!context?.workspaceId) {
        throw new Error(
          "Knowledge search requires workspace context. Ensure workspaceId is provided.",
        );
      }

      // Validate and normalize limit
      const limit = Math.min(Math.max(args.limit || 5, 1), 20);

      // Prepare search request
      const searchPayload = {
        query: args.query,
        collectionId: args.collectionId,
        limit,
      };

      try {
        // Call the semantic search API
        const response = await fetch(
          `${apiBaseUrl}/knowledge/search?workspaceId=${context.workspaceId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(searchPayload),
          },
        );

        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(
            errorData.error || `Search API error: ${response.statusText}`,
          );
        }

        const data = (await response.json()) as {
          results?: any[];
          totalResults?: number;
        };

        // Format results for LLM consumption
        if (!data.results || data.results.length === 0) {
          return {
            success: true,
            message:
              "No relevant information found in the knowledge base for this query.",
            query: args.query,
            resultsCount: 0,
            results: [],
          };
        }

        // Format results with source attribution
        const formattedResults = data.results.map(
          (result: any, index: number) => ({
            rank: index + 1,
            title: result.title,
            contentSnippet: result.content
              ? result.content.substring(0, 500) + "..."
              : "",
            similarity: result.similarity,
            type: result.type,
            collectionId: result.collectionId,
            sourceId: result.id,
            createdAt: result.createdAt,
          }),
        );

        return {
          success: true,
          message: `Found ${formattedResults.length} relevant document(s) in the knowledge base.`,
          query: args.query,
          resultsCount: formattedResults.length,
          results: formattedResults,
          metadata: {
            searchedCollections: args.collectionId
              ? [args.collectionId]
              : "all",
            averageSimilarity:
              formattedResults.reduce(
                (sum: number, r: any) => sum + r.similarity,
                0,
              ) / formattedResults.length,
            timestamp: new Date().toISOString(),
          },
        };
      } catch (error: any) {
        console.error("[Knowledge Search Tool] Error:", error);

        // Return error in a format the LLM can understand
        return {
          success: false,
          error: error.message,
          message: `Failed to search knowledge base: ${error.message}`,
          query: args.query,
          resultsCount: 0,
          results: [],
        };
      }
    },
  );
}

/**
 * Helper function to format search results for citation
 *
 * Generates a formatted citation string from search results
 */
export function formatResultsForCitation(results: any[]): string {
  if (!results || results.length === 0) {
    return "No sources found.";
  }

  return results
    .map((result, index) => {
      return `[${index + 1}] ${result.title} (similarity: ${(result.similarity * 100).toFixed(0)}%)`;
    })
    .join("\n");
}

/**
 * Helper function to extract content from search results
 *
 * Combines all search result content into a single context string
 */
export function extractContentFromResults(results: any[]): string {
  if (!results || results.length === 0) {
    return "";
  }

  return results
    .map((result, index) => {
      return `Document ${index + 1}: ${result.title}\n${result.contentSnippet}`;
    })
    .join("\n\n---\n\n");
}
