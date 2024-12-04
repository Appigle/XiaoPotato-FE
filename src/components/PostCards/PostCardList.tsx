import { BanknotesIcon } from '@heroicons/react/24/outline';
import { Button, Menu, MenuHandler, MenuItem, MenuList, Spinner } from '@material-tailwind/react';
import { IPostItem, typePostGenre, typePostListRef } from '@src/@types/typePostItem';
import { type_req_get_post_by_page, type_res_get_post } from '@src/@types/typeRequest';
import Api from '@src/Api';
import useEventBusStore from '@src/stores/useEventBusStore';
import useGlobalStore from '@src/stores/useGlobalStore';
import Logger from '@src/utils/logUtils';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { HiRefresh } from 'react-icons/hi';
import { useDebounceCallback } from 'usehooks-ts';
import PostCard from './PostCard';
import PostDetailModal from './PostCardModal';
import PostFormModal from './PostFormModal';
import { SkeletonCard } from './SkeletonCard';

type sortType = 'desc' | 'asc' | '';
interface PostState {
  currentPost?: IPostItem;
  currentIndex: number;
  currentPage: number;
  postGenre: typePostGenre;
  isLoadEnd: boolean;
  total: number;
  mode: 'create' | 'edit';
  isDetailModalOpen: boolean;
  isCreateModalOpen: boolean;
  sort?: sortType;
}

type PropsType = { title?: string };

const PAGE_SIZE = 20;

// Update PostList component to include infinite scroll
const PostList = forwardRef<typePostListRef, PropsType>((_, ref) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const isLoadingMoreRef = useRef<boolean>();
  const [state, setState] = useState<PostState>({
    currentIndex: -1,
    currentPage: 1,
    postGenre: 'All',
    isLoadEnd: false,
    total: 0,
    mode: 'create',
    isDetailModalOpen: false,
    isCreateModalOpen: false,
    sort: '', // desc/asc
  });
  const [postList, setPostList] = useState<IPostItem[]>([]);
  const {
    currentPostGenre: _currentPostGenre,
    isLoading,
    setIsLoading,
    currentSearchWord,
    setCurrentSearchWord,
  } = useGlobalStore();
  const { setIsOpenPostFormModal, isOpenPostFormModal, refreshPostList } = useEventBusStore();

  const fetchPosts = useCallback(() => {
    Logger.log(isLoading, JSON.stringify(state, null, 2), postList.length);
    if (isLoading || state.isLoadEnd || (state.total > 0 && state.total <= postList.length)) return;
    setIsLoading(true);
    const post: type_req_get_post_by_page = {
      postTitle: currentSearchWord,
      postContent: currentSearchWord,
      postGenre: state.postGenre,
      currentPage: state.currentPage,
      pageSize: PAGE_SIZE,
      sort: state.sort,
    };
    return Api.xPotatoApi.getPostByPage(post).then((res) => {
      if (res.code === HTTP_RES_CODE.SUCCESS) {
        const { total, records, current, size } = (res.data || {}) as type_res_get_post;
        setState((prev) => ({
          ...prev,
          total,
          isLoadEnd: prev.isLoadEnd || total <= current * size,
        }));
        setPostList((prev) => (current === 1 ? records : [...prev, ...records]));
        setIsLoading(false);
        isLoadingMoreRef.current = false;
      }
    });
  }, [state.currentPage, state.sort, state.postGenre, refreshKey]);

  const resetListAndState = (data?: { postGenre?: typePostGenre; sort?: sortType }) => {
    setPostList([]);
    setState({ ...state, ...(data || {}), currentPage: 1, isLoadEnd: false });
  };

  const setRefreshKeyValue = (prev: number) => (prev > 9999 ? 0 : prev + 1);

  useEffect(() => {
    setState((prev) => ({ ...prev, isCreateModalOpen: isOpenPostFormModal }));
  }, [isOpenPostFormModal]);

  const handleRefresh = (data?: { postGenre?: typePostGenre; sort?: sortType }) => {
    if (isLoading) return;
    resetListAndState(data);
    setRefreshKey(setRefreshKeyValue);
  };

  useEffect(() => {
    handleRefresh();
  }, [refreshPostList, currentSearchWord]);

  const handleSort = (sort: sortType = '') => {
    if (isLoading) return;
    handleRefresh({ sort });
  };

  useEffect(() => {
    handleRefresh({ postGenre: _currentPostGenre });
  }, [_currentPostGenre]);

  useEffect(() => {
    setCurrentSearchWord('');
    setState((prev) => ({ ...prev, postGenre: 'All' }));
  }, [setCurrentSearchWord]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const loadMoreCards = useDebounceCallback(() => {
    Logger.log(isLoadingMoreRef.current, JSON.stringify(state, null, 2), postList.length);
    if (isLoadingMoreRef.current || state.isLoadEnd) return;
    isLoadingMoreRef.current = true;
    setState((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
  }, 500);

  const handleScroll = useCallback(
    (e?: React.UIEvent<HTMLElement, UIEvent>) => {
      if (isLoading || state.isLoadEnd || !e) return;
      const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
      const offset = 100;
      if (scrollTop + clientHeight >= scrollHeight - offset) {
        loadMoreCards();
      }
    },
    [loadMoreCards, state.isLoadEnd, isLoading],
  );

  useImperativeHandle(ref, () => ({
    handleScroll,
  }));

  const handleModalActions = useCallback(
    (
      post?: IPostItem,
      index: number = -1,
      mode: 'create' | 'edit' = 'create',
      isCreateModalOpen: boolean = false,
      isDetailModalOpen: boolean = false,
    ) => {
      setState((prev) => ({
        ...prev,
        currentPost: post,
        currentIndex: index,
        mode,
        isDetailModalOpen,
        isCreateModalOpen,
      }));

      setIsOpenPostFormModal(isCreateModalOpen);
    },
    [setIsOpenPostFormModal],
  );

  const renderEmptyState = () => (
    <div className="m-auto mt-64 flex flex-col items-center justify-center gap-4 text-blue-gray-900 dark:text-gray-200">
      <BanknotesIcon className="text-potato-500 h-12 w-12" />
      <p className="text-center text-lg">No post found...</p>
    </div>
  );

  const renderBottomLine = () => (
    <span className="h-88 flex w-full items-center justify-center py-2 text-sm italic text-gray-500">
      ---- It's bottom line ({state.total})----
    </span>
  );

  return (
    <>
      <PostDetailModal
        index={state.currentIndex}
        onClose={(post, index) => {
          if (post) {
            const newList = [...postList];
            newList[index] = post;
            setPostList(newList);
          }
          handleModalActions();
        }}
        open={state.isDetailModalOpen}
        post={state.currentPost}
      />
      <PostFormModal
        index={state.currentIndex}
        open={state.isCreateModalOpen}
        post={state.currentPost}
        mode={state.mode}
        onClose={() => handleModalActions()}
        postCb={(success) => {
          if (success) {
            handleRefresh();
          }
          handleModalActions();
        }}
      />
      {!!postList.length && (
        <div className="grid grid-cols-1 gap-4 p-4 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {postList.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              onShowDetail={(post, index) => handleModalActions(post, index, 'create', false, true)}
              onPostEdit={(post, index) => handleModalActions(post, index, 'edit', true, false)}
              onDelete={() => handleRefresh()}
            />
          ))}
        </div>
      )}
      {!isLoading && state.isLoadEnd && postList.length === 0 && renderEmptyState()}
      {isLoading &&
        !state.isLoadEnd &&
        (postList.length === 0 ? (
          <div className="grid grid-cols-1 gap-4 p-4 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {new Array(4).fill('love').map((_, index) => {
              return <SkeletonCard key={`${_}_${index}`} />;
            })}
          </div>
        ) : (
          <Spinner color="amber" className="m-auto h-12 w-12" />
        ))}
      {!isLoading && state.isLoadEnd && postList.length > 0 && renderBottomLine()}
      <HiRefresh
        className={`fixed bottom-[50px] right-[50px] z-20 rounded-full text-2xl hover:cursor-pointer dark:text-gray-200 ${isLoading ? 'animate-spin' : ''}`}
        onClick={() => handleRefresh()}
      />
      <Menu
        animate={{
          mount: { y: 0 },
          unmount: { y: 25 },
        }}
      >
        <MenuHandler>
          <Button
            size="sm"
            variant="text"
            disabled={isLoading}
            className={`${isLoading ? 'cursor-not-allowed' : ''} !fixed bottom-[50px] right-[100px] z-20 rounded-full bg-blue-gray-900/80 px-2 py-1 text-[12px] capitalize text-white hover:cursor-pointer dark:bg-gray-200 dark:text-blue-gray-900`}
          >
            Sort
          </Button>
        </MenuHandler>
        <MenuList
          className={`w-[100px] min-w-[120px] border-none bg-blue-gray-900/80 px-2 py-1 text-[12px] capitalize text-white outline-none hover:cursor-pointer dark:bg-gray-400/80 dark:text-blue-gray-900`}
        >
          <MenuItem
            onClick={() => handleSort('')}
            className={`focus:bg-none hover:dark:bg-blue-gray-900 hover:dark:text-gray-200 ${state.sort === '' ? 'bg-gray-300 text-blue-gray-900 dark:bg-blue-gray-800/50 dark:text-gray-200' : ''}`}
          >
            Recommend
          </MenuItem>
          <MenuItem
            onClick={() => handleSort('desc')}
            className={`focus:bg-none hover:dark:bg-blue-gray-900 hover:dark:text-gray-200 ${state.sort === 'desc' ? 'bg-gray-300 text-blue-gray-900 dark:bg-blue-gray-800/50 dark:text-gray-200' : ''}`}
          >
            Desc
          </MenuItem>
          <MenuItem
            onClick={() => handleSort('asc')}
            className={`focus:bg-currentColor active:bg-currentColor hover:dark:bg-blue-gray-900 hover:dark:text-gray-200 ${state.sort === 'asc' ? 'bg-gray-300 text-blue-gray-900 dark:bg-blue-gray-800/50 dark:text-gray-200' : ''}`}
          >
            Asc
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
});
export default PostList;
