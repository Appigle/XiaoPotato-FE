import defaultUserAvatar from '@/assets/MonaLisaAvatar.png';
import defaultPostImg from '@/assets/Sunrise.png';
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from '@material-tailwind/react';
import { IPostItem } from '@src/@types/typePostItem';
import Api from '@src/Api';
import HeartEffect from '@src/components/HeartEffect/index';
import useGlobalStore from '@src/stores/useGlobalStore';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import { useEffect, useState } from 'react';
type PostCardProps = {
  post: IPostItem;
  index: number;
  onShowDetail?: (post: IPostItem) => void;
};
const PostCard = (props: PostCardProps) => {
  const { post: originalPost, onShowDetail } = props;
  const [post, setPost] = useState(originalPost);
  const userInfo = useGlobalStore((s) => s.userInfo);
  const [postImage, setPostImage] = useState(post.postImage?.[0] || '');
  const [userAvatar, setUserAvatar] = useState(userInfo?.userAvatar || '');
  const [iconSize, setIconSize] = useState('h-8 w-8');
  const onLike = (isLike: boolean) => {
    console.log('%c [ isLike ]-25', 'font-size:13px; background:pink; color:#bf2c9f;', isLike);
    Api.xPotatoApi.postLike({ id: post.id as number }).then((res) => {
      const { data: isLikeSuc, code } = res;
      if (code === HTTP_RES_CODE.SUCCESS) {
        setPost({
          ...post,
          likeCount: isLikeSuc ? post.likeCount + 1 : post.likeCount - 1,
          isLiked: isLikeSuc,
        });
      }
    });
    // setPost({ ...post, likes: isLike ? post.likes + 1 : post.likes - 1, isLiked: !post.isLiked });
    // setIsLiked(isLike);
    // setIconSize('h-9 w-9');
  };

  useEffect(() => {
    setTimeout(() => {
      setIconSize('h-8 w-8');
    });
  }, [iconSize]);

  const openDetail = () => {
    onShowDetail?.(post);
  };

  const handleImageError = () => {
    setPostImage(defaultPostImg);
  };
  const handleAvatarError = () => {
    console.log(
      '%c [ handleAvatarError ]-60',
      'font-size:13px; background:pink; color:#bf2c9f;',
      defaultUserAvatar,
    );
    setUserAvatar(defaultUserAvatar);
  };

  return (
    <Card
      key={post.id}
      className="aria-modal dark: max-w-sm overflow-hidden bg-gray-100 shadow-md shadow-blue-gray-500 dark:bg-blue-gray-900"
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
        <div className="flex w-full flex-1 items-center justify-between">
          <Typography
            variant="small"
            className="flex w-fit items-center overflow-hidden text-ellipsis whitespace-nowrap text-blue-gray-900 dark:text-gray-100"
          >
            <Avatar
              onError={handleAvatarError}
              src={userAvatar}
              alt={userInfo?.lastName}
              size="sm"
            />
            <span className="ml-2 text-sm" title={userInfo?.lastName}>
              {userInfo?.lastName}
            </span>
          </Typography>
          <div className="flex flex-1 items-center justify-end">
            <Typography
              variant="small"
              color="gray"
              className="ml-2 flex items-center justify-end gap-1"
            >
              <span className="select-none">{post.likeCount}</span>
              <span className="hidden select-none text-sm xl:inline-block">likes</span>
            </Typography>

            <HeartEffect
              checked={post.isLiked}
              height={60}
              width={60}
              onChange={(b: boolean) => onLike(b)}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
