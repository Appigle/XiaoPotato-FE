const PAGE_SIZE_OPTIONS = [1, 2, 5, 10] as const;
const emptyFn = () => {};

const LOCALFORAGE_KEY = {
  ieltsWPageNumber: 'ieltsWPageNumber',
};

const indexMenuList = [
  {
    name: 'Home',
    path: '/',
    icon: 'home',
    // redirect: true,
  },
  {
    name: 'Starry',
    path: '/demo/starry',
    icon: 'star',
  },
];

export { LOCALFORAGE_KEY, PAGE_SIZE_OPTIONS, emptyFn, indexMenuList };
