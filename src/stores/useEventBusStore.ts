import { typeEmail } from '@src/@types/common';
import { create } from 'zustand';

// Zustand store
interface EventBusStore {
  isOpenPostFormModal: boolean;
  setIsOpenPostFormModal: (b: boolean) => void;
  refreshPostList: number;
  setRefreshPostList: (n: number) => void;
  currentEmailDetail: typeEmail | null;
  setCurrentEmailDetail: (n: typeEmail) => void;
}

const useEventBusStore = create<EventBusStore>((set) => ({
  isOpenPostFormModal: false,
  setIsOpenPostFormModal: (b) => set({ isOpenPostFormModal: b }),
  refreshPostList: 0,
  setRefreshPostList: (n) => set({ refreshPostList: n }),
  currentEmailDetail: null,
  setCurrentEmailDetail: (e) => set({ currentEmailDetail: e }),
}));

export default useEventBusStore;
