import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

export let uploadVideo = ((req, res) => {
    const filePath = 'C:/Users/admin/Downloads/beach.mp4';
    const exists = fs.existsSync(filePath);
    console.log(exists);

    res.json({message: "Po!"});
});