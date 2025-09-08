import { Router } from 'express';
import { createShortUrlHandler, getShortUrlStatsHandler } from '../controllers/shorturl.controller';

const router = Router();

router.post('/', createShortUrlHandler);
router.get('/:shortcode', getShortUrlStatsHandler);

export default router;
