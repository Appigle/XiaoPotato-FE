import useEventBusStore from '@/stores/useEventBusStore';
import { IPostItem, typePostGenre, typePostListRef } from '@src/@types/typePostItem';
import { type_req_get_post_by_page } from '@src/@types/typeRequest';
import Api from '@src/Api';
import useGlobalStore from '@src/stores/useGlobalStore';
import mockData from '@src/utils/mocks/mock.json';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import Toast from '@src/utils/toastUtils';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import PostCard from './PostCard';
import PostDetailModal from './PostCardModal';
import PostFormModal from './PostFormModal';

type PropsType = { title?: string };

// Update CardList component to include infinite scroll
const ArtCardList = forwardRef<typePostListRef, PropsType>((_, ref) => {
  const [cardList, setCardList] = useState<IPostItem[]>([]);
  const { currentPostGenre, isLoading, setIsLoading } = useGlobalStore();
  const [currentPage, setPage] = useState(1);
  const currentSearchWord = useGlobalStore((s) => s.currentSearchWord);
  const getPostDataByPage = useCallback(
    (size: number, page: number, searchWord: string, genre: typePostGenre) => {
      const post: type_req_get_post_by_page = {
        postTitle: searchWord,
        postContent: searchWord,
        genre,
        currentPage: page,
        pageSize: size,
      };
      Api.xPotatoApi.getPostByPage(post).then((res) => {
        if (res.code === HTTP_RES_CODE.SUCCESS) {
          refreshPostList();
        }
      });
    },
    [],
  );
  useEffect(() => {
    getPostDataByPage(20, currentPage, currentSearchWord || '', currentPostGenre);
  }, [currentSearchWord, currentPage, currentPostGenre, getPostDataByPage]);
  const refreshPostList = () => {
    console.log('%c [ refreshPostList ]-43', 'font-size:13px; background:pink; color:#bf2c9f;');
  };
  const initFetchData = useCallback(
    async (currentPostGenre: typePostGenre) => {
      console.log(
        '%c [ currentPostGenre ]-17',
        'font-size:13px; background:pink; color:#bf2c9f;',
        currentPostGenre,
      );
      setIsLoading(true);
      // const data = await fetchData(currentPostGenre, currentPage);
      setCardList((prevCards) => [...prevCards, ...mockData] as IPostItem[]);
      setPage(1);
      setIsLoading(false);
    },
    [setIsLoading],
  );
  const loadMoreCards = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    const newPageNumber = currentPage + 1;
    try {
      // const response = await axios.get(`/api/cards?category=${currentPostGenre}&page=${currentPage}`);
      setCardList(
        (prevCards) =>
          [
            ...prevCards,
            ...mockData.map((m) => ({ ...m, id: `${m.id}_${currentPage}` })),
          ] as IPostItem[],
      );
      setPage(newPageNumber);
    } catch (error) {
      console.error('Error fetching cardList data:', error);
      Toast.error('Error fetching cardList data');
      setPage(newPageNumber - 1);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, setIsLoading, currentPage, currentPostGenre]);

  const handleScroll = useCallback(
    (e?: React.UIEvent<HTMLElement, UIEvent>) => {
      if (isLoading || !e) return;
      const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
      const offset = 100;
      const isBottom = scrollTop + clientHeight >= scrollHeight - offset;
      if (isBottom) {
        loadMoreCards();
      }
    },
    [loadMoreCards, isLoading],
  );

  useEffect(() => {
    setCardList([]);
    setPage(0);
    initFetchData(currentPostGenre);
  }, [currentPostGenre, initFetchData]);

  useImperativeHandle(ref, () => ({
    handleScroll,
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [currentCardData, setCurrentCardData] = useState<IPostItem | undefined>(undefined);
  const openDetail = () => {
    setIsOpen(true);
  };

  const onCloseModal = () => {
    setIsOpen(false);
  };

  const onShowDetail = (cardData: IPostItem) => {
    console.log(
      '%c [ onShowDetail ]-88',
      'font-size:13px; background:pink; color:#bf2c9f;',
      cardData,
    );
    setCurrentCardData(cardData);
    openDetail();
  };
  const setIsOpenPostFormModal = useEventBusStore((s) => s.setIsOpenPostFormModal);
  const isOpenPostFormModal = useEventBusStore((s) => s.isOpenPostFormModal);

  return (
    <>
      <PostDetailModal onClose={onCloseModal} open={isOpen} post={currentCardData} />
      <PostFormModal open={isOpenPostFormModal} onClose={() => setIsOpenPostFormModal(false)} />
      <div className="grid grid-cols-1 gap-4 p-4 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cardList.map((card, index) => (
          <PostCard key={card.id} card={card} index={index} onShowDetail={onShowDetail} />
        ))}
        {isLoading && <div className="col-span-full text-center">Loading...</div>}
      </div>
    </>
  );
});
export default ArtCardList;
