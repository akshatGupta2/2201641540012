import { Request, Response } from 'express';
import { createShortUrl, getShortUrlStats } from '../services/url.service';

export const createShortUrlHandler = (req: Request, res: Response) => {
  try {
    const result = createShortUrl(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const getShortUrlStatsHandler = (req: Request, res: Response) => {
  const { shortcode } = req.params;
  const stats = getShortUrlStats(shortcode);

  if (!stats) {
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  res.json(stats);
};

