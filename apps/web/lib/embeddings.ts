import OpenAI from "openai";

/**
 * Embeddings Helper
 * Generate vector embeddings for text content using OpenAI
 */

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_DIMENSIONS = 1536; // Dimensions for text-embedding-3-small

/**
 * Generate embeddings for a single text string
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error("Text content is required for embedding generation");
  }

  try {
    // Truncate text if too long (8191 tokens max for text-embedding-3-small)
    // Rough estimate: 1 token ≈ 4 characters
    const maxChars = 8191 * 4;
    const truncatedText =
      text.length > maxChars ? text.substring(0, maxChars) : text;

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: truncatedText,
      encoding_format: "float",
    });

    return response.data[0].embedding;
  } catch (error: any) {
    console.error("Error generating embedding:", error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

/**
 * Generate embeddings for multiple texts (batch processing)
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (!texts || texts.length === 0) {
    throw new Error(
      "At least one text is required for batch embedding generation",
    );
  }

  try {
    // Truncate texts if needed
    const maxChars = 8191 * 4;
    const truncatedTexts = texts.map((text) =>
      text.length > maxChars ? text.substring(0, maxChars) : text,
    );

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: truncatedTexts,
      encoding_format: "float",
    });

    return response.data.map((item) => item.embedding);
  } catch (error: any) {
    console.error("Error generating embeddings:", error);
    throw new Error(`Failed to generate embeddings: ${error.message}`);
  }
}

/**
 * Calculate cosine similarity between two vectors
 * Returns a value between -1 and 1, where 1 means identical
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Find most similar items from a list based on embeddings
 */
export function findMostSimilar(
  queryEmbedding: number[],
  itemEmbeddings: Array<{
    id: string;
    embedding: number[];
    [key: string]: any;
  }>,
  topK: number = 10,
): Array<{ id: string; similarity: number; [key: string]: any }> {
  // Calculate similarities
  const withSimilarity = itemEmbeddings.map((item) => ({
    ...item,
    similarity: cosineSimilarity(queryEmbedding, item.embedding),
  }));

  // Sort by similarity (descending) and take top K
  return withSimilarity
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
    .map(({ embedding, ...rest }) => rest); // Remove embedding from result
}

/**
 * Prepare text for embedding generation
 * Combines title and content with proper formatting
 */
export function prepareTextForEmbedding(
  title: string,
  content?: string | null,
): string {
  const parts: string[] = [];

  if (title) {
    parts.push(`Title: ${title}`);
  }

  if (content && content.trim().length > 0) {
    parts.push(`Content: ${content}`);
  }

  return parts.join("\n\n");
}
