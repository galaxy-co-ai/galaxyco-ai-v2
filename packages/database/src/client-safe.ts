import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Create a safe database client that handles build-time issues
function createDatabase() {
  // During build, DATABASE_URL might not be available
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    // Return a mock during build time
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not set during build, using mock database');
      // Return a proxy that throws helpful errors
      return new Proxy({} as any, {
        get(target, prop) {
          if (prop === 'query') {
            return new Proxy({}, {
              get() {
                return {
                  findFirst: async () => null,
                  findMany: async () => [],
                };
              },
            });
          }
          return () => {
            throw new Error('Database operations not available during build');
          };
        },
      });
    }
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

export const db = createDatabase();