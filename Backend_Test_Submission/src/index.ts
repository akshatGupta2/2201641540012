import express from "express";
import shortUrlRoutes from "./routes/shortUrlRoutes"
import { requestLogger } from './middleware/logger';


const app = express()
app.use(requestLogger);
app.use(express.json())
app.use('/api/shorturl', shortUrlRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))