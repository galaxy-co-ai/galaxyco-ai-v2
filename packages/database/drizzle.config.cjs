const dotenv = require('dotenv');
const { resolve } = require('path');

// Load environment variables from root
dotenv.config({ path: resolve(__dirname, '../../.env.local') });

module.exports = {
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
};
