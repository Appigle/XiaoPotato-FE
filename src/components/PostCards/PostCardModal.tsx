import defaultUserAvatar from '@/assets/MonaLisaAvatar.png';
import defaultPostImg from '@/assets/Sunrise.png';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Avatar, Button, Carousel, Dialog, DialogBody } from '@material-tailwind/react';
import { IPostItem, typePostCardCommentRef } from '@src/@types/typePostItem';
import Api from '@src/Api';
import useGlobalStore from '@src/stores/useGlobalStore';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import { formatLargeNumber, formatStringWithTagAndUrl } from '@src/utils/stringUtils';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { GoCommentDiscussion } from 'react-icons/go';
import HeartEffect from '../HeartEffect';
import PostCardComment from './PostCardComment';
interface PostDetailModalProps {
  open?: boolean;
  index: number;
  post?: IPostItem;
  onClose?: (post: IPostItem, index: number) => void;
}
const PostDetailModal = ({ post: _post, open = false, onClose, index }: PostDetailModalProps) => {
  const [post, setPostData] = useState(_post);
  const [isOpen, setIsOpen] = useState(open);
  const [postImage, setPostImage] = useState(post?.postImage || '');
  const [postAvatar, setPostAvatar] = useState(post?.userAvatar || '');
  const userInfo = useGlobalStore((s) => s.userInfo);
  // const post = useGlobalStore((s) => s.post);
  const postCardCommentRef = useRef<typePostCardCommentRef>(null);
  const handleOpen = (e: boolean) => {
    setPostData(undefined);
    setIsOpen(!!e);
    !e && onClose?.(post!, index);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(open);
    }, 100);
  }, [open]);

  useEffect(() => {
    setPostData(_post);
    setPostImage(_post?.postImage || '');
    setPostAvatar(_post?.userAvatar || '');
  }, [_post]);

  if (!post) {
    return null;
  }

  const handleImageError = () => {
    setPostImage(defaultPostImg);
  };
  const handleAvatarError = () => {
    setPostAvatar(defaultUserAvatar);
  };
  const onSave = () => {
    Api.xPotatoApi.postSave({ id: post.id }).then((res) => {
      if (res.code === HTTP_RES_CODE.SUCCESS) {
        const saved = res.data;
        setPostData({
          ...post,
          saved: saved,
          saveCount: saved ? post.saveCount + 1 : post.saveCount - 1,
        });
      }
    });
  };

  const onLike = (isLike: boolean) => {
    Api.xPotatoApi.postLike({ id: post.id, liked: isLike }).then((res) => {
      const { data: isLikeSuc, code } = res;
      if (code === HTTP_RES_CODE.SUCCESS) {
        setPostData({
          ...post,
          likeCount: isLikeSuc ? post.likeCount + 1 : post.likeCount - 1,
          liked: isLikeSuc,
        });
      }
    });
  };

  const onFollow = () => {
    Api.xPotatoApi.followUser({ id: post.creatorId }).then((res) => {
      const { data: isFollowSuc, code } = res;
      if (code === HTTP_RES_CODE.SUCCESS) {
        setPostData({
          ...post,
          followed: isFollowSuc,
        });
      }
    });
  };
  const handleComment = () => {
    postCardCommentRef.current?.goToComment();
  };

  return (
    <Dialog
      open={isOpen}
      size="lg"
      handler={handleOpen}
      className="arial-modal bg-blue-gray-100 dark:bg-blue-gray-900"
    >
      <DialogBody className="relative flex min-h-80 gap-4">
        <div
          onClick={() => handleOpen(false)}
          className="hover: absolute right-[-30px] top-[-30px] inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-blue-gray-100 p-2 hover:bg-blue-gray-300"
        >
          X
        </div>
        <div className="w-3/5">
          <Carousel
            className="rounded-ls rounded-r-none"
            prevArrow={() => null}
            nextArrow={() => null}
          >
            <div className="flex h-full w-fit items-center">
              <img
                src={postImage}
                onError={handleImageError}
                alt={post.postTitle}
                className="h-fit max-h-[80vh] w-full object-contain"
              />
            </div>
          </Carousel>
        </div>
        <div className="mt-4 flex w-2/5 flex-col">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Avatar
                src={postAvatar}
                onError={handleAvatarError}
                alt={post.userFirstName}
                size="sm"
              />
              <span
                className="text-md text-blue-gray-900 dark:text-gray-100"
                title={userInfo?.firstName}
              >
                {userInfo?.firstName}
              </span>
            </div>
            {post.creatorId !== userInfo?.id && (
              <Button
                size="sm"
                onClick={onFollow}
                className="bg-blue-gray-900 text-gray-100 dark:bg-gray-100 dark:text-blue-gray-900"
              >
                {post.followed ? (
                  <span className="text-red-600">UnFollow</span>
                ) : (
                  <span className="text-blue-gray-900">Follow</span>
                )}
              </Button>
            )}
          </div>
          <div className="scrollbar-hide mt-4 flex max-h-[70vh] flex-1 flex-col gap-4 overflow-auto py-4">
            <h3 className="text-xl text-blue-gray-900 dark:text-gray-100">{post.postTitle}</h3>
            <p className="text-sm text-blue-gray-900 dark:text-gray-100">
              {formatStringWithTagAndUrl(post.postContent)}
            </p>
            <p className="flex items-center justify-end px-2 text-[12px] text-blue-gray-800 dark:text-gray-400">
              Create at: {dayjs(post.createTime).format('MM/DD/YYYY')}
            </p>
            <div className="h-[1px] w-full border-b-[1px] border-dashed border-b-gray-400"></div>
            <PostCardComment postId={post.id} ref={postCardCommentRef} />
          </div>
          <div className="ml-4 mr-4 flex items-center justify-end gap-4">
            <div className="flex items-center gap-2">
              {formatLargeNumber(post.saveCount)}
              {post.saved ? (
                <StarSolidIcon
                  className="z-10 mb-4 mt-4 size-6 cursor-pointer text-red-700"
                  onClick={onSave}
                />
              ) : (
                <StarIcon className="z-10 mb-4 mt-4 size-6 cursor-pointer" onClick={onSave} />
              )}
            </div>
            <div className="flex items-center gap-2">
              {formatLargeNumber(post.likeCount)}
              <HeartEffect
                height={64}
                width={64}
                checked={post.liked}
                onChange={(b: boolean) => onLike(b)}
              />
            </div>
            <GoCommentDiscussion
              className="z-10 mb-4 mt-4 size-6 cursor-pointer"
              onClick={handleComment}
            />
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default PostDetailModal;
