import { PAGE_SIZE_OPTIONS } from '@src/constants/constants';

type PageSizeOptionsType = (typeof PAGE_SIZE_OPTIONS)[number];

type voidFn = () => void;
type emptyFn = () => object;

export type { emptyFn, PageSizeOptionsType, voidFn };
