import express from "express";
import bodyParser from "body-parser";
import { getVideos } from "../controller/watch.js";

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/getVideos', jsonParser, getVideos);

export default router;