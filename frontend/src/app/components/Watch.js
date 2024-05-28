import { useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from 'react-player';
import './styles/Watch.css';

export default function Watch() {

    const [videos, setVideos] = useState();

    useEffect(() => {
        
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
    }, []);

    console.log(videos);
    return (
        <div className="home h-screen w-screen overflow-y-scroll">
            <div className="navBar h-[70px] w-full border-red-400 border-[1px] flex flex-row items-center">
                <div className="homeDiv w-[25%] flex font-[550]">
                    <div className="homeText text-[30px] ml-[10px]">Home</div>
                </div>
                <input className="searchBox h-[40px] w-[50%] min-w-[500px] pl-[3px] text-[20px] border-black border-[1px]"
                    type="text" placeholder="Search here">
                </input>
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
        </div>
    )
}