import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import { createMultipartUpload, uploadChunk, completeMultipartUpload } from "../controllers/upload.js";

const upload = multer();
const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/createMultipartUpload', jsonParser, createMultipartUpload);
router.post('/uploadChunk', jsonParser, upload.single('chunk'), uploadChunk);
router.post('/completeMultipartUpload', jsonParser, completeMultipartUpload);

export default router;