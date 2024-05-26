import express from 'express';
import cors from 'cors';
import watchRouter from './routes/watch.js';

const app = express();
const PORT = 8083;

app.use(express.json());
app.use(cors({
	credentials: true,
    origin: ["http://localhost:3000"]
}));
app.use('/watch', watchRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});