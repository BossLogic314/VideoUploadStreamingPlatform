import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import watchRouter from './routes/watch.js';
import { connectToOpenSearchService } from './opensearch/connect.js';

const app = express();
const PORT = 8083;

dotenv.config();

// Connecting to the open search service
connectToOpenSearchService();

app.use(express.json());
app.use(cors({
	credentials: true,
    origin: ["http://localhost:3000"]
}));
app.use('/watch', watchRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});