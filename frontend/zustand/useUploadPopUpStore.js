import { create } from "zustand";

const uploadPopUpStore = (set) => ({
    showUploadPopUp: false,
    setShowUploadPopUp: (updatedValue) => set({showUploadPopUp: updatedValue})
});

export const useUploadPopUpStore = create(uploadPopUpStore);