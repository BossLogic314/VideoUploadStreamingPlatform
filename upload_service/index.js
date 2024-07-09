import express from 'express';
import cors from 'cors';
import uploadRouter from "./routes/upload.js"
import dotenv from 'dotenv';
import { connectToOpenSearchService } from './opensearch/connect.js';

dotenv.config();

// Connecting to the open search service
connectToOpenSearchService();

const app = express();
const PORT = 3102;

app.use(express.json());
app.use(cors({
	credentials: true,
    origin: [process.env.NEXT_PUBLIC_FRONTEND_URL]
}));
app.use('/upload', uploadRouter);
app.use('/delete', uploadRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});