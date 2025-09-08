import { Request, Response } from 'express';

export const createShortUrl = (req: Request, res: Response) => {

const { url, validity = 30, shortcode } = req.body;

  // TODO: Generate short URL, store metadata, log event
  res.status(201).json({ shortLink: `http://localhost:3000/${shortcode}`, expiry: new Date(Date.now() + validity * 60000).toISOString() });
};

export const getShortUrlStats = (req: Request, res: Response) => {
  const { shortcode } = req.params;

  res.json({
    originalUrl: 'https://example.com',
    createdAt: new Date().toISOString(),
    expiry: new Date(Date.now() + 1800000).toISOString(),
    clicks: 42,
    clickDetails: [
      { timestamp: new Date().toISOString(), referrer: 'google.com', location: 'India' }
    ]
  });
};
