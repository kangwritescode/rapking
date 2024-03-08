import { Rap } from '@prisma/client';
import { create } from 'zustand';

type RapContext = 'review-inbox' | 'rap-page';

interface RapStore {
  context: RapContext;
  setContext: (context: RapContext) => void;
  setRap: (rap: Rap) => void;
  rap: Rap | null;
}

export const useRapStore = create<RapStore>(set => ({
  context: 'rap-page' as RapContext,
  setContext: (context: RapContext) => set({ context }),
  setRap: rap => set({ rap }),
  rap: null
}));
