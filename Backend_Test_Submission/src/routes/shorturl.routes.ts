import { Router } from 'express';
import { createShortUrl, getShortUrlStats } from '../controllers/shorturl.controller';

const router = Router();

router.post('/', createShortUrl);
router.get('/:shortcode', getShortUrlStats);

export default router;
