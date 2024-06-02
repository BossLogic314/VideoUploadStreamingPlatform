"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import axios from "axios";
import ReactPlayer from 'react-player';
import Upload from "./Upload";
import './styles/Watch.css';

export default function Watch() {

    const {data, status} = useSession();
    const [videos, setVideos] = useState();
    const [userSignedIn, setUserSignedIn] = useState(false);
    const [showUploadPopUp, setShowUploadPopUp] = useState(false);

    useEffect(() => {
        
        if (status == 'authenticated') {
            setUserSignedIn(true);
        }

        const getVideos = async() => {
            try {
                const response = await axios.get('http://localhost:8083/watch/getAllVideos');
                const videos = response.data.videos;
                setVideos(videos);
            }
            catch(error) {
                console.log(error);
            }
        }
        getVideos();
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

    const signInClicked = () => {
        signIn('google');
    }

    return (
        <div className="home h-screen w-screen min-w-[550px] overflow-y-scroll">
            <div className="navBar h-[75px] w-full border-red-400 border-[1px] flex flex-row justify-center items-center">
                <div className="homeDiv w-[20%] flex justify-center font-[550]">
                    <button className="uploadButton text-white bg-green-700 hover:bg-green-600 font-medium rounded-lg text-[18px] px-5 py-2.5 hover:scale-[1.04] active:scale-[1]"
                    onClick={uploadButtonClicked}>
                        Upload
                    </button>
                </div>
                <input className="searchBox h-[45px] w-[60%] pl-[5px] text-[20px] border-black border-[1px]"
                    type="text" placeholder="Search here">
                </input>
                {
                    data == null ?
                    <div className="w-[20%] flex justify-center">
                        <a className="signInLink text-[20px] underline underline-offset-4 hover:scale-[1.05] hover:cursor-pointer active:scale-[1]"
                        onClick={signInClicked}>
                            Sign in
                        </a>
                    </div> :
                    <div className="profile w-[20%] flex justify-center">
                        <img
                            className="displayPicture h-[55px] w-[55px] rounded-full hover:scale-[1.05] hover:cursor-pointer active:scale-[1]"
                            src={data.user.image}>
                        </img>
                    </div>
                }
            </div>
            <div className="videos flex align-center justify-center flex-wrap border-black border-[2px]">
                {
                    videos == null ? <></> :
                    (
                        videos.map((element) => (
                            <div className="videoDiv w-[380px] mt-[10px] ml-[40px] border-black border-[1px] inline-block"
                            key={element.id}>
                                <ReactPlayer
                                    url={element.url} width="380px" height="200px" controls={true}
                                />

                                <div className="title font-[700] text-[25px] ml-[4px]">{element.title}</div>
                                <div className="author font-[400] text-[18px] ml-[4px]">{element.author}</div>
                                <div className="description font-[400] ml-[4px] text-[18px]">{element.description}</div>
                            </div>
                        ))
                    )
                }
            </div>
            {
                showUploadPopUp ?
                <Upload /> :
                <></>
            }
        </div>
    )
}