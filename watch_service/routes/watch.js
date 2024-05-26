import express from "express";
import bodyParser from "body-parser";
import { getAllVideos } from "../controller/watch.js";

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/getAllVideos', jsonParser, getAllVideos);

export default router;