import { Pinecone } from '@pinecone-database/pinecone';

/**
 * Pinecone client singleton
 * Uses PINECONE_API_KEY and PINECONE_ENVIRONMENT environment variables
 */
let pinecone: Pinecone | null = null;

export function getPineconeClient(): Pinecone {
  if (!pinecone) {
    const apiKey = process.env.PINECONE_API_KEY;

    if (!apiKey) {
      throw new Error(
        'Pinecone API key missing. Please set PINECONE_API_KEY environment variable.'
      );
    }

    pinecone = new Pinecone({
      apiKey,
    });
  }

  return pinecone;
}

/**
 * Get Pinecone index
 * Uses PINECONE_INDEX environment variable for index name
 */
export function getPineconeIndex() {
  const client = getPineconeClient();
  const indexName = process.env.PINECONE_INDEX;

  if (!indexName) {
    throw new Error(
      'Pinecone index name missing. Please set PINECONE_INDEX environment variable.'
    );
  }

  return client.index(indexName);
}

export { Pinecone };
