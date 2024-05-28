import express from 'express';
import cors from 'cors';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import transcodeRouter from './routes/transcode.js';

const app = express();
const PORT = 8084;

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
}));

app.use('/transcode', transcodeRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});