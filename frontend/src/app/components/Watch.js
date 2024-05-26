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
            <div className="videos border-black border-[2px]">
                {
                    videos == null ? <></> :
                    (
                        videos.map((element) => (
                            <div className="videoDiv w-[360px] mt-[10px] ml-[10px] border-black border-[1px] inline-block" key={element.id}>
                                <ReactPlayer
                                    url={element.url} width="360px" height="180px" controls={true}
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