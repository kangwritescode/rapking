import { create } from 'zustand';

type RapContext = 'review-inbox' | 'rap-page';

interface RapStore {
  context: RapContext;
  setContext: (context: RapContext) => void;
}

export const useRapStore = create<RapStore>(set => ({
  context: 'rap-page' as RapContext,
  setContext: (context: RapContext) => set({ context })
}));
