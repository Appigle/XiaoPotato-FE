import { ArtCardData, ArtCardListRefType } from '@src/@types/artCard';
import { ArtNameType } from '@src/@types/artTypes';
import useGlobalStore from '@src/stores/useGlobalStore';
import mockData from '@src/utils/mocks/mock.json';
import Toast from '@src/utils/toastUtils';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import ArtCard from '../ArtCards/ArtCard';
type PropsType = { title?: string };

// Update CardList component to include infinite scroll
const ArtCardList = forwardRef<ArtCardListRefType, PropsType>((_, ref) => {
  const [cardList, setCardList] = useState<ArtCardData[]>([]);
  const { currentArtType, isLoading, setIsLoading } = useGlobalStore();
  const [page, setPage] = useState(1);
  const initFetchData = useCallback(
    async (currentArtType: ArtNameType) => {
      console.log(
        '%c [ currentArtType ]-17',
        'font-size:13px; background:pink; color:#bf2c9f;',
        currentArtType,
      );
      setIsLoading(true);
      // const data = await fetchData(currentArtType, page);
      setCardList((prevCards) => [...prevCards, ...mockData] as ArtCardData[]);
      setPage(1);
      setIsLoading(false);
    },
    [setIsLoading],
  );
  const loadMoreCards = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    const newPageNumber = page + 1;
    try {
      // const response = await axios.get(`/api/cards?category=${currentArtType}&page=${page}`);
      setCardList(
        (prevCards) =>
          [
            ...prevCards,
            ...mockData.map((m) => ({ ...m, id: `${m.id}_${page}` })),
          ] as ArtCardData[],
      );
      setPage(newPageNumber);
    } catch (error) {
      console.error('Error fetching cardList data:', error);
      Toast.error('Error fetching cardList data');
      setPage(newPageNumber - 1);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, setIsLoading, page, currentArtType]);

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
    initFetchData(currentArtType);
  }, [currentArtType, initFetchData]);

  useImperativeHandle(ref, () => ({
    handleScroll,
  }));

  return (
    <div className="grid grid-cols-1 gap-4 p-4 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {cardList.map((card, index) => (
        <ArtCard key={card.id} card={card} index={index} />
      ))}
      {isLoading && <div className="col-span-full text-center">Loading...</div>}
    </div>
  );
});
export default ArtCardList;
