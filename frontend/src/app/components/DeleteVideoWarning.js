"use client";
import axios from "axios";
import { useLoaderStore } from "../../../zustand/useLoaderStore";
import './styles/DeleteVideoWarning.css';

export default function Upload({videoKeyToDelete, setShowDeleteVideoWarning}) {

    const {setShowLoader} = useLoaderStore();

    const deleteVideoWarningOverlayClicked = (event) => {

        if (event.target.id == 'deleteVideoWarningOverlay') {
            setShowDeleteVideoWarning(false);
        }
    }

    const deleteButtonClicked = async (event) => {

        if (videoKeyToDelete == null) {
            return;
        }

        try {
            setShowDeleteVideoWarning(false);
            setShowLoader(true);
            const response = await axios.post(`http://localhost:8082/delete/deleteVideo?key=${videoKeyToDelete}`);
            setShowLoader(false);
            alert('Video deleted successfully!');
            // Rendering videos based on the search string again
            document.getElementById('searchButton').click();
        }
        catch(error) {
            setShowLoader(false);
            alert('Could not delete the video. Please try again.');
        }
    }

    const cancelButtonClicked = (event) => {
        setShowDeleteVideoWarning(false);
    }

    return (
        <div className="h-screen w-screen min-h-[600px] min-w-[600px] flex flex-col items-center absolute top-0 bottom-0 left-0 right-0" id="deleteVideoWarningOverlay"
        onClick={deleteVideoWarningOverlayClicked}>
            <div className="deleteVideoWarning flex flex-col justify-center rounded-lg max-w-[60%] mt-[50px] px-[30px] pt-[10px] pb-[14px]" id="deleteVideoWarning">
                <div className="deleteVideoWarningText text-[25px] font-[500] text-center" id="deleteVideoWarningText">
                    Are you sure you want to delete this video?
                </div>

                <div className="buttonsDiv w-full mt-[10px] flex flex-row justify-center" id="buttonsDiv">
                    <button className="deleteButton text-white bg-red-700 hover:bg-red-600 font-medium rounded-lg text-[18px] mr-[8px] px-5 py-2.5 hover:scale-[1.04] active:scale-[1]"
                    id="deleteButton" onClick={deleteButtonClicked}>
                        Delete
                    </button>

                    <button className="cancelButton text-white bg-green-700 hover:bg-green-600 font-medium rounded-lg text-[18px] ml-[8px] px-5 py-2.5 hover:scale-[1.04] active:scale-[1]"
                    id="cancelButton" onClick={cancelButtonClicked}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}