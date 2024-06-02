import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

AWS.config.update({
    region: 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export let transcode = (async (req, res) => {

    const s3 = new AWS.S3();
    const videoName = req.body.videoName;

    const readStream = s3.getObject({
        Bucket: 'video-upload-streaming-platform-videos-bucket',
        Key: videoName
    }).createReadStream();

    const writeStream = fs.createWriteStream(`downloads/${videoName}`);
    readStream.pipe(writeStream);

    // Waiting for the download to finish
    await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });

    const formats = [
        {
            // 360p
            resolution: "640x36",
            video_bitrate: "800k",
            audio_bitrate: "64k"
        },
        {
            // 480p
            resolution: "640x480",
            video_bitrate: "1200k",
            audio_bitrate: "128k"
        },
        {
            // 720p
            resolution: "1280x720",
            video_bitrate: "1600k",
            audio_bitrate: "128k"
        }
    ]

    for (let i = 0; i < formats.length; ++i) {

        const format = formats[i];
        console.log(format);
    }

    res.status(200).json({message: "Video successfully transcoded"});
});