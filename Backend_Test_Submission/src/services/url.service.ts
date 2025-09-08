import crypto from 'crypto';

interface ShortUrlInput {
  url: string;
  validity?: number;       // in minutes
  shortcode?: string;      // optional custom code
}

interface ShortUrlOutput {
  shortLink: string;
  expiry: string;
  originalUrl: string;
  shortcode: string;
  createdAt: string;
}

const BASE_URL = 'http://localhost:3000'; // Replace with actual hostname

// In-memory store (replace with DB later)
const urlStore = new Map<string, ShortUrlOutput>();

export function createShortUrl(input: ShortUrlInput): ShortUrlOutput {
  const { url, validity = 30, shortcode } = input;

  // Validate URL
  if (!url || !/^https?:\/\/.+/.test(url)) {
    throw new Error('Invalid URL');
  }

  // Generate shortcode if not provided
  const code = shortcode || crypto.randomBytes(3).toString('hex'); // 6-char hex

  // Ensure uniqueness
  if (urlStore.has(code)) {
    throw new Error('Shortcode already exists');
  }

  const now = new Date();
  const expiry = new Date(now.getTime() + validity * 60000).toISOString();

  const shortLink = `${BASE_URL}/${code}`;

  const record: ShortUrlOutput = {
    shortLink,
    expiry,
    originalUrl: url,
    shortcode: code,
    createdAt: now.toISOString(),
  };

  urlStore.set(code, record);

  return record;
}

export function getShortUrlStats(code: string): ShortUrlOutput | undefined {
  return urlStore.get(code);
}
