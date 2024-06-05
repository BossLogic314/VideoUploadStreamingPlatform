"use client";
import { useState } from "react";
import axios from "axios";
import { useUploadPopUpStore } from "../../../zustand/useUploadPopUpStore";
import { useLoaderStore } from "../../../zustand/useLoaderStore";
import './styles/Upload.css';

export default function Upload({userData}) {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoToUpload, setVideoToUpload] = useState(null);
  const {setShowUploadPopUp} = useUploadPopUpStore();
  const {setShowLoader} = useLoaderStore();

  let createMultipartUpload = (async(file, filename) => {

    // Showing the 'loading' message to the user
    setShowLoader(true);
    try {
      const response = await axios.post('http://localhost:8082/upload/createMultipartUpload',
      {
        filename: filename
      });
      return response.data.uploadId;
    }
    catch(error) {
      setShowLoader(false);
      alert('Could not upload the video. Please try again.');
    }
  });

  let uploadChunks = (async(file, filename, uploadId, chunkSize, totalChunks) => {

    let uploadedParts = [];

    // Sending each chunk to the backend to carry out multipart upload
    for (let i = 0; i < totalChunks; ++i) {
      const chunk = file.slice(i, i + chunkSize);
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('filename', filename);
      formData.append('uploadId', uploadId);
      formData.append('chunkIndex', i + 1);

      try {
        const response = await axios.post('http://localhost:8082/upload/uploadChunk', formData);
        const eTag = response.data.eTag;
        uploadedParts.push({PartNumber: i + 1, ETag: eTag});
      }
      catch(error) {
        setShowLoader(false);
        alert('Could not upload the video. Please try again.');
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
        author: userData.user.name
      }
      );
    }
    catch(error) {
      setShowLoader(false);
      alert('Could not upload the video. Please try again.');
    }
  });

  const videoToUploadSelected = (async (event) => {
    const files = event.target.files;
    if (files.length == 0) {
      return;
    }

    const file = files[files.length - 1];
    setVideoToUpload(file);
  });

  let submitButtonClicked = (async (event) => {
    const file = videoToUpload;

    const currentDate = new Date().toISOString();
    const filename = userData.user.email + "_" + file.name + "_" + currentDate;

    // Creating multipart upload
    const uploadId = await createMultipartUpload(file, filename);

    const chunkSize = 5 * 1024 * 1024; // 5 MB
    const totalChunks = Math.ceil(file.size / chunkSize);

    // Uploading chunks
    const uploadedParts = await uploadChunks(file, filename, uploadId, chunkSize, totalChunks);

    // Completing multipart upload
    completeMultipartUpload(filename, uploadId, uploadedParts);

    // Going back to the home page
    setShowLoader(false);
    setShowUploadPopUp(false);
    alert('Video uploaded successfully!');
  });

  const uploadPopUpOverlayClicked = (event) => {
    if (event.target.id == 'uploadPopUpOverlay') {
      setShowUploadPopUp(false);
    }
  }

  const chooseVideoButtonClicked = (event) => {
    document.getElementById('selectDisplayPictureTag').click();
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center fixed top-0"
    id="uploadPopUpOverlay"
    onClick={uploadPopUpOverlayClicked}>
      <div className="flex flex-col items-center bg-white rounded-lg min-h-[350px] px-[30px] py-[10px]">
        <div className="text-[37px] w-[400px] font-[500] text-center">Upload a video</div>
        <div className="w-[400px] text-2xl font-[450]">Title</div>
        <input className="title bg-gray-100 w-[400px] text-[18px] block mt-1 px-3 py-1 border-black border rounded"
          placeholder="Enter your title here"
          onChange={(event) => setTitle(event.target.value)}>
        </input>

        <div className="mt-2 w-[400px] text-2xl font-[450]">Description</div>
        <textarea className="description bg-gray-100 h-[230px] w-[400px] text-[18px] block mt-1 px-3 py-1 break-words overflow-y-scroll border-black border rounded"
          placeholder="Enter your description here"
          onChange={(event) => setDescription(event.target.value)}>
        </textarea>

        <div className="selectVideoDiv flex flex-row justify-center items-center w-[90%] mt-[7px]">
          <div className="chooseVideoDiv flex justify-end w-[50%]">
            <button className="chooseVideo text-[17px] rounded-[4px] px-[5px] hover:scale-[1.04] active:scale-[1]"
            id="chooseVideo"
            onClick={chooseVideoButtonClicked}>
              Select video
            </button>
          </div>
          <div className="fileSelectedName flex items-center h-[30px] w-[50%] text-[17px] font-[400] ml-[4px] italic truncate ...">
            {
              videoToUpload == null ?
              "No video selected" :
              `${videoToUpload.name}`
            }
          </div>
        </div>

        <input hidden id="selectDisplayPictureTag" type="file" accept="video/mp4" onChange={videoToUploadSelected} />

        <div className="submitDiv flex flex-row justify-center mt-[7px]">
          {
            title != '' && description != '' && videoToUpload != null ?
            (
              <button className="submitButton text-white bg-green-700 hover:bg-green-600 font-medium rounded-lg text-[17px] px-[15px] py-[8px] hover:scale-[1.04] active:scale-[1]"
              id="submitButton"
              onClick={submitButtonClicked}>
                Submit
              </button>
            ) :
            (
              <button className="submitButton text-white bg-green-700 font-medium rounded-lg text-[17px] px-[15px] py-[8px]"
              id="submitButton">
                Submit
              </button>
            )
          }
        </div>
      </div>
    </div>
  );
}