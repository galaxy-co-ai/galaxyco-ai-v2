import { Index } from '@upstash/vector';

/**
 * Upstash Vector client singleton
 * Uses UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN environment variables
 */
let vectorClient: Index | null = null;

export function getVectorClient(): Index {
  if (!vectorClient) {
    const url = process.env.UPSTASH_VECTOR_REST_URL;
    const token = process.env.UPSTASH_VECTOR_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        'Upstash Vector configuration missing. Please set UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN environment variables.',
      );
    }

    vectorClient = new Index({
      url,
      token,
    });
  }

  return vectorClient;
}

export { Index };
