import { create } from 'zustand';

// Zustand store
interface OtStore {
  smAttr: string;
  setSmAttr: (attr: string) => void;
}

const useOtStore = create<OtStore>((set) => ({
  smAttr: 'All',
  setSmAttr: (attr) => set({ smAttr: attr }),
}));

export default useOtStore;
