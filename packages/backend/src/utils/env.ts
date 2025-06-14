import { config } from 'dotenv';

// Load environment variables
config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  PORT: parseInt(process.env.PORT || '3000'),
  DEBUG: process.env.DEBUG === 'true',
} as const;

// Validate required environment variables
if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

export default env;
