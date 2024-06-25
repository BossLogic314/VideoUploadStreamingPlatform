import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

const showMessagesStore = (set) => ({
    showTrySearchingMessage: false,
    setShowTrySearchingMessage: (updatedValue) => set({showTrySearchingMessage: updatedValue}),
    showNoMatchesFoundMessage: false,
    setShowNoMatchesFoundMessage: (updatedValue) => set({showNoMatchesFoundMessage: updatedValue}),
});

export const useShowMessagesStore = create(
    persist(showMessagesStore,
        {
            name: 'show-messages',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
);