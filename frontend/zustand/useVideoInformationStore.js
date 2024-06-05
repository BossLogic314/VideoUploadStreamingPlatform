import { create } from "zustand";

const videoInformationStore = (set) => ({
    showVideoInformation: false,
    title: '',
    description: '',
    author: '',
    setVideoInformation: ({newShowVideoInformationValue, newTitle, newDescription, newAuthor}) => set(
        {showVideoInformation: newShowVideoInformationValue, title: newTitle, description: newDescription, author: newAuthor}
    )
});

export const useVideoInformationStore = create(videoInformationStore);