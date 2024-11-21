import { BanknotesIcon } from '@heroicons/react/24/outline';
import { Spinner } from '@material-tailwind/react';
import { IPostItem, typePostGenre, typePostListRef } from '@src/@types/typePostItem';
import { type_req_get_post_by_page, type_res_get_post } from '@src/@types/typeRequest';
import Api from '@src/Api';
import X_POTATO_URL from '@src/constants/xPotatoUrl';
import useEventBusStore from '@src/stores/useEventBusStore';
import useGlobalStore from '@src/stores/useGlobalStore';
import useRequest from '@src/utils/request';
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

interface PostState {
  currentPost?: IPostItem;
  currentIndex: number;
  currentPage: number;
  postGenre: typePostGenre;
  isLoadEnd: boolean;
  total: number;
  mode: 'create' | 'edit';
  isModalOpen: boolean;
  isFormModalOpen: boolean;
}

type PropsType = { title?: string };

// Update PostList component to include infinite scroll
const PostList = forwardRef<typePostListRef, PropsType>((_, ref) => {
  const [state, setState] = useState<PostState>({
    currentIndex: -1,
    currentPage: 1,
    postGenre: 'All',
    isLoadEnd: false,
    total: 0,
    mode: 'create',
    isModalOpen: false,
    isFormModalOpen: false,
  });
  const [postList, setPostList] = useState<IPostItem[]>([]);
  const loadingRef = useRef(false);
  const {
    currentPostGenre: _currentPostGenre,
    isLoading,
    setIsLoading,
    currentSearchWord,
    setCurrentSearchWord,
  } = useGlobalStore();
  const setIsOpenPostFormModal = useEventBusStore((s) => s.setIsOpenPostFormModal);
  const fetchPosts = useCallback(
    (size: number, page: number, searchWord: string, postGenre: typePostGenre) => {
      const post: type_req_get_post_by_page = {
        postTitle: searchWord,
        postContent: searchWord,
        postGenre,
        currentPage: page,
        pageSize: size,
      };
      return Api.xPotatoApi.getPostByPage(post).then((res) => {
        if (res.code === HTTP_RES_CODE.SUCCESS) {
          const { total, records, current, size } = (res.data || {}) as type_res_get_post;
          setState((prev) => ({
            ...prev,
            total,
            isLoadEnd: total <= current * size,
          }));
          setPostList((prev) => [...prev, ...records]);
        }
      });
    },
    [],
  );

  const resetList = useCallback(() => {
    setPostList([]);
    setState((prev) => ({
      ...prev,
      currentPage: 1,
      isLoadEnd: false,
    }));
  }, []);
  useEffect(() => {
    setCurrentSearchWord('');
    setState((prev) => ({ ...prev, postGenre: 'All' }));
  }, [setCurrentSearchWord]);

  useEffect(() => {
    resetList();
    setState((prev) => ({ ...prev, postGenre: _currentPostGenre }));
  }, [_currentPostGenre, resetList]);

  useEffect(() => {
    resetList();
  }, [currentSearchWord, resetList]);

  useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);
    fetchPosts(20, state.currentPage, currentSearchWord || '', state.postGenre).finally(() => {
      setIsLoading(false);
      loadingRef.current = false;
    });
    return () => {
      const abort = useRequest.getAbortAxios();
      abort.removePending(abort.getRequestId(X_POTATO_URL.POST_FILTER_PAGES, 'get'));
    };
  }, [currentSearchWord, state.currentPage, state.postGenre, fetchPosts, setIsLoading]);

  const loadMoreCards = useDebounceCallback(() => {
    if (loadingRef.current || state.isLoadEnd) return;
    setIsLoading(true);
    setState((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
  }, 200);

  const handleScroll = useCallback(
    (e?: React.UIEvent<HTMLElement, UIEvent>) => {
      if (loadingRef.current || !e || state.isLoadEnd) return;
      const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
      const offset = 100;
      if (scrollTop + clientHeight >= scrollHeight - offset) {
        loadMoreCards();
      }
    },
    [loadMoreCards, state.isLoadEnd],
  );
  const handleModalActions = useCallback(
    (
      post?: IPostItem,
      index: number = -1,
      mode: 'create' | 'edit' = 'create',
      isForm: boolean = false,
      isModalOpen: boolean = false,
    ) => {
      setState((prev) => ({
        ...prev,
        currentPost: post,
        currentIndex: index,
        mode,
        isModalOpen,
        isFormModalOpen: isForm,
      }));
      if (isForm) {
        setIsOpenPostFormModal(true);
      }
    },
    [setIsOpenPostFormModal],
  );
  const handleRefresh = useCallback(() => {
    if (loadingRef.current) return;
    resetList();
    if (state.currentPage === 1) {
      fetchPosts(20, 1, currentSearchWord || '', state.postGenre);
    }
  }, [resetList, state.currentPage, state.postGenre, currentSearchWord, fetchPosts]);
  useImperativeHandle(ref, () => ({
    handleScroll,
  }));

  const renderEmptyState = () => (
    <div className="m-auto mt-64 flex flex-col items-center justify-center gap-4">
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
        open={state.isModalOpen}
        post={state.currentPost}
      />
      <PostFormModal
        index={state.currentIndex}
        open={state.isFormModalOpen}
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
        <div className="grid grid-cols-1 gap-4 p-4 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {postList.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              onShowDetail={(post, index) => handleModalActions(post, index, 'create', false, true)}
              onPostEdit={(post, index) => handleModalActions(post, index, 'edit', true, true)}
              onDelete={handleRefresh}
            />
          ))}
        </div>
      )}
      {!isLoading && state.isLoadEnd && postList.length === 0 && renderEmptyState()}
      {isLoading && !state.isLoadEnd && (
        <Spinner color="amber" className="m-auto mt-64 h-12 w-12" />
      )}
      {!isLoading && state.isLoadEnd && postList.length > 0 && renderBottomLine()}
      <HiRefresh
        className={`fixed bottom-[50px] right-[50px] z-20 rounded-full text-2xl hover:cursor-pointer ${isLoading ? 'animate-spin' : ''}`}
        onClick={handleRefresh}
      />
    </>
  );
});
export default PostList;
