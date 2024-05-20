import express from "express";
import bodyParser from "body-parser";
import { uploadVideo } from "../controller/upload.js";

const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/uploadVideo', jsonParser, uploadVideo);

export default router;