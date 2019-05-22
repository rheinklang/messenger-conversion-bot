import { config } from 'dotenv';

// load .env configuration
config();

export const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

export const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

export const PRODUCTION = process.env.NODE_ENV === 'production';