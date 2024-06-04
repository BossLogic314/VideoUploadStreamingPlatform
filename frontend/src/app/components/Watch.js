"use client";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";
import ReactPlayer from 'react-player';
import { useUploadPopUpStore } from "../../../zustand/useUploadPopUpStore";
import Upload from "./Upload";
import TrySearchingMessage from "./TrySearchingMessage";
import NoMatchesFoundMessage from "./NoMatchesFoundMessage";
import './styles/Watch.css';

export default function Watch() {

    const {data, status} = useSession();
    const [videos, setVideos] = useState();
    const [userSignedIn, setUserSignedIn] = useState(false);
    const {showUploadPopUp, setShowUploadPopUp} = useUploadPopUpStore();
    const [showProfileInformation, setShowProfileInformation] = useState(false);
    const [showTrySearchingMessage, setShowTrySearchingMessage] = useState(true);
    const [showNoMatchesFoundMessage, setShowNoMatchesFoundMessage] = useState(false);

    useEffect(() => {
        
        if (status == 'authenticated') {
            setUserSignedIn(true);
        }
    }, [data]);

    const uploadButtonClicked = () => {

        // If the user is not signed in
        if (!userSignedIn) {
            signIn('google');
        }
        else {
            setShowUploadPopUp(true);
        }
    }

    const searchButtonClicked = async() => {

        const searchString = document.getElementById('searchBox').value;
        if (searchString == '') {
            return;
        }

        // Not showing this message anymore
        setShowTrySearchingMessage(false);

        try {
            const response = await axios.get(`http://localhost:8083/watch/getVideos?searchString=${searchString}`);
            const videos = response.data.response.body.hits.hits;

            // If no videos are returned
            if (videos.length == 0) {
                setShowNoMatchesFoundMessage(true);
                setVideos([]);
                return;
            }

            // When at least 1 video is returned
            setShowNoMatchesFoundMessage(false);
            setVideos(videos);
        }
        catch(error) {
            console.log(error);
        }
    }

    const backgroundClicked = (event) => {
        if (event.target.id == '') {
            setShowProfileInformation(false);
        }
    }

    const signInClicked = () => {
        signIn('google');
    }

    const signOutButtonClicked = () => {
        signOut();
    }

    const displayPictureClicked = () => {
        setShowProfileInformation(!showProfileInformation);
    }

    return (
        <div className="home h-screen w-screen min-w-[600px] overflow-y-scroll"
        onClick={backgroundClicked}>
            <div className="navBar h-[75px] w-full flex flex-row justify-center items-center">
                <div className="homeDiv w-[20%] flex justify-center font-[550]">
                    <button className="uploadButton text-white bg-green-700 hover:bg-green-600 font-medium rounded-lg text-[18px] px-5 py-2.5 hover:scale-[1.04] active:scale-[1]"
                    onClick={uploadButtonClicked}>
                        Upload
                    </button>
                </div>
                <div className="searchDiv w-[60%] flex flex-row">
                    <input className="searchBox h-[45px] flex-1 rounded-[4px] pl-[5px] text-[20px] border-black border-[1px]"
                    id="searchBox"
                        type="text" placeholder="Search here">
                    </input>
                    <button className="searchButton w-[80px] rounded-[4px] ml-[2px] border-black border-[1px] hover:scale-[1.05] hover:cursor-pointer active:scale-[1]"
                    onClick={searchButtonClicked}>
                        Search
                    </button>
                </div>
                {
                    data == null ?
                    <div className="w-[20%] flex justify-center">
                        <a className="signInLink text-[20px] underline underline-offset-4 hover:scale-[1.05] hover:cursor-pointer active:scale-[1]"
                        onClick={signInClicked}>
                            Sign in
                        </a>
                    </div> :
                    <div className="profile h-[55px] w-[20%] flex flex-col">
                        <div className="profilePictureDiv h-[100%] w-[100%] flex justify-center">
                            <img
                                className="displayPicture h-[55px] w-[55px] rounded-full hover:scale-[1.05] hover:cursor-pointer active:scale-[1]"
                                id="displayPicture"
                                src={data.user.image}
                                onClick={displayPictureClicked}>
                            </img>
                        </div>
                    </div>
                }
            </div>
            <div className="blank w-[90%] ml-[5%] border-black border-t-[1px]"></div>
            {
                showTrySearchingMessage ?
                <TrySearchingMessage /> :
                <></>
            }
            {
                showNoMatchesFoundMessage ?
                <NoMatchesFoundMessage /> :
                <></>
            }
            <div className="videos flex align-center justify-center flex-wrap">
                {
                    videos == null ? <></> :
                    (
                        videos.map((element) => (
                            <div className="videoDiv w-[380px] mt-[13px] ml-[40px] border-black border-[1px] inline-block"
                            key={element._id}>
                                <ReactPlayer
                                    url={element._source.url} width="380px" height="200px" controls={true}
                                />

                                <div className="title font-[700] text-[25px] ml-[4px]">{element._source.title}</div>
                                <div className="author font-[400] text-[18px] ml-[4px]">{element._source.author}</div>
                                <div className="description font-[400] ml-[4px] text-[18px]">{element._source.description}</div>
                            </div>
                        ))
                    )
                }
            </div>
            {
                showProfileInformation ?
                <div className="profileInformation absolute flex flex-col justify-center items-center ml-[50px] z-[2] top-[68px] right-[10%] rounded-[8px] shadow-[2px_10px_28px_-16px]"
                id="profileInformation">
                    <div className="username text-[22px] font-[500] mt-[3px] mx-[10px]" id="username">{data.user.name}</div>
                    <div className="emailId text-[18px] mx-[10px]" id="emailId">{data.user.email}</div>
                    <button className="signOutButton text-white bg-red-700 hover:bg-red-600 font-[450] rounded-[8px] text-[16px] mt-[5px] mb-[8px] px-[10px] py-[2px] hover:scale-[1.04] active:scale-[1]"
                    id="signOutButton"
                    onClick={signOutButtonClicked}>
                        Sign out
                    </button>
                </div> :
                <></>
            }
            {
                showUploadPopUp ?
                <Upload userData={data}/> :
                <></>
            }
        </div>
    )
}