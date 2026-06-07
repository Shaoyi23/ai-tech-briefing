import { create } from "zustand";

type BriefingState = {
  query: string;
  setQuery: (query: string) => void;
};

export const useBriefingStore = create<BriefingState>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
}));
