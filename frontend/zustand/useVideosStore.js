import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

const videosStore = (set) => ({
    videos: [],
    setVideos: (newVideos) => set({videos: newVideos})
});

export const useVideosStore = create(
    persist(videosStore,
        {
            name: 'videos',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
);