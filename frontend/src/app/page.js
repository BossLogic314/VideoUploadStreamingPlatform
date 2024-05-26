"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [videoToUpload, setVideoToUpload] = useState(null);

  let uploadButtonClicked = ((event) => {
    document.getElementById('videoInput').click();
  });

  let createMultipartUpload = (async(file) => {
    try {
      const response = await axios.post('http://localhost:8082/upload/createMultipartUpload',
      {
        filename: file.name
      });
      return response.data.uploadId;
    }
    catch(error) {
      console.log(error);
    }
  });

  let uploadChunks = (async(file, uploadId, chunkSize, totalChunks) => {

    let uploadedParts = [];

    // Sending each chunk to the backend to carry out multipart upload
    for (let i = 0; i < totalChunks; ++i) {
      const chunk = file.slice(i, i + chunkSize);
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('filename', file.name);
      formData.append('uploadId', uploadId);
      formData.append('chunkIndex', i + 1);

      try {
        const response = await axios.post('http://localhost:8082/upload/uploadChunk', formData);
        const eTag = response.data.eTag;
        uploadedParts.push({PartNumber: i + 1, ETag: eTag});
      }
      catch(error) {
        console.log(error);
      }
    }
    return uploadedParts;
  });

  let completeMultipartUpload = (async(filename, uploadId, uploadedParts) => {
    try {
      const response = await axios.post('http://localhost:8082/upload/completeMultipartUpload',
      {
        filename: filename,
        uploadId: uploadId,
        uploadedParts: uploadedParts,
        title: title,
        description: description,
        author: author
      }
      );
    }
    catch(error) {
      console.log(error);
    }
  });

  let videoToUploadSelected = (async (event) => {
    const files = event.target.files;
    if (files.length == 0) {
      return;
    }

    const file = files[0];

    // Creating multipart upload
    const uploadId = await createMultipartUpload(file);

    const chunkSize = 5 * 1024 * 1024; // 5 MB
    const totalChunks = Math.ceil(file.size / chunkSize);

    // Uploading chunks
    const uploadedParts = await uploadChunks(file, uploadId, chunkSize, totalChunks);

    // Completing multipart upload
    await completeMultipartUpload(file.name, uploadId, uploadedParts);
  });

  return (
    <div className="h-screen w-screen bg-blue-100 flex justify-center items-center">

      <div className="flex flex-col">

        <input className="title mt-[5px]" id="title" onChange={(event) => setTitle(event.target.value)} value={title}></input>
        <input className="description mt-[5px]" id="description" onChange={(event) => setDescription(event.target.value)} value={description}></input>
        <input className="author mt-[5px]" id="author" value={author} onChange={(event) => setAuthor(event.target.value)}></input>

        <input id="videoInput" type="file" accept="video/mp4" onChange={videoToUploadSelected} hidden></input>
        <button className="uploadVideoButton bg-green-400" onClick={uploadButtonClicked}>Upload</button>

      </div>

    </div>
  );
}