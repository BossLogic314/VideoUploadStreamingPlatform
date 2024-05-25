import express from 'express';
import cors from 'cors';
import uploadRouter from "./routes/upload.js";

const app = express();
const PORT = 8082;

app.use(express.json());
app.use(cors({
	credentials: true,
    origin: ["http://localhost:3000"]
}));
app.use('/upload', uploadRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})