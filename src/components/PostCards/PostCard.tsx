import defaultUserAvatar from '@/assets/MonaLisaAvatar.png';
import defaultPostImg from '@/assets/Sunrise.png';
import {
  CheckCircleIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from '@material-tailwind/react';
import { IPostItem } from '@src/@types/typePostItem';
import Api from '@src/Api';
import HeartEffect from '@src/components/HeartEffect/index';
import useGlobalStore from '@src/stores/useGlobalStore';
import { useGoToProfile } from '@src/utils/hooks/nav';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import { useEffect, useState } from 'react';
type PostCardProps = {
  post: IPostItem;
  index: number;
  onDelete?: (post: IPostItem) => void;
  onLikeChange?: (isLike: boolean, post: IPostItem) => void;
  onShowDetail?: (post: IPostItem, index: number) => void;
  onPostEdit?: (post: IPostItem, index: number) => void;
};
const PostCard = (props: PostCardProps) => {
  const { post: originalPost, onShowDetail, onDelete, onPostEdit, index } = props;
  const [post, setPost] = useState(originalPost);
  const userInfo = useGlobalStore((s) => s.userInfo);
  const [postImage, setPostImage] = useState(post.postImage || '');
  const [userAvatar, setUserAvatar] = useState(post.creatorAvatar || '');
  const [iconSize, setIconSize] = useState('h-8 w-8');
  const [isConfirming, setIsConfirming] = useState(false);
  const gotoProfile = useGoToProfile();

  const onLike = (isLike: boolean) => {
    console.log('%c [ isLike ]-37', 'font-size:13px; background:pink; color:#bf2c9f;', isLike);
    Api.xPotatoApi.postLike({ id: post.id as number }).then((res) => {
      const { data: isLikeSuc, code } = res;
      if (code === HTTP_RES_CODE.SUCCESS) {
        setPost({
          ...post,
          likeCount: isLikeSuc ? post.likeCount + 1 : post.likeCount - 1,
          liked: isLikeSuc,
        });
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setIconSize('h-8 w-8');
    });
  }, [iconSize]);

  const openDetail = () => {
    onShowDetail?.(post, index);
  };
  const openPostEdit = () => {
    onPostEdit?.(post, index);
  };

  const handleImageError = () => {
    setPostImage(defaultPostImg);
  };
  const handleAvatarError = () => {
    setUserAvatar(defaultUserAvatar);
  };

  const onDeletePost = () => {
    setIsConfirming(true);
  };

  const onConfirmDelete = () => {
    Api.xPotatoApi.postDelete({ id: post.id }).then((res) => {
      if (res.code === HTTP_RES_CODE.SUCCESS) {
        onDelete?.(post);
      }
    });
  };
  const onCancelDelete = () => {
    setIsConfirming(false);
  };

  useEffect(() => {
    setPost(originalPost);
  }, [originalPost]);

  return (
    <Card
      key={post.id}
      className="dark: max-w-sm overflow-hidden bg-gray-100 shadow-md shadow-blue-gray-500 dark:bg-blue-gray-900"
    >
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 cursor-pointer rounded-none"
        onClick={openDetail}
      >
        <img src={postImage} onError={handleImageError} alt={post.postTitle} className="w-full" />
      </CardHeader>
      <CardBody className="flex flex-1 cursor-pointer" onClick={openDetail}>
        <Typography
          variant="paragraph"
          title={post.postTitle}
          className="text-md three-line-ellipsis text-blue-900 dark:text-gray-100"
        >
          {post.postTitle}
        </Typography>
      </CardBody>
      <CardFooter className="flex items-center !p-4">
        <div className="flex w-full flex-1 items-center justify-between gap-2">
          <Typography
            variant="small"
            className="flex w-fit items-center overflow-hidden text-ellipsis whitespace-nowrap text-blue-gray-900 dark:text-gray-100"
          >
            <Avatar
              onError={handleAvatarError}
              src={userAvatar}
              alt={post.creatorFirstName}
              size="sm"
              onClick={() => {
                gotoProfile(post.creatorId);
              }}
              className="hover:cursor-pointer hover:opacity-50"
            />
            <span className="ml-2 text-sm" title={post.creatorFirstName}>
              {post.creatorFirstName}.{post.creatorLastName?.[0]?.toUpperCase()}
            </span>
          </Typography>
          <div className="flex flex-1 items-center justify-end">
            <Typography
              variant="small"
              color="gray"
              className="ml-2 flex items-center justify-end gap-1 text-blue-gray-900 dark:text-gray-100"
            >
              <span className="select-none">{post.likeCount}</span>
              <span className="hidden select-none text-sm xl:inline-block">likes</span>
            </Typography>
            <HeartEffect
              checked={post.liked}
              height={60}
              width={60}
              onChange={(b: boolean) => onLike(b)}
            />
            {(userInfo?.id === post.creatorId || userInfo?.userRole === 'admin') && (
              <Popover placement="top-start">
                <PopoverHandler>
                  <EllipsisVerticalIcon className="z-10 h-5 w-5 cursor-pointer rounded-sm dark:hover:bg-blue-gray-300 dark:hover:text-blue-gray-50" />
                </PopoverHandler>
                <PopoverContent className="flex items-center justify-center gap-2 bg-blue-gray-900 text-gray-100 dark:border-blue-gray-300 dark:bg-blue-gray-800 dark:text-white">
                  {!isConfirming ? (
                    <>
                      <TrashIcon
                        className="h-5 w-5 cursor-pointer hover:text-red-500"
                        onClick={onDeletePost}
                      />
                      <PencilSquareIcon
                        className="h-5 w-5 cursor-pointer hover:text-blue-500"
                        onClick={openPostEdit}
                      />
                    </>
                  ) : (
                    <>
                      <XCircleIcon
                        className="w6 hover: h-6 cursor-pointer hover:rounded-lg hover:bg-blue-gray-100"
                        onClick={onCancelDelete}
                      />
                      <CheckCircleIcon
                        className="w6 h-6 cursor-pointer text-red-600 hover:rounded-lg hover:bg-blue-gray-100"
                        onClick={onConfirmDelete}
                      />
                    </>
                  )}
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
