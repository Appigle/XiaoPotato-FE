import { create } from 'zustand';

// Zustand store
interface EventBusStore {
  isOpenPostFormModal: boolean;
  setIsOpenPostFormModal: (b: boolean) => void;
}

const useEventBusStore = create<EventBusStore>((set) => ({
  isOpenPostFormModal: false,
  setIsOpenPostFormModal: (b) => set({ isOpenPostFormModal: b }),
}));

export default useEventBusStore;
