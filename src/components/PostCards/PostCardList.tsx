import useEventBusStore from '@/stores/useEventBusStore';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { Spinner } from '@material-tailwind/react';
import { IPostItem, typePostGenre, typePostListRef } from '@src/@types/typePostItem';
import { type_req_get_post_by_page, type_res_get_post } from '@src/@types/typeRequest';
import Api from '@src/Api';
import X_POTATO_URL from '@src/constants/xPotatoUrl';
import useGlobalStore from '@src/stores/useGlobalStore';
import useRequest from '@src/utils/request';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { HiRefresh } from 'react-icons/hi';
import PostCard from './PostCard';
import PostDetailModal from './PostCardModal';
import PostFormModal from './PostFormModal';

type PropsType = { title?: string };

// Update PostList component to include infinite scroll
const PostPostList = forwardRef<typePostListRef, PropsType>((_, ref) => {
  const [postList, setPostList] = useState<IPostItem[]>([]);
  const { currentPostGenre: _currentPostGenre, isLoading, setIsLoading } = useGlobalStore();
  const [currentPostIndex, setCurrentPostIndex] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPostGenre, setCurrentPostGenre] = useState(_currentPostGenre);
  const [isLoadEnd, setIsLoadEnd] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPostEditOrCreateMode, setCurrentPostEditOrCreateMode] = useState<'create' | 'edit'>(
    'create',
  );
  const currentSearchWord = useGlobalStore((s) => s.currentSearchWord);
  const setCurrentSearchWord = useGlobalStore((s) => s.setCurrentSearchWord);
  const getPostDataByPage = useCallback(
    (size: number, page: number, searchWord: string, postGenre: typePostGenre) => {
      const post: type_req_get_post_by_page = {
        postTitle: searchWord,
        postContent: searchWord,
        postGenre,
        currentPage: page,
        pageSize: size,
      };
      return Api.xPotatoApi
        .getPostByPage(post)
        .then((res) => {
          if (res.code === HTTP_RES_CODE.SUCCESS) {
            const { total, records } = (res.data || {}) as type_res_get_post;
            setTotal(total);
            setPostList((pre) => {
              return [...pre, ...records];
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [setIsLoading],
  );

  useEffect(() => {
    setCurrentSearchWord('');
    setCurrentPostGenre('All');
  }, [setCurrentSearchWord]);

  useEffect(() => {
    const currentLength = postList.length;
    const isEnd = currentLength >= total;
    setIsLoadEnd(isEnd);
  }, [postList, total]);

  useEffect(() => {
    setPostList([]);
    setCurrentPostGenre(_currentPostGenre);
    setCurrentPage(1);
  }, [_currentPostGenre]);

  useEffect(() => {
    setPostList([]);
    setCurrentPage(1);
  }, [currentSearchWord]);

  useEffect(() => {
    setIsLoading(true);
    getPostDataByPage(20, currentPage, currentSearchWord || '', currentPostGenre);
    return () => {
      const abort = useRequest.getAbortAxios();
      abort.removePending(abort.getRequestId(X_POTATO_URL.POST_FILTER_PAGES, 'get'));
    };
  }, [currentSearchWord, currentPage, currentPostGenre, getPostDataByPage, setIsLoading]);

  const onRefreshPostList = useCallback(() => {
    if (isLoading) return;
    setPostList([]);
    setIsLoading(true);
    setIsLoadEnd(false);
    if (currentPage === 1) {
      getPostDataByPage(20, currentPage, currentSearchWord || '', currentPostGenre);
    } else {
      setCurrentPage(1);
    }
  }, [
    currentPage,
    currentPostGenre,
    currentSearchWord,
    getPostDataByPage,
    setIsLoading,
    setIsLoadEnd,
    isLoading,
  ]);

  const loadMoreCards = useCallback(async () => {
    if (isLoading || isLoadEnd) return;
    setIsLoading(true);
    setCurrentPage(currentPage + 1);
  }, [setCurrentPage, setIsLoading, currentPage, isLoading, isLoadEnd]);

  const handleScroll = useCallback(
    (e?: React.UIEvent<HTMLElement, UIEvent>) => {
      if (isLoading || !e || isLoadEnd) return;
      const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
      const offset = 100;
      const isBottom = scrollTop + clientHeight >= scrollHeight - offset;
      if (isBottom) {
        loadMoreCards();
      }
    },
    [loadMoreCards, isLoading, isLoadEnd],
  );

  useImperativeHandle(ref, () => ({
    handleScroll,
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [currentPostData, setCurrentPostData] = useState<IPostItem | undefined>(undefined);
  const openDetail = () => {
    setIsOpen(true);
  };

  const onCloseModal = (post: IPostItem, index: number) => {
    setCurrentPostData(undefined);
    setCurrentPostIndex(-1);
    postList.splice(index, 1, post);
    setPostList(postList);
    setIsOpen(false);
  };

  const onShowDetail = (postData: IPostItem, index: number) => {
    setCurrentPostEditOrCreateMode('create');
    setCurrentPostData(postData);
    setCurrentPostIndex(index);
    openDetail();
  };

  const onPostEdit = (postData: IPostItem, index: number) => {
    setCurrentPostEditOrCreateMode('edit');
    setCurrentPostData(postData);
    setCurrentPostIndex(index);
    setIsOpenPostFormModal(true);
  };

  const setIsOpenPostFormModal = useEventBusStore((s) => s.setIsOpenPostFormModal);
  const isOpenPostFormModal = useEventBusStore((s) => s.isOpenPostFormModal);
  const onDeletePost = () => {
    onRefreshPostList();
  };
  const onSubmitPost = (suc: boolean) => {
    !!suc && onRefreshPostList();
  };

  const onCloseEditPost = () => {
    setCurrentPostEditOrCreateMode('create');
    setIsOpenPostFormModal(false);
    setCurrentPostData(undefined);
    setCurrentPostIndex(-1);
  };

  return (
    <>
      <PostDetailModal
        index={currentPostIndex}
        onClose={onCloseModal}
        open={isOpen}
        post={currentPostData}
      />
      <PostFormModal
        index={currentPostIndex}
        open={isOpenPostFormModal}
        post={currentPostData}
        mode={currentPostEditOrCreateMode}
        onClose={onCloseEditPost}
        postCb={(suc) => {
          onSubmitPost(suc);
        }}
      />
      {!!postList.length && (
        <div className="grid grid-cols-1 gap-4 p-4 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {postList.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              onShowDetail={onShowDetail}
              onPostEdit={onPostEdit}
              onDelete={onDeletePost}
            />
          ))}
        </div>
      )}
      {!isLoading && isLoadEnd && postList.length === 0 && (
        <div className="m-auto mt-64 flex flex-col items-center justify-center gap-4">
          <BanknotesIcon className="text-potato-500 h-12 w-12" />
          <p className="text-center text-lg">No post found...</p>
        </div>
      )}
      {isLoading && !isLoadEnd && <Spinner color="amber" className="m-auto mt-64 h-12 w-12" />}
      <HiRefresh
        className={`fixed bottom-[50px] right-[50px] z-20 rounded-full text-2xl hover:cursor-pointer ${isLoading ? 'animate-spin' : ''}`}
        onClick={onRefreshPostList}
      ></HiRefresh>
    </>
  );
});
export default PostPostList;
