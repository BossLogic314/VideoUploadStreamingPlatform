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
            {
                videos == null ? <></> :
                (
                    videos.map((element) => (
                        <div className="videoDiv" key={element.id}>
                            <ReactPlayer
                                url={element.url} width="360px" height="180px" controls={true}
                            />
                        </div>
                    ))
                )
            }
        </div>
    )
}