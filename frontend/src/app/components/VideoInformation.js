import { useVideoInformationStore } from "../../../zustand/useVideoInformationStore";
import './styles/VideoInformation.css'

export default function VideoInformation() {

    const {showVideoInformation, title, description, author, setVideoInformation} = useVideoInformationStore();

    const videoInformationOverlayClicked = (event) => {

        if (event.target.id == 'videoInformationOverlay') {
            setVideoInformation({newShowVideoInformationValue: false, newTitle: '', newDescription: '', newAuthor: ''});
        }
    }

    return (
        <div className="videoInformationOverlay h-screen w-screen flex flex-col items-center pt-[50px] fixed top-0"
        id="videoInformationOverlay" onClick={videoInformationOverlayClicked}>
            <div className="videoInformation bg-white rounded-lg max-w-[60%] px-[30px] py-[10px]" id="videoInformation">
                <div className="title text-[33px] font-[500] text-center overflow-x-auto overflow-y-hidden whitespace-nowrap"
                id="title">
                    {title}
                </div>

                <div className="description bg-gray-100 max-h-[280px] text-[18px] block mt-[5px] px-[10px] py-[5px] break-words overflow-y-auto border-black border-[1px] rounded-[4px]"
                id="description">
                    {description}
                </div>

                <div className="author text-[20px] font-[500] italic mt-[9px] mb-[2px] overflow-x-auto overflow-y-hidden whitespace-nowrap"
                id="author">
                    - {author}
                </div>
            </div>
        </div>
    );
}