import AWS from 'aws-sdk';
import dotenv from "dotenv";
import { openSearchClient } from '../opensearch/connect.js';

dotenv.config();

AWS.config.update({
    region: 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export let createMultipartUpload = (async (req, res) => {

    const filename = req.body.filename;

    const s3 = new AWS.S3();

    const createMultipartUploadParams = {
        Bucket: 'video-upload-streaming-platform-videos-bucket',
        Key: filename,
        ContentType: 'video/mp4'
    };

    try {
        const response = await s3.createMultipartUpload(createMultipartUploadParams).promise();
        res.status(200).json({uploadId: response.UploadId});
    }
    catch(error) {
        res.status(500).json({message: error});
    }
});

export let uploadChunk = (async (req, res) => {
    const chunk = req.file;
    const filename = req.body.filename;
    const uploadId = req.body.uploadId;
    const chunkIndex = req.body.chunkIndex;

    const s3 = new AWS.S3();

    const uploadPartParams = {
        Bucket: 'video-upload-streaming-platform-videos-bucket',
        Key: filename,
        UploadId: uploadId,
        PartNumber: chunkIndex,
        Body: chunk.buffer
    };

    try {
        const response = await s3.uploadPart(uploadPartParams).promise();
        console.log(`Chunk -> ${chunkIndex} ETag -> ${response.ETag}`);
        res.status(200).json({eTag: response.ETag});
    }
    catch(error) {
        res.status(500).json({message: error});
    }
});

export let completeMultipartUpload = (async (req, res) => {
    const filename = req.body.filename;
    const uploadId = req.body.uploadId;
    const uploadedParts = req.body.uploadedParts;
    const title = req.body.title;
    const description = req.body.description;
    const author = req.body.author;

    const s3 = new AWS.S3();

    const completeMultipartUploadParams = {
        Bucket: 'video-upload-streaming-platform-videos-bucket',
        Key: filename,
        UploadId: uploadId,
        MultipartUpload: {
            Parts: uploadedParts
        }
    };

    try {
        const response = await s3.completeMultipartUpload(completeMultipartUploadParams).promise();

        const videoUrl = response.Location;

        // Adding video information to OpenSearch
        uploadVideoInfoToOpenSearch(filename, title, author, description, videoUrl);

        console.log('File uploaded successfully');
    }
    catch(error) {
        res.status(500).json({message: error});
    }
});

const uploadVideoInfoToOpenSearch = (async (filename, title, author, description, url) => {

    // Creating document to upload to opensearch
    const document = {
        title: title,
        author: author,
        description: description,
        url: url
    }

    try {
        const response = await openSearchClient.index({
            id: filename,
            index: 'videos',
            body: document,
            refresh: true
        });
        return true;
    }
    catch(error) {
        return false;
    }
});

export const deleteVideo = async(req, res) => {
    const s3 = new AWS.S3();

    const key = req.query.key;
    const params = {
        Bucket: 'video-upload-streaming-platform-videos-bucket',
        Key: key
    }
    s3.deleteObject(params, (err, data) => {
        if (err) {
            res.status(500).json({message: "Server error!"});
        }
        else {
            const status = deleteVideoInfoFromOpenSearch(key);

            if (status) {
                res.status(200).json({message: "Successfully deleted the video!"});
            }
            else {
                res.status(500).json({message: "Server error!"});
            }
        }
    });
}

const deleteVideoInfoFromOpenSearch = (async (id) => {

    try {
        const response = await openSearchClient.delete({
            index: 'videos',
            id: id
        });
        return true;
    }
    catch(error) {
        return false;
    }
});