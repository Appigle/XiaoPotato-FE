import { PAGE_SIZE_OPTIONS } from '@constants/constants';
import { Button, Input, Option, Select } from '@material-tailwind/react';
import { PageSizeOptionsType } from '@src/@types/constants';
import utils from '@src/utils/utils';

import { useEffect, useState } from 'react';

type PropsType = {
  totalCount: number;
  pageSize?: number;
  currentPage?: number;
  onChange?: (
    pageNumber: number,
    event?:
      | React.MouseEvent<HTMLInputElement | HTMLButtonElement, MouseEvent>
      | React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onPageSizeChange?: (pageNumber: number) => void;
};
const Pagination: React.FC<PropsType> = (props: PropsType) => {
  const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];
  const {
    totalCount,
    pageSize = DEFAULT_PAGE_SIZE,
    currentPage = 1,
    onChange = () => {},
    onPageSizeChange = () => {},
  } = props;
  const [currentPageSize, setCurrentPageSize] = useState<PageSizeOptionsType>(
    pageSize as PageSizeOptionsType,
  );
  const [totalPageNumber, setTotalPageNumber] = useState<number>(() => {
    return utils.getTotalPageCount(currentPageSize, totalCount);
  });
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(currentPage);

  useEffect(() => {
    setTotalPageNumber(utils.getTotalPageCount(currentPageSize, totalCount));
    setCurrentPageIndex(currentPage);
  }, [totalCount, currentPageSize, currentPage]);
  const onPagePrevious = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (currentPageIndex > 1) {
      setCurrentPageIndex(currentPageIndex - 1);
      onChange(currentPageIndex - 1, e);
    }
  };
  const onPageNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (currentPageIndex < totalPageNumber) {
      setCurrentPageIndex(currentPageIndex + 1);
      onChange(currentPageIndex + 1, e);
    }
  };
  const onPageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = Math.max(Number(e.target.value), 1);
    if (newPage <= totalPageNumber && newPage > 0) {
      setCurrentPageIndex(newPage);
      onChange(newPage, e);
    }
  };
  const onPageSizeChangeInner = (e: string) => {
    let newPageSize = Number(e) as PageSizeOptionsType;
    if (PAGE_SIZE_OPTIONS.includes(newPageSize)) {
      setCurrentPageSize(newPageSize);
    } else {
      newPageSize = DEFAULT_PAGE_SIZE;
      setCurrentPageSize(DEFAULT_PAGE_SIZE);
    }
    onPageSizeChange(newPageSize);
  };
  return (
    <div className="flex gap-2">
      <div className="flex gap-1">
        <Button variant="text" className="text-xl" onClick={(e) => onPagePrevious(e)}>
          «
        </Button>
        <button className="btn join-item btn-md">
          {currentPage} / {totalPageNumber}
        </button>
        <Button variant="text" className="text-xl" onClick={(e) => onPageNext(e)}>
          »
        </Button>
      </div>
      <label className="flex items-center gap-2">
        <Input
          crossOrigin={''}
          className="w-14 shadow-md"
          max={totalPageNumber}
          min={1}
          value={currentPageIndex}
          step={1}
          type="text"
          placeholder={`${currentPageIndex}`}
          onChange={(e) => onPageInputChange(e)}
        />
      </label>
      <label className="form-control hidden max-w-xs">
        <Select
          className=""
          onChange={(e) => onPageSizeChangeInner(e || '2')}
          value={`${pageSize}`}
        >
          <Option disabled>Page Size</Option>
          {PAGE_SIZE_OPTIONS.map((m) => {
            return (
              <Option value={`${m}`} key={m}>
                {m}
              </Option>
            );
          })}
        </Select>
      </label>
    </div>
  );
};

export default Pagination;
