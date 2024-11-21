import { create } from 'zustand';

// Zustand store
interface EventBusStore {
  isOpenPostFormModal: boolean;
  setIsOpenPostFormModal: (b: boolean) => void;
  refreshPostList: number;
  setRefreshPostList: (n: number) => void;
}

const useEventBusStore = create<EventBusStore>((set) => ({
  isOpenPostFormModal: false,
  setIsOpenPostFormModal: (b) => set({ isOpenPostFormModal: b }),
  refreshPostList: 0,
  setRefreshPostList: (n) => set({ refreshPostList: n }),
}));

export default useEventBusStore;
