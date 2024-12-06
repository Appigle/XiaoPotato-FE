import IELTSWData from '@assets/ieltsW.json';
import Pagination from '@components/Pagination';
import { LOCALFORAGE_KEY, PAGE_SIZE_OPTIONS } from '@constants/constants';
import { PageSizeOptionsType } from '@src/@types/constants';
import type { IELTSWObj } from '@src/@types/IELTSType';
import BackBtn from '@src/components/BackBtnn';
import KeyPressNotice from '@src/components/KeyPressNotice';
import Key from '@src/constants/keyboard';
import utils from '@src/utils/utils';
import localforage from 'localforage';
import { useEffect, useMemo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';
import IELTSItem from './IELTSItem';

const IELTSTraining = () => {
  const { index: pageNumber = '1', index: pageNumberFromUrl } = useParams();
  const [IELTSList, setIELTSList] = useState<Array<IELTSWObj>>([]);
  const [pageSize, setPageSize] = useState<PageSizeOptionsType>(PAGE_SIZE_OPTIONS[0]);
  const totalPageNumber = useMemo(() => {
    return utils.getTotalPageCount(pageSize, IELTSWData.length);
  }, [pageSize, IELTSList]);

  const [currentPageNumber, setCurrentPageNumber] = useState<number>(() => {
    const pageNumberFromUrl = Number(pageNumber);
    return pageNumberFromUrl >= 1 ? Math.min(Math.floor(pageNumberFromUrl), totalPageNumber) : 1;
  });

  const [previousEnable, setPreviousEnable] = useState<boolean>(currentPageNumber > 1);
  const [nextEnable, setNextEnable] = useState<boolean>(currentPageNumber >= totalPageNumber);

  useHotkeys(`${Key.ArrowRight}`, () => {
    onNextClick();
  });
  useHotkeys(`${Key.ArrowLeft}`, () => {
    onPreviousClick();
  });

  useEffect(() => {
    setIELTSList(IELTSWData.slice(currentPageNumber, currentPageNumber + pageSize));
    setNextEnable(currentPageNumber < totalPageNumber);
    setPreviousEnable(currentPageNumber > 1);
  }, [currentPageNumber, pageSize, totalPageNumber]);

  useEffect(() => {
    localforage.getItem<number>(LOCALFORAGE_KEY.ieltsWPageNumber).then((pageNumberCache) => {
      if (pageNumberCache && !pageNumberFromUrl) {
        setCurrentPageNumber(Math.max(Number(pageNumberCache), 1));
      }
    });
  }, [pageNumberFromUrl]);

  useEffect(() => {
    localforage.setItem(LOCALFORAGE_KEY.ieltsWPageNumber, currentPageNumber);
  }, [currentPageNumber]);

  const onNextClick = () => {
    if (!nextEnable) {
      return;
    }
    setCurrentPageNumber(currentPageNumber + 1);
  };
  const onPreviousClick = () => {
    if (!previousEnable) {
      return;
    }
    setCurrentPageNumber(currentPageNumber - 1);
  };
  return (
    <>
      <BackBtn />
      <KeyPressNotice />
      <div className="relative flex w-screen justify-center gap-4">
        <div
          onClick={() => onPreviousClick()}
          className={`absolute left-0 my-auto mt-20 flex h-[calc(100%-100px)] w-40 items-center justify-center rounded-e-3xl hover:visible ${!previousEnable ? 'bg-gray-200/40 text-gray-500 hover:cursor-not-allowed' : 'hover:bg-slate-600 hover:cursor-pointer hover:text-red-300 hover:shadow-[0_20px_50px_rgba(2,_112,_184,_0.5)]'}`}
        >
          <FaAnglesLeft className="mr-4" /> ({currentPageNumber}/{totalPageNumber})
        </div>
        <div className="flex max-w-[70%] flex-1 items-center justify-center gap-4 overflow-auto">
          {IELTSList.map((item) => {
            return <IELTSItem ieltsW={item} key={item.zh}></IELTSItem>;
          })}
        </div>
        <div
          onClick={() => onNextClick()}
          className={`absolute right-0 my-auto mt-20 flex h-[calc(100%-100px)] w-40 items-center justify-center rounded-s-3xl hover:visible ${!nextEnable ? 'bg-gray-200/40 text-gray-500 hover:cursor-not-allowed' : 'hover:bg-slate-600 hover:cursor-pointer hover:text-red-300 hover:shadow-[0_20px_50px_rgba(2,_112,_184,_0.5)]'}`}
        >
          ({currentPageNumber}/{totalPageNumber})
          <FaAnglesRight className="ml-4" />
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <Pagination
          currentPage={currentPageNumber}
          totalCount={IELTSWData.length}
          onPageSizeChange={(pageSize) => {
            setPageSize(pageSize as PageSizeOptionsType);
          }}
          onChange={(page) => {
            setCurrentPageNumber(page);
          }}
        />
      </div>
    </>
  );
};

export default IELTSTraining;
