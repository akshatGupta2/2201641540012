import express from "express";
import { requestLogger } from './middleware/logger';
import shortUrlRoutes from './routes/shortUrl.routes';

const app = express()
app.use(requestLogger);
app.use(express.json())
app.use('/shorturls', shortUrlRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))