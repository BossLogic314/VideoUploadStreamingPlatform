import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

const searchStore = (set) => ({
    searchString: '',
    setSearchString: (newSearchString) => set({searchString: newSearchString})
});

export const useSearchStore = create(
    persist(searchStore,
        {
            name: 'search-string',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
);