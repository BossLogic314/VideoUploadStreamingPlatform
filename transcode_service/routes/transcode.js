import express from 'express';
import bodyParser from 'body-parser';
import { transcode } from '../controllers/transcode.js';

const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/transcode', jsonParser, transcode);

export default router;