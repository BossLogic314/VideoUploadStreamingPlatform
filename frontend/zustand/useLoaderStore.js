import { create } from "zustand";

const loaderStore = (set) => ({
    showLoader: false,
    setShowLoader: (updatedValue) => set({showLoader: updatedValue})
});

export const useLoaderStore = create(loaderStore);